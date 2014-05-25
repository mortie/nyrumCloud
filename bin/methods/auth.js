var crypto = require("crypto");
var mysql = require("mysql");

function genToken(callback) {
	crypto.randomBytes(64, function(ex, buffer) {
		callback(buffer.toString('hex'));
	});
}

module.exports = function(params, context) {
	var sql = mysql.format("SELECT passwordHash,passwordSalt,id FROM user WHERE username='?'", [params.post.username]);
	context.mysqlConn.query(sql, function(err, result) {

		//if a user with that username exists and the password matches, create an auth token
		if (result
		&&  scrypt.hash(result.passwordSalt+params.post.username) === result.passwordHash) {
			genToken(function(token) {

				//save data about the request
				context.authTokens[token] = params.post.username;

				//respond with the token
				params.response.write(JSON.stringify({
					"token": token
				}));
				params.response.end();
			});

		//if no user exists or password is wrong, send back error code 2
		} else {
			params.response.write(JSON.stringify({
				"err": 2
			}));
			params.response.end();
		}
	});
}
