import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  mock: false,
  esbuildMinifyIIFE: true, //解决 esbuild 辅助函数冲突
  layout: {
    title: 'RPA运营管理系统',
    layout: 'mix',
    splitMenus: true, //上左导航
  },
  proxy: {
    '/api': {
      // target: 'http://192.168.250.217:8080',
      // target: 'http://10.159.200.122:8080',
      target: 'http://localhost:8080',
      changeOrigin: true, // 允许跨域
      // pathRewrite: { '^/api': '' }, // 如果后端接口路径不带 /api，则需要重写
    },
  },
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: './Login',
      layout: false,
    },
    { name: '首页', path: '/home', component: './Home', icon: 'home' },

    // ================= RPA运营管理 (一级) =================
    {
      name: 'RPA运营管理',
      path: '/rpa',
      //删掉了这里的 redirect
      // access: 'dynamicRouteFilter',
      routes: [
        //  把它变成一个隐藏的子路由，专门负责精确重定向
        //当路径【精准】等于 /rpa 时，才触发跳转
        { path: '/rpa', redirect: '/rpa/task/list' },
        //二级 任务管理
        {
          name: '任务管理',
          path: '/rpa/task', // 杠是绝对路径 而不带的话就是相对可以继承 比如这里可以直接task
          component: '@/components/BlankLayout',
          routes: [
            {
              name: '任务列表',
              path: '/rpa/task/list',
              component: './RPA/Task/List',
              access: 'dynamicRouteFilter',
            },
            {
              name: '任务详情',
              path: '/rpa/task/list/:taskCode', // 这里加上 /: 使其成为子路径
              component: './RPA/Task/List/listdetail.tsx',
              hideInMenu: true, // 不在左侧菜单显示
            },
            {
              name: '执行记录',
              path: '/rpa/task/record',
              component: './RPA/Task/Record',
              access: 'dynamicRouteFilter',
            },
          ],
        },
        //二级  机器人管理
        {
          name: '机器人管理',
          path: '/rpa/robot',
          component: '@/components/BlankLayout',
          routes: [
            {
              name: '机器人列表',
              path: '/rpa/robot/list',
              component: './RPA/Robot/List',
              access: 'dynamicRouteFilter',
            },
          ],
        },
        //二级 流程管理
        {
          name: '流程管理',
          path: '/rpa/process',
          component: '@/components/BlankLayout',
          routes: [
            {
              name: '流程列表',
              path: '/rpa/process/list',
              component: './RPA/Process/List',
              access: 'dynamicRouteFilter',
            },
          ],
        },
        //二级 数据管理
        {
          name: '数据管理',
          path: '/rpa/data',
          component: '@/components/BlankLayout',
          routes: [
            {
              name: '数据采集',
              path: '/rpa/data/collect',
              component: './RPA/Data/Collect',
              access: 'dynamicRouteFilter',
            },
            {
              name: '数据解析',
              path: '/rpa/data/parse',
              component: './RPA/Data/Parse',
              access: 'dynamicRouteFilter',
            },
            {
              name: '数据加工',
              path: '/rpa/data/process',
              component: './RPA/Data/Process',
              access: 'dynamicRouteFilter',
            },
            {
              name: '数据查询',
              path: '/rpa/data/query',
              component: './RPA/Data/Query',
              access: 'dynamicRouteFilter',
            },
          ],
        },
      ],
    },

    // ================= 系统管理 (一级) =================
    {
      name: '系统管理',
      path: '/sys',
      // 删掉了这里的 redirect
      // access: 'dynamicRouteFilter',
      routes: [
        // 重定向子路由
        { path: '/sys', redirect: '/sys/manager/information' },
        //二级 系统管理
        {
          name: '系统管理',
          path: '/sys/manager',
          component: '@/components/BlankLayout',
          routes: [
            {
              name: '个人信息',
              path: '/sys/manager/information',
              component: './SYS/Person',
              access: 'dynamicRouteFilter',
            },
            {
              name: '用户管理',
              path: '/sys/manager/userManage',
              component: './SYS/UserManage',
              access: 'dynamicRouteFilter',
            },
            {
              name: '角色管理',
              path: '/sys/manager/roleManage',
              component: './SYS/RoleManage',
              access: 'dynamicRouteFilter',
            },
            {
              name: '资源管理',
              path: '/sys/manager/resourceManage',
              component: './SYS/ResourceManage',
              access: 'dynamicRouteFilter',
            },
          ],
        },
      ],
    },
  ],
  npmClient: 'pnpm',
});
