$.ajax({
	"type": "POST",
	"url": "http://localhost:1337/auth",
	"data": JSON.stringify({
		"username": "mort",
		"password": "asdf"
	}),
	"success": function(res) {
		console.log(res);
	}
});
