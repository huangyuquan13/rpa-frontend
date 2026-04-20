import { useAccess } from '@umijs/max';
import React from 'react';

type Props = {
  code: string;
  children: React.ReactElement; // 注意：这里改回 ReactElement，确保它是单个 React 元素
};

const AuthButton = ({ code, children }: Props) => {
  const access = useAccess();

  // 1. 权限检查：没权限直接不渲染
  if (!access.canButton(code)) {
    return null;
  }

  // 2. 有权限时，使用 cloneElement 确保父组件（如 ModalForm）注入的 props（如 onClick）能传给 Button
  // 这样可以解决“按钮显示了但点不动”的问题
  return React.cloneElement(children, {
    ...children.props,
  });
};

export default AuthButton;
