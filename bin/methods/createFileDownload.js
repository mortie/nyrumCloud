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
		var file = result[0];

		if (err)
		{
			params.respond(
			{
				"err": 4
			});
		}
		else
		{
			var res = params.response;
			res.setHeader("Content-disposition", "attachment; filename="+file.name);
			res.setHeader('Content-type', file.mimetype);
			fs.createReadStream(context.conf.contentDir+file.id).pipe(res);
		}
	});
}
