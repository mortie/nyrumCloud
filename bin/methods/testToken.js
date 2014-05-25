var tokenAuth = require("../tokenAuth");

module.exports = function(params, context)
{
	if (tokenAuth(params.post, context))
	{
		params.response.write(JSON.stringify(
		{
			"success": true
		}))
	}
	else
	{
		params.response.write(JSON.stringify(
		{
			"success": false
		}));
	}
	params.response.end();
}
