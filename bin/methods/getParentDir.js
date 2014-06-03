var mysql = require("mysql");

module.exports = function(params, context)
{
	var sql = mysql.format("SELECT parent_directory_id FROM directory WHERE id=?",
	[
		params.post.id
	]);

	context.mysqlConn.query(sql, function(err, result)
	{
		if (err)
		{
			params.respond(
			{
				"err": 4 
			});
			console.log(err);
		}
		else
		{
			params.respond(
			{
				"id": result.id
			});
		}
	});
}
