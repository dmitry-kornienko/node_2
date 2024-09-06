const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'articles.json')

const readAll = cb => {
	fs.readFile(filePath, 'utf-8', (err, data) => {
		if (err) {
			cb({
				code: 500,
				message: `File reading error: ${err}`,
			})
			return
		}

		if (data.length === 0) {
			cb(null, [])
			return
		}
		const articles = JSON.parse(data)
		cb(null, articles)
	})
}

const read = (payload, cb) => {
	fs.readFile(filePath, 'utf-8', (err, data) => {
		if (err) {
			cb({
				code: 500,
				message: `File reading error: ${err}`,
			})
			return
		}
		const articles = JSON.parse(data)
		const article = articles.find(i => i.id === payload.id)

		if (!article) {
			cb({
				code: 404,
				message: 'Article is not found. Invalid ID',
			})
			return
		}

		cb(null, article)
	})
}

const create = (payload, cb) => {
	readAll((err, articles) => {
		const newArticle = {
			id: Date.now(),
			title: payload.title,
			text: payload.text,
			date: new Date().toLocaleDateString(),
			author: payload.author,
			comments: [],
		}

		articles.push(newArticle)

		fs.writeFile(filePath, JSON.stringify(articles), err => {
			if (err) {
				cd({
					code: 500,
					message: 'Error writing articles file',
				})
				return
			}
		})

		cb(null, newArticle)
	})
}

const update = (payload, cb) => {
	readAll((err, articles) => {
		const currentArticleIndex = articles.findIndex(a => a.id === payload.id)

		if (currentArticleIndex === -1) {
			cb({
				code: 404,
				message: 'Article not found',
			})
			return
		}

		const currentArticle = articles[currentArticleIndex]

		const updatedArticle = {
			...currentArticle,
			...payload,
		}

		articles[currentArticleIndex] = updatedArticle

		fs.writeFile(filePath, JSON.stringify(articles), err => {
			if (err) {
				cb({
					code: 500,
					message: 'Error writing articles file',
				})
				return
			}
		})

		cb(null, updatedArticle)
	})
}

const deleteOne = (payload, cb) => {
	readAll((err, articles) => {
		const currentArticle = articles.find(a => a.id === payload.id)

		if (!currentArticle) {
			cb({
				code: 404,
				message: 'Article not found. Invalid ID',
			})
			return
		}
		const newArticles = articles.filter(i => i.id !== payload.id)

		fs.writeFile(filePath, JSON.stringify(newArticles), err => {
			if (err) {
				cb({
					code: 500,
					message: 'Error writing articles file',
				})
				return
			}
		})
		cb(null, true)
	})
}

module.exports = {
	readAll,
	read,
	create,
	update,
	deleteOne,
}
