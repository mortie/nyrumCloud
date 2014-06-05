#!/usr/bin/env node
var http       = require("http");
var fs         = require("fs");
var mysql      = require("mysql");
var crypto     = require("crypto");

var methods    = require("./bin/methods");
var makeCrypto = require("./bin/makeCrypto");

//set up project-wide context variable
var context =
{
	"conf": JSON.parse(fs.readFileSync("./conf.json")),
	"authTokens": {}
}

//create content directory if not exists
if (!fs.existsSync(context.conf.contentDir))
	fs.mkdir(context.conf.contentDir);

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
				var crypto = makeCrypto(context.conf.root.password);

				//create new user
				var sql = mysql.format("INSERT INTO user (username, passwordHash, passwordSalt, isAdmin) VALUES (?, ?, ?, ?)",
				[
					context.conf.root.username,
					crypto.hash,
					crypto.salt,
					true
				]);
				context.mysqlConn.query(sql, function(err, result)
				{
					if (err) throw err;

					console.log("Root user created.");

					//move on to create server
					createServer();
				});
			} 

			//if users exist, just move on to create server 
			else createServer();
		});
	});
}

function createServer()
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

		request.on('end', function()
		{
			if (postBody)
				var post = JSON.parse(postBody);

			handleRequest(post || {}, request, response);
		});
	}).listen(context.conf.port);
}

function handleRequest(post, request, response)
{
	var url = request.url.split("/").slice(1);
	if (url)
		var method = methods[url[0]];

	//if method exists, and authenticated (or method doesn't require authentication),
	//run the method

	//no such method exists, return error code 5
	if (!method)
	{
		response.write(JSON.stringify(
		{
			"err": 5
		}));
		response.end();
	}

	//method exists, and user is authenticated, all is good
	else if (method.disableAuth || context.authTokens[post.token])
	{

		//check if all required arguments are present
		var i;
		for (i in method.postArgs)
		{
			if (post[method.postArgs[i]] === undefined)
			{
				response.write(JSON.stringify(
				{
					"err": 3
				}));
				response.end();
				return;
			}
		}

		console.log("running "+url[0]);

		//if all arguments are there, proceed to run the method
		method(
		{
			"url": url,
			"request": request,
			"response": response,
			"post": post,
			"headers":
			{
				"Access-Control-Allow-Origin": "*"
			},
			"respond": function(obj)
			{
				this.response.writeHead(200, this.headers);
				if (obj)
				{
					this.response.write(JSON.stringify(obj));
				}

				this.response.end();
			}
		}, context);
	}

	//method exists, but auth token is incorrect
	else
	{
		response.write(JSON.stringify(
		{
			"err": 1
		}));
		response.end();
	}
}
