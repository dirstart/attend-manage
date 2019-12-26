import { Loading, Message, Notification } from 'element-ui'
import axios from 'axios'
import store from '@/store'
import { getToken, goLogin } from '@/utils/auth'

// 在config/h5/index.js每新增一个proxy,此处需要新增一个相应的正则匹配规则，并在config/h5/prod.env.js添加相应host
let urlList = {
  '/offers': process.env.offers,
  '/mobile-starter': process.env.mobile_starter,
  '/compensate': process.env.api_root
}


export default async (setings) => {
  let _loading;
  const cache = setings.cache;
  const isUpload = setings.isUpload;
  const banLoading = setings.banLoading;
  // create an axios instance
  const service = axios.create({
    timeout: 30000,
    headers: {
      channel: 'PCWEB'
    }
  })

  // request拦截器
  service.interceptors.request.use(config => {
    // 开启加载提示
    if (!banLoading)
      _loading = Loading.service({
        lock: true,
        text: '加载中，请稍后',
        spinner: 'el-icon-loading',
        customClass: 'common-loading'
      });
    // url加前缀
    for (let i in urlList) {
      if(urlList[i] === undefined || urlList[i] == '""') {
        continue;
      }
      let re = new RegExp('^' + i);
      if (re.test(config.url)) {
        config.url = urlList[i] + config.url;
        break;
      }
    }
    // Do something before request is sent
    if (store.getters.token) {
      config.headers.managerToken = getToken(); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config;
  }, error => {
    _loading && _loading.close();
    Promise.reject(error)
  })

  // respone拦截器
  service.interceptors.response.use(
    response => {
      _loading && _loading.close();
      /**
       * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
       * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
       */
      const res = response.data
      if (response.status !== 200) {
        Message({
          message: res.message,
          type: 'error',
          duration: 2000
        });
        return Promise.reject('服务出错');
      } else {
        if (res.code === 1011) {
          Message({
            message: '您已被登出，请重新登录',
            type: 'error',
            duration: 2000,
            onClose: () => {
              store.dispatch('logOut').finally(() => {
                goLogin();
              });
            }
          });
        }
        let newData = {
          data: res,
          status: response.status
        };
        // 判断是否需要缓存数据
        if (cache && !store.getters.inspectType(cache)) {
          // 把请求到的数据放进vuex中
          cache.data = newData;
          store.dispatch('setCacheData', cache);
        }
        return newData;
      }
    },
    error => {
      _loading && _loading.close();

      console.log('err:' + error) // for debug
      const response = error.response
      if (response === undefined) {
        Message({
          message: '服务请求超时！',
          type: 'error',
          duration: 5 * 1000
        });
        return Promise.reject(error);
      }
      const info = response.data;

      if (response.status === 403) {
        Notification.warning({
          title: '禁止',
          message: info.message,
          type: 'error',
          duration: 2 * 1000
        });
        return Promise.reject('error');
      }

      if (response.status >= 500) {
        Message({
          message: '后端服务异常，请联系管理员！',
          type: 'error',
          duration: 5 * 1000
        });
        return Promise.reject(error);
      }

      Message({
        message: info.message,
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(error);
    }
  )

  // 判断是否获取缓存且数据是否存在
  if (cache && store.getters.inspectType(cache)) {
    // 不用再次请求数据，直接返回缓存数据
    return store.dispatch('getCacheData', cache);
  }

  // 是否上传文件
  // if (isUpload) {
  //   setings.headers = {
  //     'Content-Type': 'multipart/form-data'
  //   }
  // }
  return await service(setings)
}
