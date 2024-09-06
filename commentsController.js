const fs = require('fs')
const path = require('path')
const { readAll: readAllArticles } = require('./articlesController')

const filePath = path.join(__dirname, './articles.json')

const create = (payload, cb) => {
	readAllArticles((err, articles) => {
		const currentArticleIndex = articles.findIndex(
			a => a.id === payload.articleId
		)

		if (currentArticleIndex === -1) {
			cb({
				code: 404,
				message: 'Article not found. Invalid articleId',
			})
			return
		}

		const newComment = {
			id: Date.now(),
			articleId: payload.articleId,
			text: payload.text,
			date: new Date().toLocaleDateString(),
			author: payload.author,
		}

		articles[currentArticleIndex].comments.push(newComment)

		fs.writeFile(filePath, JSON.stringify(articles), err => {
			if (err) {
				cd({
					code: 500,
					message: 'Error writing articles file',
				})
				return
			}
		})
		cb(null, newComment)
	})
}

const deleteOne = (payload, cb) => {
	readAllArticles((err, articles) => {
		let commentFound = false

		for (const article of articles) {
			const comment = article.comments.find(c => c.id === payload.id)

			if (comment) {
				article.comments = article.comments.filter(c => c.id !== comment.id)
				commentFound = true
				break
			}
		}

		if (!commentFound) {
			cb({
				code: 404,
				message: 'Comment not found',
			})
			return
		}

		fs.writeFile(filePath, JSON.stringify(articles), err => {
			if (err) {
				cd({
					code: 500,
					message: 'Error writing articles file',
				})
				return
			}
			cb(null, true)
		})
	})
}

module.exports = {
	create,
	deleteOne,
}
