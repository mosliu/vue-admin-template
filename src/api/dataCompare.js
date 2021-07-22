import request from '@/utils/request'

export function getCompare(params) {
  return request({ url: '/datacompare/', method: 'get', data: params })
}
