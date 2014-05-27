var mysql = require("mysql");

module.exports = function(params, context)
{

	//we know the user is valid, if not, this function wouldn't have been ran
	var userId = context.authTokens[params.post.token];

	//prepare query
	var sql = mysql.format("INSERT INTO directory (name, parent_directory_id, owner_user_id) VALUES (?, ?, ?)",
	[
		params.post.name,
		params.post.parent,
		userId
	]);

	//query the database, creating a new directory
	context.mysqlConn.query(sql, function(err, result)
	{

		//if an error occurred, return "unknown error" error code
		if (err)
		{
			params.response.write(JSON.stringify(
			{
				"err": 4
			}));
		}

		//if not, return the ID of the newly created directory
		else
		{
			params.response.write(JSON.stringify(
			{
				"id": result.insertId
			}));
		}

		//whether it's an error or not, close the connection
		params.response.end();
	});
}
