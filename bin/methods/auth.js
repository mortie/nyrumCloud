var crypto = require("crypto");
var mysql = require("mysql");

module.exports = function(params, context)
{

	//query database to get the user
	var sql = mysql.format("SELECT passwordHash,passwordSalt,id FROM user WHERE username=?",
	[
			params.post.username
	]);
	context.mysqlConn.query(sql, function(err, result)
	{
		if (err) throw err;

		//if a user with that username exists and the password matches, create an auth token
		if (result.length > 0)
		{

			var user = result[0];

			//generate hash from received password
			var receivedPassHash = crypto.createHash("sha512")
			                       .update(user.passwordSalt+params.post.password)
			                       .digest("hex");

			//if correct password
			if (receivedPassHash === user.passwordHash)
			{

				//generate token
				var token = crypto.randomBytes(64).toString("hex");

				//save token
				context.authTokens[token] = user.id;

				//respond with the token
				params.respond(
				{
					"token": token
				});
			}

			//if username or password is wrong, respond with error code 2
			else
			{
				params.respond(
				{
					"err": 2
				});
			}
		}

		//if no user exists, respond with error code 2
		else
		{
			params.respond(
			{
				"err": 2
			});
		}
	});
}
