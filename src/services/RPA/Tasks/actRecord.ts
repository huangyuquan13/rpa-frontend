import { request } from '@umijs/max';

/** 8.1 查询执行记录列表 (支持按任务ID、状态、时间筛选) */
export async function getExecutionList(params: {
  taskId?: string; // 任务 ID (对应 taskCode)
  executionStatus?: string; // 执行状态 (1成功 / 0失败)
  executionTimeStart?: string;
  executionTimeEnd?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return request('/api/v1/system/executions/list', {
    method: 'GET',
    params,
  });
}

/** 8.2 查看执行记录详情 */
export async function getExecutionDetail(executionId: string) {
  return request(`/api/v1/system/executions/detail/${executionId}`, {
    method: 'GET',
  });
}

/** 8.21 查看执行记录对应的执行步骤明细 */
export async function getExecutionSteps(executionId: string) {
  return request(`/api/v1/system/executions/detail/${executionId}/steps`, {
    method: 'GET',
  });
}
