import { request } from '@umijs/max';

/** 5.1 查询任务列表 */
export async function getTaskList(params: {
  taskCodeOrName?: string;
  taskStatus?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return request('/api/v1/system/tasks/list', { method: 'GET', params });
}

/** 5.2 新建任务 */
export async function createTask(data: any) {
  return request('/api/v1/system/tasks/create', { method: 'POST', data });
}

/** 5.3 编辑任务 */
export async function updateTask(data: any) {
  return request('/api/v1/system/tasks/update', { method: 'PUT', data });
}

/** 5.4 查看任务详情 */
export async function getTaskDetail(taskCode: string) {
  return request(`/api/v1/system/tasks/detail/${taskCode}`, { method: 'GET' });
}

/** 5.5 执行任务 */
export async function executeTask(taskCode: string) {
  return request(`/api/v1/system/tasks/execute/${taskCode}`, {
    method: 'POST',
  });
}

/** 5.6 删除任务 */
export async function deleteTask(taskCode: string) {
  return request(`/api/v1/system/tasks/delete/${taskCode}`, {
    method: 'DELETE',
  });
}
