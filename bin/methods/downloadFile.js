var mysql = require("mysql");
var fs = require("fs");

module.exports = function(params, context)
{
	var sql = mysql.format("SELECT data, mimetype, name, id FROM file WHERE id=?",
	[
		params.post.id
	]);

	mysql.query(sql, function(err, result)
	{
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
