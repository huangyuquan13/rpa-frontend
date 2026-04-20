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
//0.按钮列表详情数据
const extractButtons = (menus: any[]) => {
  let result: any[] = [];

  const loop = (list: any[]) => {
    list.forEach((item) => {
      // 只要按钮
      if (item.resourceType === 2) {
        result.push(item); // 存完整对象（方便页面用）
      }

      if (item.children && item.children.length > 0) {
        loop(item.children);
      }
    });
  };

  loop(menus);

  return result;
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
    let menuData: any[] = []; //所有的菜单数据
    let buttonList: any[] = []; //按钮所有对象数据
    if (currentUser) {
      // 发起请求，获取属于当前用户的菜单树  与权限和按钮共用
      const menuRes = await getDynamicMenus();

      // debugger;
      // 调用上面的辅助函数，把树结构打平成简单的一维字符串数组
      const { paths, buttons } = parsePermissions(menuRes?.data || []);
      buttonList = extractButtons(menuRes?.data || []); //提取按钮列表
      authorizedPaths = paths;
      buttonPermissions = buttons;
      menuData = menuRes?.data || []; //赋值
      console.log('菜单权限:', authorizedPaths);
      console.log('按钮权限:', buttonPermissions);
      console.log('menuRes:', menuData);
      console.log('应该渲染到界面上的按钮:', buttonList);
    }
    //返回的initialState全局变量
    return {
      currentUser,
      authorizedPaths,
      buttonPermissions,
      menuData,
      buttonList,
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
    key: initialState?.authorizedPaths?.join(','), //强制刷新
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

    menu: {
      locale: false, //显示routers中name文本
      defaultOpenAll: true, //默认全部打开
      autoClose: false, //切换时候不收起
      //动态菜单
      request: async () => {
        const transformMenu = (list: any[]): any[] => {
          return list
            .filter(
              (item) => item.resourceType !== 2 && !item.path?.includes(':'),
            )
            .map((item) => ({
              name: item.resourceName,
              path: item.path,
              // icon: item.icon || undefined,
              routes: item.children ? transformMenu(item.children) : undefined,
            }));
        };

        // 用 initialState 里的
        return transformMenu(initialState?.menuData || []);
      },
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
