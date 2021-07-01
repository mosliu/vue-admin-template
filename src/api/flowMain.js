import request from '@/utils/request'

// 流程

// 获取历史信息
// 获取分页信息
export function getFlowHistory(params) {
  return request({ url: '/leave/historyList', method: 'get', data: params })
}

