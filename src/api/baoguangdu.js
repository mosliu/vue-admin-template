import { service2 } from '@/utils/request'

export function getBaoGuangDu(params) {
  return service2({ url: '/b1', method: 'post', data: params })
}
