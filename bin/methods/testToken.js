module.exports = function(params, context)
{
	if (context.authTokens[params.post.token])
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
