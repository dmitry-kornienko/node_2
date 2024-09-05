const http = require('http')
const articlesController = require('./articlesController')
const logger = require('./logger')

const hostname = '127.0.0.1'
const port = 3000

const handlers = {
	'/api/articles/readall': (req, res, payload, cb) =>
		articlesController.readAll(cb),
}

const server = http.createServer((req, res) => {
	parseBodyJson(req, (err, payload) => {
		logger(req, payload)

		const handler = getHandler(req.url)

		handler(req, res, payload, (err, result) => {
			if (err) {
				res.statusCode = err.code
				res.setHeader('Content-Type', 'application/json')
				res.end(JSON.stringify(err))

				return
			}

			res.statusCode = 200
			res.setHeader('Content-Type', 'application/json')
			res.end(JSON.stringify(result))
		})
	})
})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})

function getHandler(url) {
	return handlers[url] || notFound
}

function notFound(req, res, payload, cb) {
	cb({ code: 404, message: 'Not found' })
}

function parseBodyJson(req, cb) {
	let body = []

	req
		.on('data', function (chunk) {
			body.push(chunk)
		})
		.on('end', function () {
			body = Buffer.concat(body).toString()

			if (body) {
				let params = JSON.parse(body)
				cb(null, params)
			} else {
				cb(null, {})
			}
		})
}
