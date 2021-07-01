import request from '@/utils/request'

// 菜单管理api

// 获取分页信息
export function getMenuTree(params) {
  return request({ url: '/sys/menu/tree', method: 'get', data: params })
}

// 获取分页信息
export function getMenuPage(params) {
  return request({ url: '/sys/menu/page', method: 'get', data: params })
}

// 获取列表信息
export function getMenuAll() {
  return request({ url: '/sys/menu/all', method: 'get' })
}

// 根据ID 查询单个菜单信息
export function getMenuById(params) {
  return request({ url: '/sys/menu/info/' + params, method: 'get' })
}

// 新增菜单
export function saveMenu(params) {
  return request({ url: '/sys/menu', method: 'post', data: params })
}

// 修改菜单
export function updateMenu(params) {
  return request({ url: '/sys/menu', method: 'put', data: params })
}

// 删除菜单
export function removeMenuById(params) {
  return request({ url: '/sys/menu/' + params, method: 'delete' })
}

