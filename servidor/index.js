var express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors')
var app = express()
const verificar = require('./proxy.js.js')
var mysql = require('mysql')
const cred = require('./credenciales/credenciales.js.js')
var geoip = require('geoip-lite')
//const { verifica } = require('./proxy.js')
//const { verificatodo } = require('./proxy.js')
app.use(cors())
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())
var con = mysql.createConnection({
	host: cred.credenciales.host,
	user: cred.credenciales.user,
	password: cred.credenciales.password,
	database: cred.credenciales.database
})
con.connect((err) => {
	if (err) throw err
	console.log('Connected!')
})
app.use('/static', express.static('./static'))

app.get('/proxy/:ip', (req, res) => {
	var ip = req.params.ip
	/*verifica(ip)
		.then((data) => {
			
			console.log(data)
			res.json(data)
		})
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})*/
	if (!ip.includes('\n')) {
		verificar
			.verifica(ip)
			.then((respuesta) => {
				console.log(ip + ' funciona')
				res.json(respuesta)
			})
			.catch((error) => {
				console.log(ip + ' no funciona')
				res.json(error)
			})
	} else {
		let arrproxy = ip.split('\n')
		Promise.all(arrproxy.map(verificar.verifica))
			.then((response) => {
				console.log(response)
				console.log('---------------------')
				const ok = response.filter((x) => x.operation === 'ok').map((x) => x.proxy)
				console.log('Los que van bien:')
				console.log(ok)
				const ko = response.filter((x) => x.operation === 'ko').map((x) => x.proxy)
				console.log('Los que van mal:')
				console.log(ko)
			})
			.catch((error) => {
				console.log(error)
			})
	}
})
app.post('/proxy/lista', (req, res) => {
	var listaproxy = req.body.proxies
	console.log(listaproxy)
	Promise.all(listaproxy.map(verificar.verifica))
		.then((response) => {
			console.log(response)
			console.log('---------------------')
			const ok = response.filter((x) => x.operation === 'ok').map((x) => x.proxy)
			console.log('Los que van bien:')
			console.log(ok)
			const ko = response.filter((x) => x.operation === 'ko').map((x) => x.proxy)
			console.log('Los que van mal:')
			console.log(ko)
			res.json({
				ok,
				ko
			})
		})
		.catch((error) => {
			console.log(error)
			res.json({
				error: 'Fail'
			})
		})

	/*Promise.all(ip.map(verifica))
		.then((response) => {
			const ok = response.filter((x) => x.operation === 'ok').map((x) => x.proxy)
			console.log('Los que van bien:')
			console.log(ok)
			const ko = response.filter((x) => x.operation === 'ko').map((x) => x.proxy)
			console.log('Los que van mal:')
			console.log(ko)
			a.push(ok, ko)
			res.json(response)
		})
		.catch((error) => {
			console.log('hola')
			console.log(error)
		})
		*/
})
app.post('/proxy/actualizar', (req, res) => {
	if (req.body.info.length > 0 && req.body.status == 1) {
		var query = req.body.info
		var status = req.body.status
		con.query(
			'CREATE TABLE IF NOT EXISTS proxy(grupo varchar(255),ip varchar(255),country varchar(255),region varchar(255),city varchar(255),on_off varchar(2))'
		)
		var insertando =
			'INSERT INTO proxy(grupo,ip,country,region,city,on_off) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE on_off = ? '
		query.forEach((ip) => {
			var n = ip.indexOf(':')
			var res = ip.substr(0, n)
			var geo = geoip.lookup(res)
			console.log(geo)
			con.query(insertando, ['instant', ip, geo.country, geo.region, geo.city, status, status], function (
				err,
				result
			) {
				if (err) {
					console.log('no ha ido' + err)
				} else {
					console.log('Number of records inserted: ' + result.affectedRows)
				}
			})
		})
	} else if (req.body.info.length > 0 && req.body.status == 0) {
		var query = req.body.info
		var status = req.body.status
		var updating = 'UPDATE proxy SET on_off = 0 where ip= ?'
		query.forEach((ip) => {
			con.query(updating, [ip], function (err, result) {
				if (err) {
					console.log(ip + 'no existe')
				} else {
					console.log('Number of records update: ' + result.affectedRows)
				}
			})
		})
	} else {
		console.log('Has pasado array vacio')
	}
})
app.get('/proxyip', (req, res) => {
	console.log('Enviando ProxyIp')
	con.query(
		"Select ip,country from proxy where on_off = 1 AND (country ='ES' || country='FR' || country='GB' || country='US') ",
		(err, result) => {
			if (err) {
				console.log('ha ido mal' + err)
			} else {
				console.log('ha ido bien' + result)
				var ips = []
				for (let index = 0; index < result.length; index++) {
					ips.push(result[index].ip)
				}
				console.log(ips)
				res.json(ips)
			}
		}
	)
})
app.listen(3000, () => {
	console.log('Started on PORT 3000')
})