import { request } from '@umijs/max';

/** 分页查询用户列表 GET */
export async function getUserList(params: {
  username?: string;
  nickname?: string;
  roleName?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return request('/api/v1/system/users', {
    method: 'GET',
    params, // 🌟 GET 参数放在 params 中
  });
}

/** 获取指定用户详情 GET */
export async function getUserDetail(id: number) {
  return request(`/api/v1/system/users/${id}`, {
    method: 'GET',
  });
}

/** 创建新用户 POST */
export async function createUser(data: any) {
  return request('/api/v1/system/users', {
    method: 'POST',
    data, // 🌟 POST 数据放在 data 中
  });
}

/** 修改用户信息 PUT */
export async function updateUser(id: number, data: any) {
  return request(`/api/v1/system/users/${id}`, {
    method: 'PUT',
    data, // 🌟 路径参数拼接在 URL，修改内容放在 data
  });
}

/** 重置用户密码 PUT */
export async function resetUserPassword(id: number) {
  return request(`/api/v1/system/users/${id}/reset-password`, {
    method: 'PUT',
    // 即使 body 为空，PUT 请求通常也需要带一个空对象或不传 data
  });
}

/** 删除指定用户 DELETE */
export async function deleteUser(id: number) {
  return request(`/api/v1/system/users/${id}`, {
    method: 'DELETE',
  });
}

/** 修改用户状态 POST */
export async function updateUserStatus(id: number) {
  return request(`/api/v1/system/users/${id}/status`, {
    method: 'POST',
    // 如果后端以后要求传具体的 status 值，可以在这里加 data
  });
}
