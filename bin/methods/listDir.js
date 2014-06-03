var mysql = require("mysql");

var dirQueryResult;
var fileQueryResult;

module.exports = function(params, context)
{
	dirQueryResult = undefined;
	fileQueryResult = undefined;

	var userId = context.authTokens[params.post.token];

	//format queries
	var dirSql = createSql("directory", userId, params.post.id);
	var fileSql = createSql("file", userId, params.post.id);

	//execute directory list SQL
	context.mysqlConn.query(dirSql, function(err, result)
	{
		dirQueryResult = result || [];
		respond(params, context);
	});

	//execute file list SQL
	context.mysqlConn.query(fileSql, function(err, result)
	{
		fileQueryResult = result || [];
		respond(params, context);
	});
}

function respond(params, context)
{
	if (dirQueryResult !== undefined 
	&&  fileQueryResult !== undefined)
	{
		params.respond(
		{
			"files": fileQueryResult || [],
			"directories": dirQueryResult || []
		});
	}
}

function createSql(table, userId, id)
{
	if (id)
	{
		return mysql.format("SELECT name, id FROM ?? WHERE owner_user_id=? AND parent_directory_id=?",
		[
			table,
			userId,
			id
		]);
	}
	else
	{
		return mysql.format("SELECT name, id FROM ?? WHERE owner_user_id=? AND parent_directory_id IS NULL",
		[
			table,
			userId
		]);
	}
}
