#!/usr/bin/env node
var scrypt = require("scrypt");
var http = require("http");
var fs = require("fs");

var methods = require("./bin/methods");
var tokenAuth = require("./bin/tokenAuth");

//set up project-wide context variable
var context = {
	"conf": JSON.parse(fs.readSync("conf.js")),
	"authTokens": {}
}

//handle incoming requestts
var httpServer = http.createServer(function(request, response) {

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
		if (tokenAuth(request)) {
			var url = request.url.split("/").slice(1);
			methods[url[0]]({
				"url": url,
				"request": request,
				"response": response,
				"post": postBody
			}, context);
		}
	});
}).listen(conf.port);
