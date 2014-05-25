var mysql = require("mysql");

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

		if (user.isAdmin)
		{
			
		}
	});
}
