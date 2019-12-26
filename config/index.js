'use strict'
const path = require('path')


module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/api': {
      //   target: `http://192.168.10.203`,
      //   pathRewrite: {
      //     '^/api': '/api/',
      //     changeOrigin: true
      //   }
      // },
      '/offers': {
        target: 'http://11.4.66.55:8080/api',
      },
      '/mobile-starter': {
        target: 'https://mobileapi.xiamenair.com', // 测试地址
        secure: false,
        changeOrigin: true // 如果接口跨域，需要进行这个参数配置
      },
      '/compensate': {
        // target: 'http://localhost:8010', // 本机
        // target: 'https://csapitest.xiamenair.com', // 测试地址
        target: 'http://11.153.48.244:8888/manager',
        // target: 'http://hcsadmin.xiamenair.com.cn/api',
        // target: 'https://wxpublictest.xiamenair.com', // 微信代理了渠道站（https），此域名可外网访问
        secure: false,
        changeOrigin: true
      }
    },
    // Various Dev Server settings
    // host: '11.153.240.109', // can be overwritten by process.env.HOST
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',

    // you can set by youself according to actual condition
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
