import { request } from '@umijs/max';

/** ---------------------- 9. 数据采集 (Collection) ---------------------- */
export async function getCollectionList(params: any) {
  return request('/api/v1/system/data/collection/list', {
    method: 'GET',
    params,
  });
}
export async function getCollectionDetail(id: string) {
  return request(`/api/v1/system/data/collection/detail/${id}`, {
    method: 'GET',
  });
}
export async function deleteCollection(id: string) {
  return request(`/api/v1/system/data/collection/delete/${id}`, {
    method: 'DELETE',
  });
}
/** 9.4 新增采集数据记录 */
export async function addCollection(data: {
  taskId: string;
  taxNo?: string;
  enterpriseName?: string;
  status: string; // 'collected' | 'parsing' | 'parsed' | 'failed'
  dataSource?: string;
  collectionTime?: string;
  errorMessage?: string;
  rawData?: string; // JSON 格式字符串
}) {
  return request('/api/v1/system/data/collection/add', {
    method: 'POST',
    data,
  });
}

/** ---------------------- 10. 数据解析 (Parsing) ---------------------- */
export async function getParsingList(params: any) {
  return request('/api/v1/system/data/parsing/list', { method: 'GET', params });
}
export async function getParsingDetail(id: string) {
  return request(`/api/v1/system/data/parsing/detail/${id}`, { method: 'GET' });
}
export async function deleteParsing(id: string) {
  return request(`/api/v1/system/data/parsing/delete/${id}`, {
    method: 'DELETE',
  });
}

/** ---------------------- 11. 数据加工 (Processing) ---------------------- */
export async function getProcessingList(params: any) {
  return request('/api/v1/system/data/processing/list', {
    method: 'GET',
    params,
  });
}
export async function getProcessingDetail(id: string) {
  return request(`/api/v1/system/data/processing/detail/${id}`, {
    method: 'GET',
  });
}
export async function deleteProcessing(id: string) {
  return request(`/api/v1/system/data/processing/delete/${id}`, {
    method: 'DELETE',
  });
}

/** ---------------------- 12. 数据查询 (Query/Results) ---------------------- */
export async function getResultList(params: any) {
  return request('/api/v1/system/data/query/list', { method: 'GET', params });
}
export async function getResultDetail(id: string) {
  return request(`/api/v1/system/data/query/detail/${id}`, { method: 'GET' });
}
export async function deleteResult(id: string) {
  return request(`/api/v1/system/data/query/delete/${id}`, {
    method: 'DELETE',
  });
}
