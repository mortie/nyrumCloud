var crypto = require("crypto");

module.exports = function(pass) 
{
	//create random salt
	var salt = crypto.randomBytes(64).toString("hex");

	//create hash
	var hash = crypto.createHash("sha512")
	           .update(salt+pass)
	           .digest("hex");

	return {"salt": salt, "hash": hash};
}
