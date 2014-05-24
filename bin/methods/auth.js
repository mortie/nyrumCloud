var crypto = require("crypto");

function genToken(callback) {
	crypto.randomBytes(64, function(ex, buffer) {
		callback(buffer.toString('hex'));
	});
}

module.exports = function(params, context) {
	genToken(function(token) {

		//make sure the history doesn't get too long
		if (context.auth.length > context.conf.authHistoryLength) {
			context.auth.splice(
				context.conf.authHistoryLength,
				context.auth.length - context.conf.authHistoryLength
			);
		}

		//save data about the request
		params.context.auth[token] = {
			"ip": params.request.connection.remoteAddress,
			"agent": params.request.headers['user-agent'],
		}

		//respond with the token
		params.response.write(JSON.stringify({
			"token": token
		}));
		params.response.end();
	});
}
