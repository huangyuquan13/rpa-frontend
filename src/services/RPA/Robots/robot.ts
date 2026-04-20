import { request } from '@umijs/max';

/**
 * 6.1 查询机器人列表（含统计）
 * @param params 包含 robotName, robotCode, status, pageNum, pageSize
 */
export async function getRobotList(params: {
  robotName?: string;
  robotCode?: string;
  status?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return request('/api/v1/system/robots/list', {
    method: 'GET',
    params,
  });
}

/**
 * 6.2 新增机器人
 * @param data 包含 robotCode, robotName, type, description, status
 */
export async function createRobot(data: {
  robotCode: string;
  robotName: string;
  type?: string;
  description?: string;
  status?: number;
}) {
  return request('/api/v1/system/robots/create', {
    method: 'POST',
    data,
  });
}

/**
 * 6.3 编辑机器人
 * @param data 包含 robotCode, robotName, type, description, status
 */
export async function updateRobot(data: {
  robotCode: string;
  robotName?: string;
  type?: string;
  description?: string;
  status?: number;
}) {
  return request('/api/v1/system/robots/update', {
    method: 'POST',
    data,
  });
}

/**
 * 6.4 查看机器人详情
 * @param robotCode 机器人编码
 */
export async function getRobotDetail(robotCode: string) {
  return request(`/api/v1/system/robots/detail/${robotCode}`, {
    method: 'GET',
  });
}

/**
 * 6.5 删除机器人
 * @param robotCode 机器人编码
 */
export async function deleteRobot(robotCode: string) {
  return request(`/api/v1/system/robots/delete/${robotCode}`, {
    method: 'DELETE',
  });
}
