module.exports = {
	NODE_ENV: '"production"',
	api_root: process.env.BUILD === 'dev' ? '"http://csapitest.xiamenair.com/manager"' : process.env.BUILD === 'pre' ? '"https://csapipre.xiamenair.com/manager"' : '"http://hcsadmin.xiamenair.com.cn/api"',
	mobile_starter: '"https://mobileapi.xiamenair.com"',
	offers: process.env.BUILD === 'dev' ? '"http://11.4.66.55:8080/api"' : process.env.BUILD === 'pre' ? '"https://newpre.xiamenair.com/api"' : '"http://11.4.66.55:8080/api"',
	filename: process.env.BUILD === 'dev' ? '"./"' : process.env.BUILD === 'pre' ? '"./"' : '"./"'
}
