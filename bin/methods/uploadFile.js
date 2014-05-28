var mysql = require("mysql");

module.exports = function(params, context)
{
	var sql = mysql.format("INSERT INTO file (name, parent_directory_id, data, mimetype, owner_user_id) VALUES (?, ?, ?, ?, ?)",
	[
		params.post.name,
		params.post.parent,
		params.post.data,
		params.post.mimetype,
		context.authTokens[params.post.token]
	]);

	context.mysqlConn.query(sql, function(err, result)
	{
		if (err)
		{
			throw err;
			params.response.write(JSON.stringify(
			{
				"err": 4
			}));
		}
		else
		{
			params.response.write(JSON.stringify(
			{
				"id": result.insertId
			}));
		}
		params.response.end();
	});
}
