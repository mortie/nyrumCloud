#!/usr/bin/env node
var scrypt = require("scrypt");
var http = require("http");
var fs = require("fs");

var methods = require("./bin/methods");

//set up project-wide context variable
var context = {
	"conf": JSON.parse(fs.readFileSync("./conf.json")),
	"authTokens": {}
}

//handle incoming requestts
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
		if (method && (method.disableAuth || tokenAuth(post) !== false)) {
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

//authenticate based on token
function  tokenAuth(post) {
	if (context.authTokens[post.username]
	&&  context.authTokens[post.username].indexOf(post.token) !== -1) {
		console.log(post.username+" authorized");
		return true;
	} else {
		console.log(post.username+" not authorized");
		return false;
	}
}
