import request from '@/utils/request';
import qs from 'qs';


export function postUserLogin(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo(ticket, backUrl) {
  return request({
    url: '/compensate/getLandUserInfo',
    method: 'post',
    data: qs.stringify({ ticket, service: backUrl })
  })
}

export function logout(no) {
  return request({
    url: '/compensate/landLogout?account=' + no,
    method: 'get'
  })
}
