export default (initialState: any) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  // 从全局初始化状态中获取当前用户信息以及权限
  const { authorizedPaths = [], buttonPermissions = [] } = initialState || {};

  return {
    //动态路由拦截器
    dynamicRouteFilter: (route: any) => {
      // 如果是首页（/home）或者根路径（/），我们默认所有人都能看，直接放行
      if (route.path === '/home' || route.path === '/') return true;

      //放行重定向的
      if (route.redirect) return true;
      //放行没有path的(比如Layout)
      if (!route.path) return true;
      //有子路由的一键放行
      if (route.routes) return true;
      // console.log('route.path', route.path);
      // console.log('authorizedPaths', authorizedPaths);
      // 查看用户有什么路由 有的返回true就显示 没有就隐藏
      return authorizedPaths.includes(route.path);
    },
    canButton: (code: string) => {
      return buttonPermissions.includes(code);
    },
  };
};
