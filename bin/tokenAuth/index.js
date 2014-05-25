module.exports = function (post, context) {
	return context.authTokens[post.token];
}
