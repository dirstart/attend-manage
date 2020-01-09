import request from '@/utils/request'

// 获取用户对应路由
export function getUserRoute() {
  return request({
    url: '/api/auth/resources/routes',
    method: 'get'
  })
}

export function getByCode(params){
  return request({
    url:'/api/addr/districts/getByCode',
    method:'get',
    params
  })
}
