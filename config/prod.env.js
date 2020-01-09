module.exports = {
	NODE_ENV: '"production"',
	api_root: '"http://111.229.248.193:8100"',
	filename: process.env.BUILD === 'dev' ? '"./"' : process.env.BUILD === 'pre' ? '"./"' : '"./"'
}
