import { request } from '@umijs/max';

/** 登录接口  */
export async function login(data: any) {
  return request('/api/v1/system/auth/login', {
    method: 'POST',
    data: data, // 这里的 data 就是你表单传过来的 {username, password}
  });
}
/** 退出登录  */
export async function logout() {
  return request('/api/v1/system/auth/logout', { method: 'POST' });
}

/** 注册接口 POST */
export async function register(data: any) {
  return request('/api/v1/system/auth/register', {
    method: 'POST',
    data,
  });
}
