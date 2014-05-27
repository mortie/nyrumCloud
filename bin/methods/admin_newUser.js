var mysql = require("mysql");
var crypto = require("../makeCrypto");

module.exports = function(params, context)
{
	
	//if user is admin
	var sql = mysql.format("SELECT isAdmin FROM user WHERE id=?",
	[
			context.authTokens[params.post.token]
	]);
	context.mysqlConn.query(sql, function(err, response)
	{
		if (err) throw err;
 
		var user = response[0];

		//if the user requesting to create a new user is an administrator
		if (user.isAdmin)
		{
			var crypto = makeCrypto(params.post.password);

			var sql = mysql.format("INSERT INTO user (username, passwordHash, passwordSalt, isAdmin) values (?, ?, ?, ?)",
			[
				params.post.username,
				crypto.hash,
				crypto.salt,
				params.post.isAdmin
			]);
			context.mysqlConn.query(sql, function(err, result)
			{
				if (err) {
					response.write(JSON.stringify(
					{
						"success": false
					}));
					response.end();
				}
				else
				{
					response.write(JSON.stringify(
					{
						"success": true
					}));
				}
			});
		}
	});
}
