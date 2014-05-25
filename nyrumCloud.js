#!/usr/bin/env node
var scrypt    = require("scrypt");
var http      = require("http");
var fs        = require("fs");
var mysql     = require("mysql");
var async     = require("async");

var methods   = require("./bin/methods");
var tokenAuth = require("./bin/tokenAuth");

//set up project-wide context variable
var context = {
	"conf": JSON.parse(fs.readFileSync("./conf.json")),
	"authTokens": {}
}

async.series({
	"mysqlConnect": function(next) {
		context.mysqlConn = mysql.createConnection({
			"host": context.conf.mysql.host,
			"user": context.conf.mysql.user,
			"password": context.conf.mysql.password,
			"multipleStatements": true
		});

		context.mysqlConn.connect(function(err) {
			if (err) throw err;

			next();
		});
	},

	"setupSql": function(next) {
		fs.readFile("setup.sql", "utf8", function(err, data) {
			if (err) throw err;

			var query = data.replace(/\{db\}/g, context.conf.mysql.database);

			context.mysqlConn.query(query, function(err, result) {
				if (err) throw err;

				next();
			});
		});
	},

	"handleRequests": function(next) {
		http.createServer(function(request, response) {

			//get POST data
			var postBody = '';
			request.on('data', function(data) {
				postBody += data;
				if (postBody.length > context.conf.maxPostLength) {
					request.connection.destroy();
				}
			});

			//auth and handle request
			request.on('end', function() {

				//prepare variables
				var post = JSON.parse(postBody);
				var url = request.url.split("/").slice(1);
				if (url)
					var method = methods[url[0]];

				//if method exists, and authenticated (or method doesn't require authentication),
				//run the method
				console.log("running "+url[0]);
				if (method && (method.disableAuth || tokenAuth(post, context) !== false)) {
					method({
						"url": url,
						"request": request,
						"response": response,
						"post": post
					}, context);
				} else {
					response.write(JSON.stringify({
						"err": 1
					}));
					response.end();
				}
			});
		}).listen(context.conf.port);
	}
});
