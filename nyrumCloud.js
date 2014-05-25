#!/usr/bin/env node
var http      = require("http");
var fs        = require("fs");
var mysql     = require("mysql");
var crypto    = require("crypto");

var methods   = require("./bin/methods");
var tokenAuth = require("./bin/tokenAuth");

//set up project-wide context variable
var context =
{
	"conf": JSON.parse(fs.readFileSync("./conf.json")),
	"authTokens": {}
}

mysqlConnect();

function mysqlConnect()
{
	context.mysqlConn = mysql.createConnection(
	{
		"host": context.conf.mysql.host,
		"user": context.conf.mysql.user,
		"password": context.conf.mysql.password,
		"multipleStatements": true
	});

	context.mysqlConn.connect(function(err)
	{
		if (err) throw err;

		setupSql();
	});
}

function setupSql()
{

	//get the setup query from setup.sql
	try
	{
		var data = fs.readFileSync("setup.sql", "utf8");
	}
	catch (err)
	{
		throw err;
	}

	//run the standard setup query
	var query = data.replace(/\{db\}/g, context.conf.mysql.database);
	context.mysqlConn.query(query, function(err, result)
	{
		if (err) throw err;

		//if no users exist, create a root user
		context.mysqlConn.query("SELECT id FROM user", function(err, result)
		{
			if (err) throw err;

			//if users exists
			if (!result.length)
			{
				console.log("No users. Creating root user...");

				//generate salt and hash
				try
				{
					//create random salt
					var salt = crypto.randomBytes(64).toString("hex");

					//create hash
					var hash = crypto.createHash("sha512")
					          .update(salt+context.conf.root.password)
					          .digest("hex");
				}
				catch (err)
				{
					throw err;
				}

				//create new user
				var sql = mysql.format("INSERT INTO user (username, passwordHash, passwordSalt, isAdmin) VALUES (?, ?, ?, ?)",
				[
					context.conf.root.username,
					hash,
					salt,
					true
				]);
				context.mysqlConn.query(sql, function(err, result)
				{
					if (err) throw err;

					console.log("Root user created.");

					//move on to handle requests
					handleRequests();
				});
			} 

			//if users exist, just move on to handle rquestes
			else handleRequests();
		});
	});
}

function handleRequests()
{
	http.createServer(function(request, response)
	{

		//get POST data
		var postBody = '';
		request.on('data', function(data)
		{
			postBody += data;
			if (postBody.length > context.conf.maxPostLength)
			{
				request.connection.destroy();
			}
		});

		//auth and handle request
		request.on('end', function()
		{

			//prepare variables
			var post = JSON.parse(postBody);
			var url = request.url.split("/").slice(1);
			if (url)
				var method = methods[url[0]];

			//if method exists, and authenticated (or method doesn't require authentication),
			//run the method
			console.log("running "+url[0]);
			if (method && (method.disableAuth || tokenAuth(post, context) !== false))
			{
				method(
				{
					"url": url,
					"request": request,
					"response": response,
					"post": post
				}, context);
			}
			else
			{
				response.write(JSON.stringify(
				{
					"err": 1
				}));
				response.end();
			}
		});
	}).listen(context.conf.port);
}
