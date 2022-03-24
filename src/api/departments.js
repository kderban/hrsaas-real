import request from '@/utils/request'

/**
 * delete 删除业务
 * get    获取业务
 * post   新增业务
 * put    修改业务
 */

/**
 * 获取组织架构数据
 */
export function getDepartments () {
  return request({
    url: '/company/department'
  })
}

/** *
 *  根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * **/
export function delDepartments (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete' // 接口满足restful接口规范
    // 同样的地址 不同的方法 执行不同的业务
  })
}

/**
 *  新增部门接口
 *
 * ****/
export function addDepartments (data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

/**
 * 获取部门详情
 *
**/
export function getDepartDetail (id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 编辑部门
 */
export function updateDepartments (data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

