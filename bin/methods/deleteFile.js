var mysql = require("mysql");

module.exports = function(params, context)
{
	var sql = mysql.format("DELETE FROM file WHERE id=?",
	[
		params.post.id
	]);

	context.mysqlConn.query(sql, function(err, result)
	{
		if (err)
		{
			params.response.write(JSON.stringify(
			{
				"success": false
			}));
			params.response.end();
		}
		else
		{
			params.response.write(JSON.stringify(
			{
				"success": true
			}));
			params.response.end();
		}
	});
}
