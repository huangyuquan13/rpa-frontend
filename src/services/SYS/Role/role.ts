import { request } from '@umijs/max';

/**
 * 3.1 分页查询角色列表 GET
 * @param params 包含 roleName, roleCode, pageNum, pageSize
 */
export async function getRoleList(params: {
  roleName?: string;
  roleCode?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return request('/api/v1/system/roles', {
    method: 'GET',
    params,
  });
}

/**
 * 3.1.1 查询指定角色的权限列表 GET  (可选)
 * @param id 角色 ID
 */
export async function getRolePermissions(id: number) {
  return request(`/api/v1/system/roles/${id}/permissions`, {
    method: 'GET',
  });
}

/**
 * 3.2 创建新角色 POST
 * @param data 包含 roleCode, roleName, description, status
 */
export async function createRole(data: {
  roleCode: string;
  roleName: string;
  description?: string;
  status?: number;
}) {
  return request('/api/v1/system/roles', {
    method: 'POST',
    data,
  });
}

/**
 * 3.3 修改角色基本信息 PUT
 * @param id 角色 ID
 * @param data 包含 roleCode, roleName, description, status
 */
export async function updateRole(
  id: number,
  data: {
    roleCode?: string;
    roleName?: string;
    description?: string;
    status?: number;
  },
) {
  return request(`/api/v1/system/roles/${id}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 3.4 角色权限分配 POST
 * @param id 角色 ID
 * @param data 包含 resourceIds 数组
 */
export async function assignRolePermissions(
  id: number,
  data: {
    resourceIds: number[];
  },
) {
  return request(`/api/v1/system/roles/${id}/permissions`, {
    method: 'POST',
    data,
  });
}

/**
 * 3.5 删除角色 DELETE
 * @param id 角色 ID
 */
export async function deleteRole(id: number) {
  return request(`/api/v1/system/roles/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 3.6 获取资源信息 GET
 */
export async function getRoleResources() {
  return request('/api/v1/system/roles/resources', {
    method: 'GET',
  });
}
