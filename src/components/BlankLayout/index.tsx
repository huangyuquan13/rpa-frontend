import { Outlet } from '@umijs/max';
import React from 'react';

const BlankLayout: React.FC = () => {
  // 仅渲染 Outlet，无任何状态/副作用
  //嵌套渲染中断 允许三级页面的内容在二级
  return <Outlet />;
};

export default BlankLayout;
