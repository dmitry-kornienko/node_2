const http = require('http')
const articlesController = require('./articlesController')
const commentsController = require('./commentsController')
const logger = require('./logger')
const validator = require('./validator')

const hostname = '127.0.0.1'
const port = 3000

const handlers = {
	'/api/articles/readall': (req, res, payload, cb) =>
		articlesController.readAll(cb),
	'/api/articles/read': (req, res, payload, cb) =>
		articlesController.read(payload, cb),
	'/api/articles/create': (req, res, payload, cb) => {
		validator.createArticle(req, res, payload, err => {
			if (err) {
				handleError(req, res, err, payload)
				return
			}
			articlesController.create(payload, cb)
		})
	},
	'/api/articles/update': (req, res, payload, cb) => {
		validator.updateArticle(req, res, payload, err => {
			if (err) {
				handleError(req, res, err, payload)
				return
			}
			articlesController.update(payload, cb)
		})
	},
	'/api/articles/delete': (req, res, payload, cb) =>
		articlesController.deleteOne(payload, cb),
	'/api/comments/create': (req, res, payload, cb) => {
		validator.createComment(req, res, payload, err => {
			if (err) {
				handleError(req, res, err, payload)
				return
			}
			commentsController.create(payload, cb)
		})
	},
	'/api/comments/delete': (req, res, payload, cb) =>
		commentsController.deleteOne(payload, cb),
}

const server = http.createServer((req, res) => {
	parseBodyJson(req, (err, payload) => {
		const handler = getHandler(req.url)

		handler(req, res, payload, (err, result) => {
			if (err) {
				handleError(req, res, err, payload)
				return
			}

			res.statusCode = 200
			res.setHeader('Content-Type', 'application/json')
			res.end(JSON.stringify(result))

			logger(req, payload)
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

function handleError(req, res, err, payload) {
	res.statusCode = err.code
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(err))
	logger(req, payload)
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
