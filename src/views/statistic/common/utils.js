// 将日期值转化为 '2011-01-01'
export function dayToString(value) {
  const date = new Date(value)
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = date.getDate()
  if (day < 10) {
    day = '0' + day
  }

  return `${year}-${month}-${day}`
}

// 根据某个属性排序
export function rankingSort(property) {
  return function (a, b) {
    var value1 = +a[property];
    var value2 = +b[property];
    return value2 - value1;
  }
}