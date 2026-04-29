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
  ],
  npmClient: 'pnpm',
});
