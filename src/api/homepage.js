import request from '@/utils/request';
import qs from 'qs';


export function fetchAttendData(data) {
  return request({
    url: '/overtime/list',
    method: 'post',
    data
  });
}

export function fetchDetailData(data) {
  return request({
    url: '/overtime/detail',
    method: 'post',
    data
  });
}

// 获取所有部门
export function getDepartment() {
  return request({
    url: '/depart',
    method: 'get'
  });
}
