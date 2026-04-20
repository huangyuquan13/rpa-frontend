import { request } from '@umijs/max';

/**
 * 4.1 查询资源列表（支持树形结构）
 * @param params 包含 tree, resourceName, resourceType, pageNum, pageSize
 */
export async function getResourceList(params: {
  tree?: boolean;
  resourceName?: string;
  resourceType?: number;
  pageNum?: number;
  pageSize?: number;
}) {
  return request('/api/v1/system/resources', {
    method: 'GET',
    params,
  });
}

/**
 * 4.2 新增资源
 * @param data 包含 resourceCode, resourceName, resourceType, parentId 等字段
 */
export async function createResource(data: {
  resourceCode: string;
  resourceName: string;
  resourceType: number;
  parentId: number;
  path?: string;
  icon?: string;
  sortOrder?: number;
  status?: number;
}) {
  return request('/api/v1/system/resources', {
    method: 'POST',
    data,
  });
}

/**
 * 4.3 编辑资源
 * @param id 资源ID
 * @param data 资源修改信息（所有字段可选）
 */
export async function updateResource(
  id: number,
  data: {
    resourceCode?: string;
    resourceName?: string;
    resourceType?: number;
    parentId?: number;
    path?: string;
    icon?: string;
    sortOrder?: number;
    status?: number;
  },
) {
  return request(`/api/v1/system/resources/${id}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 4.4 删除资源
 * @param id 资源ID
 */
export async function deleteResource(id: number) {
  return request(`/api/v1/system/resources/${id}`, {
    method: 'DELETE',
  });
}
