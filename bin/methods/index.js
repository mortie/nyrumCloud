var e = module.exports;

e.auth = require("./auth.js");
e.auth.disableAuth = true;
e.auth.postArgs =
[
	"username",
	"password"
]

e.testToken = require("./testToken.js");
e.testToken.disableAuth = true;
e.testToken.postArgs =
[
	"token"
]

e.admin_newUser = require("./admin_newUser.js");
[
	"username",
	"password",
	"token"
]
