export default (initialState: any) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  // 从全局初始化状态中获取当前用户信息以及权限
  const { authorizedPaths = [], buttonPermissions = [] } = initialState || {};

  return {
    // 真动态路由模式下，路由的显示与隐藏已由后端下发的路由表决定，
    // 因此不再需要 dynamicRouteFilter 手动过滤静态路由。
    canButton: (code: string) => {
      return buttonPermissions.includes(code);
    },
  };
};
