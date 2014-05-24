var crypto = require("crypto");

function genToken(callback) {
	crypto.randomBytes(64, function(ex, buffer) {
		callback(buffer.toString('hex'));
	});
}

module.exports = function(params, context) {
	genToken(function(token) {

		//save data about the request
		if (!context.authTokens[params.post.username])
			context.authTokens[params.post.username] = [];
		context.authTokens[params.post.username].push(token);

		//respond with the token
		params.response.write(JSON.stringify({
			"token": token
		}));
		params.response.end();
	});
}
