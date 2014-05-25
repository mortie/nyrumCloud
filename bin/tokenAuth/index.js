module.exports = function (post, context) {
	if (context.authTokens[post.token]) {
		return true;
	} else {
		return false;
	}
}
