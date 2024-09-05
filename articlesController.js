const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'articles.json')

const readAll = cb => {
	fs.readFile(filePath, 'utf-8', (err, data) => {
		if (err) {
			cb({
				code: 500,
				message: 'File reading error',
			})
		}
		const articles = JSON.parse(data)
		cb(null, articles)
	})
}

module.exports = {
	readAll,
}
