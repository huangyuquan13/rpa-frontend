import { request } from '@umijs/max';

/** 1.1 获取当前登录用户个人信息 GET */
export async function getProfile() {
  return request('/api/v1/system/profile', {
    method: 'GET',
  });
}

/** 1.2 更新个人信息（部分更新） PUT */
export async function updateProfile(data: {
  nickname?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}) {
  return request('/api/v1/system/profile', {
    method: 'PUT',
    data,
  });
}

/** 1.3 修改密码 PUT */
export async function updatePassword(data: any) {
  return request('/api/v1/system/profile/password', {
    method: 'PUT',
    data,
  });
}

/**
 * 1.4 获取当前用户的动态菜单树 (用于左侧导航栏过滤)
 * @returns 树形菜单数组
 */
export async function getDynamicMenus() {
  return request('/api/v1/system/profile/menus', {
    method: 'GET',
  });
}
