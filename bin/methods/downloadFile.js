var mysql = require("mysql");

module.exports = function(params, context)
{
	var sql = mysql.format("SELECT data, mimetype, name FROM file WHERE id=?",
	[
		params.post.id
	]);

	mysql.query(sql, function(err, result)
	{
		if (err)
		{
			params.response.write(JSON.stringify(
			{
				"err": 4
			}));
			params.response.end();
		}
		else
		{
			params.response.write(JSON.stringify(
			{
				"name": result.name,
				"mimetype": result.mimetype,
				"data": result.data
			}));
			params.response.end();
		}
	});
}
