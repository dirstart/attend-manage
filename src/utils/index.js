import moment from "moment";
import { Notification } from 'element-ui';

export function isNull(value) {
  if(null == value || undefined == value || "" == value) {
    return true;
  }
  return false;
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    // if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

// 日期比较
export function compareDate(dateStr) {
  let timeStamp = Date.parse(dateStr);
  let now = Date.parse(new Date())
  let fromNow = timeStamp - now;
  return Math.floor(fromNow / 1000 / 3600 / 24);
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/* type:0为之前，1位之后 */
export function pickerOptions(type, startDate) {
  let json = {
    shortcuts: [
      {
        text: type ? "一周内" : "最近一周",
        onClick(picker) {
          picker.$emit("pick", type ? [moment().subtract(7, "d")._d, moment()._d] : [moment()._d, moment().subtract(7, "d")._d]);
        }
      },
      {
        text: type ? "一个月内" : "最近一个月",
        onClick(picker) {
          picker.$emit("pick", type ? [moment().subtract(1, "M")._d, moment()._d] : [moment()._d, moment().subtract(1, "M")._d]);
        }
      },
      {
        text: type ? "三个月内" : "最近三个月",
        onClick(picker) {
          picker.$emit("pick", type ? [moment().subtract(3, "M")._d, moment()._d] : [moment()._d, moment().subtract(3, "M")._d]);
        }
      }
    ]
  }
  if (startDate) {
    if (!(startDate instanceof Date)) {
      startDate = moment(startDate, "YYYYMMDDHHmmss")._d;
    }
    json.disabledDate = time => {
      return time.getTime() < startDate.getTime();
    }
  } else {
    json.disabledDate = () => {
      return false
    }
  }
  return json;
}

export function singlePickerOptions(startDate) {
  let json = {
    shortcuts: [{
      text: '昨天',
      onClick(picker) {
        picker.$emit("pick", moment().subtract(1, "d")._d);
      }
    }, {
      text: '一周前',
      onClick(picker) {
        picker.$emit("pick", moment().subtract(7, "d")._d);
      }
    }, {
      text: '一月前',
      onClick(picker) {
        picker.$emit("pick", moment().subtract(1, "M")._d);
      }
    }, {
      text: '三月前',
      onClick(picker) {
        picker.$emit("pick", moment().subtract(3, "M")._d);
      }
    }]
  }
  if (startDate) {
    if (!(startDate instanceof Date)) {
      startDate = moment(startDate, "YYYYMMDDHHmmss")._d;
    }
    json.disabledDate = time => {
      return time.getTime() < startDate.getTime();
    }
  } else {
    json.disabledDate = () => {
      return false
    }
  }
  return json;
}

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

// 节流函数
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// 对象深拷贝
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

//传入图片路径，返回base64
export function getBase64(img) {
  function getBase64Image(img, width, height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    var canvas = document.createElement("canvas");
    canvas.width = width ? width : img.width;
    canvas.height = height ? height : img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL();
    return dataURL;
  }
  var image = new Image();
  image.crossOrigin = '';
  image.src = img;

  return new Promise((resolve, reject) => {
    if (img) {
      image.onload = function () {
        resolve(getBase64Image(image));//将base64传给done上传处理
      }
    } else {
      reject();
    }
  });
}

// 表单校验规则
export const formValidate = {
  ip: (rule, value, callback) => {
    let regexp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (!value || !value.length) {
      callback();
      return;
    }
    if (regexp.test(value)) {
      callback();
    } else {
      callback("请输入正确的格式");
    }
  },
  threshold: (rule, value, callback) => {
    let regexp = new RegExp(`^(-?\\d+)(.\\d{1,${rule.toFixed}})?$`);
    if (regexp.test(value)) {
      value = parseFloat(value);
      if (value > rule.min && value < rule.max) {
        callback();
      } else {
        callback(rule.tip);
      }
    } else {
      callback("请输入正确的格式");
    }
  }
}

// 电话校验
export const checkPhone = (rule, value, callback) => {
  if (value) {
    // const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    const reg = /^1[0-9]\d{9}$/
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('手机号格式错误'));
    }
  }
}

export function ExcelDownload(val) {
  let time = moment().format("YYYY-MM-DD")
  let url = window.URL.createObjectURL(new Blob([val]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', time + '.xls')

  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(link.href) // 释放URL 对象
  document.body.removeChild(link)
}

//消息提示
export function messageTip(res, message) {
  let isSuccess = res.status === 200;
  Notification({
    title: isSuccess ? "成功" : "失败",
    message: isSuccess ? message : res.message,
    type: isSuccess ? "success" : "error",
    duration: 2000
  });
}
