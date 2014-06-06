var mysql = require("mysql");
var fs = require("fs");

module.exports = function(params, context)
{
	var token = params.url[1];
	var id = params.url[2];

	if (context.authTokens[token])
	{
		var sql = mysql.format("SELECT mimetype, name, id FROM file WHERE id=?",
		[
			id
		]);

		context.mysqlConn.query(sql, function(err, result)
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
				createResponse(params, context, result[0]);
			}
		});
	}
}

function createResponse(params, context, file)
{
	fs.readFile(context.conf.contentDir+file.id, function(err, data)
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
			//file download headers
			params.headers["Content-Disposition"] = "attachment; filename="+file.name;
			params.headers["Content-Type"] = file.mimetype;
			params.headers["Content-Transfer-Encoding"] = "binary";
			params.headers["Accept-Ranges"] = "bytes";

			//prevent caching
			params.headers["Cache-Control"] = "private";
			params.headers["Pragma"] = "private";
			params.headers["Expires"] = "Mon, 26 Jul 1997 05:00:00 GMT";

			console.log("writing data");

			params.response.write(data);
			params.respond();
		}
	});
}
