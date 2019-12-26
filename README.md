## 考勤管理系统

### 打包说明
> 测试打包命令: `npm run build:dev`
<br>
> 预生产打包命令: `npm run build:pre`
<br>
> 生产打包命令: `npm run build`

### 接口域名配置说明
**config/dev.env.js** 中规则如下所示:
```javascript
module.exports = {
  NODE_ENV: '"development"',
  api_root: '""'
}
```
**config/prod.env.js** 中规则如下所示:
```javascript
module.exports = {
  NODE_ENV: '"production"',
  api_root: process.env.BUILD === 'dev' ? '"http://csapitest.xiamenair.com"' : process.env.BUILD === 'pre' ? '"https://csapipre.xiamenair.com"' : '"https://csapi.xiamenair.com"'
}
```
**src/utils/request.js** 中于*urlList* 中添加对应环境的key值:
```javascript
let urlList = {
  '/api': process.env.api_root
}
```

### 其他说明
- UI框架引入element-ui，详情请查阅 [Element](https://element.eleme.cn/#/zh-CN/component/installation) 官网
- 内置svg矢量图标库，通过/icon访问查看支持详情，也可根据项目需要到 **/src/icons** 目录下添加svg文件
- 全局封装localstorage常用操作，内置到vue的AiStore对象中
- 应用组件缓存手段实现多页面切换并添加右键菜单功能
- 添加路由页面时请配置 **name** 以便keepAlive可以缓存到你的组件
