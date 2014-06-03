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

e.makeDir = require("./makeDir.js");
e.makeDir.postArgs =
[
	"token",
	"name"
	//optional: parent
]

e.listDir = require("./listDir.js");
e.listDir.postArgs =
[
	"token"
	//optional: dir
]

e.deleteDir = require("./deleteDir.js");
e.deleteDir.postArgs =
[
	"token",
	"id"
]

e.getParentDir = require("./getParentDir.js");
e.getParentDir.postArgs =
[
	"token",
	"id"
]

e.uploadFile = require("./uploadFile.js");
e.uploadFile.postArgs =
[
	"token",
	"name",
	"data",
	"mimetype"
	//optional: parent
]

e.downloadFile = require("./downloadFile.js");
e.downloadFile.postArgs =
[
	"token",
	"id"
]

e.deleteFile = require("./deleteFile.js");
e.deleteFile.postArgs =
[
	"token",
	"id"
]

e.admin_newUser = require("./admin_newUser.js");
[
	"username",
	"password",
	"token"
]
