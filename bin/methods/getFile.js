var mysql = require("mysql");
var fs = require("fs");

module.exports = function(params, context)
{
	var sql = mysql.format("SELECT mimetype, name, id FROM file WHERE id=?",
	[
		params.post.id
	]);

	context.mysqlConn.query(sql, function(err, result)
	{
		result = result[0];

		if (err)
		{
			params.respond(
			{
				"err": 4
			});
		}
		else
		{
			fs.readFile(context.conf.contentDir+result.id, function(err, data)
			{
				params.respond(
				{
					"name": result.name,
					"mimetype": result.mimetype,
					"data": data 
				});
			});
		}
	});
}
