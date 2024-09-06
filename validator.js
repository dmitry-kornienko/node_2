const createArticle = (req, res, payload, cb) => {
	if (
		!payload.title ||
		typeof payload.title !== 'string' ||
		!payload.text ||
		typeof payload.text !== 'string' ||
		!payload.author ||
		typeof payload.author !== 'string'
	) {
		cb({
			code: 401,
			message: 'Request invalid',
		})
		return
	}
	cb(null)
}

const updateArticle = (req, res, payload, cb) => {
	if (payload.title && typeof payload.title !== 'string') {
		cb({
			code: 401,
			message: 'Request invalid',
		})
		return
	}

	if (payload.text && typeof payload.text !== 'string') {
		cb({
			code: 401,
			message: 'Request invalid',
		})
		return
	}

	if (payload.author && typeof payload.author !== 'string') {
		cb({
			code: 401,
			message: 'Request invalid',
		})
		return
	}

	cb(null)
}

const createComment = (req, res, payload, cb) => {
	if (
		!payload.articleId ||
		typeof payload.articleId !== 'number' ||
		!payload.text ||
		typeof payload.text !== 'string' ||
		!payload.author ||
		typeof payload.author !== 'string'
	) {
		cb({
			code: 400,
			message: 'Request invalid',
		})
		return
	}
	cb(null)
}

module.exports = {
	createArticle,
	updateArticle,
	createComment,
}
