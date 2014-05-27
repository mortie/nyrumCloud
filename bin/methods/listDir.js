var mysql = require("mysql");

var dirQueryResult = undefined;
var fileQueryResult = undefined;

module.exports = function(params, context)
{
	fileQueryDone = false;
	dirQueryDone = false;

	var userId = context.authTokens[params.post.token];

	//format queries
	var dirSql = createSql("directory", userId, params.post.parent);
	var fileSql = createSql("file", userId, params.post.parent);

	//execute directory list SQL
	context.mysqlConn.query(dirSql, function(err, result)
	{
		dirQueryResult = result;
		respond(params, context);
	});

	//execute file list SQL
	context.mysqlConn.query(fileSql, function(err, result)
	{
		fileQueryResult = result;
		respond(params, context);
	});
}

function respond(params, context)
{
	if (dirQueryResult !== undefined
	&&  fileQueryResult !== undefined)
	{
		
	}
}

function createSql(table, userId, parent)
{
	if (parent)
	{
		return mysql.format("SELECT name, id FROM ? WHERE owner_user_id=? AND parent_directory_id=?",
		[
			table,
			userId,
			parent
		]);
	}
	else
	{
		return mysql.format("SELECT name, id FROM ? WHERE owner_user_id=? AND parent_directory_id IS NULL",
		[
			table,
			userId
		]);
	}
}
