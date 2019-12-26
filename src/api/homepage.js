export function getData() {
  return request({
    url: '/api/get/test',
    method: 'get'
  });
}

export function postData(data) {
  return request({
    url: '/api/post/test',
    method: 'post',
    data
  });
}
