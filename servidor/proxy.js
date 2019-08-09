const request = require('request')
/*const proxies = [
	'167.86.78.158:80',
	'134.209.231.163:8080',
	'35.236.207.97:8080',
	'3.208.218.238:8080',
	'157.230.227.116:8080',
	'167.99.4.104:8080',
	'206.81.11.75:80',
	'34.73.24.187:8080',
	'134.209.1.205:3128',
	'157.230.149.54:80',
	'13.56.2.56:8090',
	'157.230.149.189:80',
	'157.230.140.12:8080',
	'185.144.158.152:80',
	'157.230.210.133:8080',
	'157.230.163.11:80',
	'50.239.245.105:80',
	'157.230.157.60:8080',
	'159.65.236.197:8080',
	'138.197.69.54:3128',
	'157.230.236.97:8080',
	'104.248.115.226:8080',
	'18.191.74.68:8080',
	'35.241.65.18:80',
	'159.65.148.128:8080',
	'198.211.109.90:8080',
	'159.65.8.166:3128',
	'157.230.57.151:8080',
	'68.183.39.251:8080',
	'50.235.28.146:3128',
	'165.227.29.189:8080',
	'68.183.35.48:8080',
	'134.209.115.104:3128'
]
*/
module.exports = {
	verifica(proxy) {
		var today = new Date()
		var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
		var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
		var dateTime = date + ' ' + time
		return new Promise(async (resolve, reject) => {
			await request(
				{
					url: 'https://www.facebook.com/',
					timeout: 9000,
					proxy: `http://${proxy}`,
					followRedirect: false
				},
				(error, response) => {
					if (error) {
						console.log(proxy + ' ' + dateTime + ' no funciona :(')

						resolve({
							proxy,
							error,
							operation: 'ko'
						})
					} else {
						console.log(proxy + ' ' + dateTime + ' funciona correctamente')
						resolve({
							proxy,
							body: response.body,
							operation: 'ok'
						})
					}
				}
			)
		})
	}
}
/*
const verifica = (proxy) =>
	new Promise((resolve) => {
		request(
			{
				url: 'https://api.ipify.org/?format=json',
				timeout: 15000,
				proxy: `http://${proxy}`
			},
			(error, response) => {
				if (error) resolve({ proxy, error, operation: 'ko' })
				else resolve({ proxy, body: response.body, operation: 'ok' })
			}
		)
	})
	*/

/*
verifica(proxies[0])
	.then((res) => {
		console.log(res)
	})
	.catch((error) => {
		console.log(error)
  })
  */
