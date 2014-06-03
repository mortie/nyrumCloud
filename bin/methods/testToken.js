module.exports = function(params, context)
{
	if (context.authTokens[params.post.token])
	{
		params.respond(
		{
			"success": true
		});
	}
	else
	{
		params.respond(
		{
			"success": false
		});
	}
}
