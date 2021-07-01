import request from '@/utils/request'

// 权限管理api

// 获取分页信息
export function getPermissionTree(params) {
  return request({ url: '/sys/privilege/tree', method: 'get', data: params })
}

// 获取分页信息
export function getPermissionPage(params) {
  return request({ url: '/sys/privilege/page', method: 'get', data: params })
}

// 获取列表信息
export function getPermissionAll() {
  return request({ url: '/sys/privilege/all', method: 'get' })
}

// 根据ID 查询单个权限信息
export function getPermissionById(params) {
  return request({ url: '/sys/privilege/info/' + params, method: 'get' })
}

// 新增权限
export function savePermission(params) {
  return request({ url: '/sys/privilege', method: 'post', data: params })
}

// 修改权限
export function updatePermission(params) {
  return request({ url: '/sys/privilege', method: 'put', data: params })
}

// 删除权限
export function removePermissionById(params) {
  return request({ url: '/sys/privilege/' + params, method: 'delete' })
}

