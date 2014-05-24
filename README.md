nyrumCloud
==========

Self hosted cloud service.

##API

You interface with the API by sending a POST request to the API server, by default [host]:1337. The POST data should always be a stringified JSON object.

### Methods

#### **/auth**: 

Input:

	{
		"username": (username),
		"password": (password)
	}

Output if credentials are valid:

	{
		"token": (auth token)
	}

#### **/testAuth**:

Input:

	{
		"token": (auth token)
	}

Output:

	{
		"success": (boolean, true if token is valid, false if invalid)
	}

### Error Codes

On error, an error code is returned like this::

	{
		"err": (error code)
	}

The error code can be one of the following:

**1**:
Invalid Token (for any method which requires an auth token)

**2**:
Invalid Username/Password (for /auth)
