var mysql = require("mysql");
var fs = require("fs");

module.exports = function(params, context)
{

	//prepare query to insert metadata
	var sql = mysql.format("INSERT INTO file (name, parent_directory_id, mimetype, owner_user_id) VALUES (?, ?, ?, ?)",
	[
		params.post.name,
		params.post.parent,
		params.post.mimetype,
		context.authTokens[params.post.token]
	]);

	//execute query
	context.mysqlConn.query(sql, function(err, result)
	{
		if (err)
		{
			throw err;
			params.respond(
			{
				"err": 4
			});
		}
		else
		{
			params.respond(
			{
				"id": result.insertId
			});

			//if successful, store the file in the `content` directory
			fs.writeFile(context.conf.contentDir+result.insertId, params.post.data);
		}
	});
}
