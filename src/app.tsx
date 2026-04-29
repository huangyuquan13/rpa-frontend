// src/app.tsx
import { getDynamicMenus } from '@/services/SYS/Person/profile';

import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import { Dropdown, message, Space } from 'antd';
import React, { useEffect } from 'react';

// === 自动重定向组件 ===
// 用于当访问带有子菜单但自身无组件的父路径（如 /sys）时，自动跳转到它的第一个子节点
const AutoRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    history.replace(to);
  }, [to]);
  return null;
};

// === 递归寻找第一个叶子节点 ===
const getFirstLeafPath = (nodes: any[]): string | null => {
  for (const node of nodes) {
    if (node.path) {
      if (!node.children || node.children.length === 0) {
        return node.path;
      }
      const leafPath = getFirstLeafPath(node.children);
      if (leafPath) return leafPath;
    }
  }
  return null;
};

// === 真动态路由组件映射表 ===
// 此处映射后端 component 字段到真实 React 组件 按需加载
const ComponentMap: Record<string, React.FC> = {
  './Home': React.lazy(() => import('@/pages/Home')),
  '@/components/BlankLayout': React.lazy(() => import('@/components/BlankLayout')),
  './RPA/Task/List': React.lazy(() => import('@/pages/RPA/Task/List')),
  './RPA/Task/Record': React.lazy(() => import('@/pages/RPA/Task/Record')),
  './RPA/Robot/List': React.lazy(() => import('@/pages/RPA/Robot/List')),
  './RPA/Process/List': React.lazy(() => import('@/pages/RPA/Process/List')),
  './RPA/Data/Collect': React.lazy(() => import('@/pages/RPA/Data/Collect')),
  './RPA/Data/Parse': React.lazy(() => import('@/pages/RPA/Data/Parse')),
  './RPA/Data/Process': React.lazy(() => import('@/pages/RPA/Data/Process')),
  './RPA/Data/Query': React.lazy(() => import('@/pages/RPA/Data/Query')),
  './SYS/Person': React.lazy(() => import('@/pages/SYS/Person')),
  './SYS/UserManage': React.lazy(() => import('@/pages/SYS/UserManage')),
  './SYS/RoleManage': React.lazy(() => import('@/pages/SYS/RoleManage')),
  './SYS/ResourceManage': React.lazy(() => import('@/pages/SYS/ResourceManage')),
  './RPA/Task/List/listdetail.tsx': React.lazy(() => import('@/pages/RPA/Task/List/listdetail')),
};

// 存储后端的动态路由数据
let extraRoutes: any[] = [];
//执行在页面渲染前 render拉取数据 将权限菜单树存储到数组中
export async function render(oldRender: () => void) {
  const token = localStorage.getItem('token');
  if (!token) {
    oldRender();
    return;
  }
  
  try {
    const baseURL = process.env.NODE_ENV === 'production' 
      ? 'http://localhost:8080' 
      : '';
    // 获取当前用户的动态菜单树
    const res = await fetch(`${baseURL}/api/v1/system/profile/menus`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    // console.log('Backend Menu Response:', result);
    if (result.code === 200) {
      extraRoutes = result.data || [];
      // console.log('extraRoutes assigned:', extraRoutes);
    }
  } catch (error) {
    console.error('动态获取路由失败', error);
  }
  
  oldRender();
}
//执行在路由生成前
export function patchClientRoutes({ routes }: any) {
  // console.log('Original Routes in patchClientRoutes:', routes);
  // 找umirc的原始路由
  const layoutRoute = routes.find((r: any) => 
    r.id === 'ant-design-pro-layout' || 
    r.id === 'umi-plugin-layout' ||
    (r.path === '/' && r.children)
  );
  
  // console.log('Found Layout Route:', layoutRoute);

  if (layoutRoute && extraRoutes.length > 0) {
    const parseDynamicRoutes = (menuList: any[]): any[] => {
      // 核心修复：必须过滤掉按钮权限节点（没有 path 或 resourceType === 2 的节点）
      // 否则 Umi ProLayout 解析时会因为 path 为 null 报 endsWith 错误
      const validMenus = menuList.filter((item) => item.path && item.resourceType !== 2);
      
      return validMenus.map((item) => {
        const route: any = {
          path: item.path,
          name: item.resourceName,
          // icon: item.icon, // 绑定图标
          key: item.path, // 显式给一个 key
        };
        // 绑定组件
        if (item.component && ComponentMap[item.component]) {
          const Component = ComponentMap[item.component];
          route.element = (
            <React.Suspense fallback={<div>Loading...</div>}>
              <Component />
            </React.Suspense>
          );
          // console.log(`Mapped component for ${item.path}: ${item.component}`);
        } else if (item.path) {
          console.warn(`No component mapped for path: ${item.path}, component: ${item.component}`);
        }
        // 递归处理子路由 (Umi 4 / RR6 使用 children，ProLayout 使用 routes)
        if (item.children && item.children.length > 0) {
          const children = parseDynamicRoutes(item.children);
          if (children.length > 0) {
            route.children = [...children];
            route.routes = [...children];
            
            // 【自动重定向逻辑】：如果当前节点包含子级，
            // 我们为其注入一个 index 路由，自动跳转到该分支下第一个真实的叶子节点路径（如 /rpa -> /rpa/task/list）
            // 即使父节点配置了诸如 BlankLayout，访问父路径时也会被 index 路由捕获并重定向
            const leafPath = getFirstLeafPath(children);
            if (leafPath) {
              route.children.unshift({
                index: true,
                element: <AutoRedirect to={leafPath} />,
                exact: true
              });
            }
          }
        }
        return route;
      });
    };

    const dynamicRoutes = parseDynamicRoutes(extraRoutes);
    // console.log('Dynamic Routes to be injected:', dynamicRoutes);
    
    if (!layoutRoute.children) layoutRoute.children = [];
    if (!layoutRoute.routes) layoutRoute.routes = [];
    
    layoutRoute.children = [...layoutRoute.children, ...dynamicRoutes];
    layoutRoute.routes = [...layoutRoute.routes, ...dynamicRoutes];
    
    // console.log('Updated Layout Route structure:', layoutRoute);
  } else {
    console.error('Layout Route or extraRoutes is missing!', { layoutRoute, extraRoutesCount: extraRoutes.length });
  }
}


//0.扁平化递归菜单 以及按钮权限
const parsePermissions = (menus: any[]) => {
  let paths: string[] = [];
  let buttons: string[] = [];

  const loop = (list: any[]) => {
    list.forEach((item) => {
      // 菜单权限（有 path）
      if (item.path) {
        paths.push(item.path);
      }

      // 按钮权限（resourceType === 2）
      if (item.resourceType === 2 && item.resourceCode) {
        buttons.push(item.resourceCode);
      }

      // 递归 children
      if (item.children && item.children.length > 0) {
        loop(item.children);
      }
    });
  };
  //调用
  loop(menus);

  return {
    paths,
    buttons,
  };
};

// 1. 初始化状态 在刷新页面或者刚打开网页时执行一次。
export async function getInitialState() {
  const token = localStorage.getItem('token');
  if (!token) return { currentUser: undefined, authorizedPaths: [] };

  const savedUserInfo = localStorage.getItem('userInfo');
  try {
    // 核心点：因为你存的时候已经是 res.data.data.userInfo 这一层了
    // 所以解析出来直接赋值给 currentUser 即可
    //浏览器只能存字符串
    //这里判断逻辑 如果存在 就变成对象 赋值给currentUser 不存在就赋值为undefined
    const currentUser = savedUserInfo ? JSON.parse(savedUserInfo) : undefined;
    let authorizedPaths: string[] = []; // 定义一个装权限路径的空数组
    let buttonPermissions: string[] = []; //定义一个装按钮的资源编码 判断权限
    if (currentUser) {
      // 发起请求，获取属于当前用户的c菜单树  与权限和按钮共用
      const menuRes = await getDynamicMenus();

      // debugger;
      // 调用上面的辅助函数，把树结构打平成简单的一维字符串数组
      const { paths, buttons } = parsePermissions(menuRes?.data || []);
      authorizedPaths = paths;
      buttonPermissions = buttons;
    }
    //返回的initialState全局变量
    return {
      currentUser,
      authorizedPaths,
      buttonPermissions,
      settings: {}, // 其他配置项
    };
  } catch (e) {
    // 如果解析出错（比如数据格式坏了），清空缓存
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    return { currentUser: undefined, authorizedPaths: [] };
  }
}

// 2. 布局配置
export const layout = ({ initialState, setInitialState }: any) => {
  return {
    title: 'RPA运营管理系统',
    layout: 'mix',
    splitMenus: true, //上左双层菜单
    currentUser: initialState?.currentUser, //登录信息传递给顶栏组件
    //开启全局路由守卫 路由变执行 最先触发 在login组件前
    onPageChange: () => {
      const { location } = history; //解构
      // console.log('历史', history);
      const token = localStorage.getItem('token'); // 实时从硬盘拿 token

      // 1. 如果没有 token，且当前不是在登录页，强制踢回登录
      if (!token && location.pathname !== '/login') {
        message.warning('请先登录！');
        history.push('/login');
        return;
      }

      // 2. 如果已经有 token，用户还想手动去 /login，把他踢回首页
      if (token && location.pathname === '/login') {
        history.push('/home');
      }
    },

    // 头像与下拉菜单配置
    //?前面的存在嘛 存在 往下执行 不存在直接返回null/undefine 避免null.某个方法
    avatarProps: {
      src:
        initialState?.currentUser?.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          initialState?.currentUser?.nickname || 'Admin',
        )}&background=0D8ABC&color=fff`,
      title: initialState?.currentUser?.nickname || '管理员',
      render: (_: any, avatarChildren: any) => {
        return (
          <Dropdown
            menu={{
              items: [
                { key: 'info', icon: <UserOutlined />, label: '个人信息' },
                { key: 'settings', icon: <SettingOutlined />, label: '设置' },
                { type: 'divider' },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                  danger: true,
                },
              ],
              onClick: async ({ key }) => {
                if (key === 'logout') {
                  // 清理本地缓存，清理内存状态，跳回登录
                  localStorage.removeItem('token');
                  localStorage.removeItem('userInfo');
                  setInitialState({ currentUser: undefined });
                  history.replace('/login');
                }
                if (key === 'info') {
                  history.push('/sys/manager/information');
                }
                if (key === 'settings') {
                  message.info('设置功能开发中，敬请期待...');
                }
              },
            }}
            placement="bottomRight"
          >
            <Space style={{ cursor: 'pointer', padding: '0 8px' }}>
              {avatarChildren}
              <DownOutlined
                style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)' }}
              />
            </Space>
          </Dropdown>
        );
      },
    },

    // 动态菜单可以直接交给真动态路由处理（Umi 的 ProLayout 会自动读取 route 配置）
    // 或者如果你还想利用后端返回的结构直接生成侧边栏，保留 request 也可以，这里我们使用 true dynamic routing 后，
    // Umi 能够自动通过 routes 渲染，不需要我们再写 menu.request
    menu: {
      locale: false,
      defaultOpenAll: true,
      autoClose: false,
    },
  };
};

// 3.请求拦截器与响应拦截器
export const request = {
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'http://localhost:8080'
      : '',

  requestInterceptors: [
    (config: any) => {
      // 1. 从本地获取 token
      const token = localStorage.getItem('token');

      // 2. 如果 token 存在，则修改 headers
      if (token && config.headers) {
        // 注意：Bearer 后面一定要有一个空格！
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 3. 直接返回修改后的 config
      return config;
    },
  ],

  // responseInterceptors: [
  //   (response: any) => {
  //     const { data } = response;
  //     if (data?.code === 401) {
  //       message.error('登录已过期，请重新登录');
  //       localStorage.clear();
  //       history.replace('/login');
  //     }
  //     return response;
  //   },
  // ],
  //mock数据的版本
  responseInterceptors: [
    (response: any) => {
      //config是前端发起请求时候 携带的内容
      const { data, config } = response;

      //  1. 只有当不是登录接口，且返回 401 时，才认为是 Token 失效
      // config.url 是当前请求的路径
      const isLoginApi = config.url?.includes('/system/auth/login');

      if (data?.code === 401) {
        if (isLoginApi) {
          // 如果是登录接口报 401，我们什么都不做，直接把 response 给页面
          // 页面上的 handleSubmit 会走到 else 逻辑，弹出“用户名或密码错误”
          return response;
        } else {
          // 如果是其他接口（比如个人信息、列表等）报 401，才是真正的 Token 失效
          message.error('登录已过期，请重新登录');
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          history.replace('/login');
          // 这里可以返回一个 Promise.reject 防止页面继续执行后续逻辑
          return Promise.reject(data);
        }
      }

      //  2.处理其他非 200 的全局错误
      // 不为200且不是登录界面 提示后端返回的错误 没有就默认请求失败
      // 以后所有界面只用判断成功的情况
      if (data?.code !== 200 && !isLoginApi) {
        message.error(data?.msg || '请求失败');
      }

      return response;
    },
  ],
};
