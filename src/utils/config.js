// 过滤全局页面
export const newPageFilter = ["depart"];
// 单点登录
export const ssoWeb = process.env.NODE_ENV === 'development' ? 'http://ssotest.xiamenair.com.cn:9080/sso/' : 'http://sso.xiamenair.com.cn/sso/'
// export const ssoWeb = 'http://sso.xiamenair.com.cn/sso/'
