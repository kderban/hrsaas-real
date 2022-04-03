import request from '@/utils/request'

/**
 * delete 删除业务
 * get    获取业务
 * post   新增业务
 * put    修改业务
 */

// 获取权限
export function getPermissionList (params) {
  return request({
    url: '/sys/permission',
    params
  })
}

// 新增权限
export function addPermission (data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

// 更新权限
export function updatePermission (data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

// 删除权限
export function delPermission (id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}
// 获取权限详情
export function getPermissionDetail (id) {
  return request({
    url: `/sys/permission/${id}`
  })
}

