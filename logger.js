const fs = require('fs')
const path = require('path')

const logFilePath = path.join(__dirname, 'log.txt')

const logger = (req, payload) => {
	const date = new Date()

	const msg = `-------------------------------------
	Date: ${date.toLocaleString()}
  URL: ${req.url}
  Method: ${req.method}
  Body: ${JSON.stringify(payload, null, 2)}
`

	fs.appendFile(logFilePath, msg, err => {
		if (err) {
			console.log('Error with logger:', err)
		}
	})
}

module.exports = logger
