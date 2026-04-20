import { request } from '@umijs/max';

/**
 * 7.1 查询流程列表
 * @param params 包含 processName, processCode, status, pageNum, pageSize
 */
export async function getProcessList(params: {
  processName?: string;
  processCode?: string;
  status?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return request('/api/v1/system/processes/list', {
    method: 'GET',
    params,
  });
}

/**
 * 7.2 新增流程
 * @param data 包含 processCode, processName, description, status
 */
export async function createProcess(data: {
  processCode: string;
  processName: string;
  description?: string;
  status?: number;
}) {
  return request('/api/v1/system/processes/create', {
    method: 'POST',
    data,
  });
}

/**
 * 7.3 编辑流程
 * @param data 包含 processCode, processName, description, status
 */
export async function updateProcess(data: {
  processCode: string;
  processName?: string;
  description?: string;
  status?: number;
}) {
  return request('/api/v1/system/processes/update', {
    method: 'POST',
    data,
  });
}

/**
 * 7.4 查看流程详情
 * @param processCode 流程编码
 */
export async function getProcessDetail(processCode: string) {
  return request(`/api/v1/system/processes/detail/${processCode}`, {
    method: 'GET',
  });
}

/**
 * 7.5 查询流程设计步骤
 * @param processCode 流程编码
 */
export async function getProcessSteps(processCode: string) {
  return request(`/api/v1/system/processes/step/list/${processCode}`, {
    method: 'GET',
  });
}

/**
 * 7.6 保存流程步骤（全量覆盖）
 * @param data 包含 processCode, steps
 */
export async function saveProcessSteps(data: {
  processCode: string;
  steps: {
    stepOrder: number;
    stepName: string;
    stepType: string;
    codeContent: string;
  }[];
}) {
  return request('/api/v1/system/processes/step/save', {
    method: 'POST',
    data,
  });
}

/**
 * 7.7 删除流程
 * @param processCode 流程编码
 */
export async function deleteProcess(processCode: string) {
  return request(`/api/v1/system/processes/delete/${processCode}`, {
    method: 'DELETE',
  });
}
