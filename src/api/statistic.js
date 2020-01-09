import request from '@/utils/request';
// import qs from 

// 获取部门统计-饼状图
export function getDepartOvertime (data) {
  return request({
    url: '/overtime/depart/list',
    method: 'post',
    data: data || {}
  })
}

// 获取部门统计-折线图
export function getDepartLine (data) {
  return request({
    url: '/overtime/depart/line',
    method: 'post',
    data: data || {}
  })
}

// 获取全部部门
export function getAllPart(params){
  return request({
    url:'/depart',
    method:'get',
    params
  })
}

// 获取部门里有哪些人员
export function getPersonByPart (pardId) {
  return request({
    url: '/staff/' + pardId,
    method: 'get'
  })
}

// 获取人员统计
export function getPersonOvertime (data) {
  return request({
    url: '/overtime/staff/list',
    method: 'post',
    data: data || {}
  })
}