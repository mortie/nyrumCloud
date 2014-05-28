nyrumCloud
==========

Self hosted cloud service.

##API

You interface with the API by sending a POST request to the API server, by default [host]:1337. The POST data should always be a stringified JSON object.

### Methods

#### **/auth**: 

Authenticate.

Input:

	{
		"username": (Username),
		"password": (Password)
	}

Output if credentials are valid:

	{
		"token": (Auth token.)
	}

#### **/testToken**:

Test if token is valid.

Input:

	{
		"token": (Auth token.)
	}

Output:

	{
		"success": (Boolean. True if the token is valid, false if invalid.)
	}

#### **/makeDir**:

Create directory.

Input:

	{
		"token": (Auth token.),
		"name": (Name of the directory.),
		"parent": (ID of the parent directory. Optional.)
	}

Output:

	{
		"id": (ID of the newly created directory)
	}

#### **/listDir**:

Get the contents of a directory.

Input:

	{
		"token": (Auth token.),
		"dir": (ID of the directory you want to list. Optional. If not provided, it lists the user's root.)
	}

Output:

	{
		"dirs": (Array of directory objects. Each directory object has one "name" and one "id" property.),
		"files": (Array of file objects. Each file object has one "name" and one "id" property.)
	}

#### **/uploadFile**:

Upload a file to the server.

Input:

	{
		"token": (Auth token.),
		"data": (BLOB of the file's content.),
		"name": (File name.),
		"parent": (Parent directory of the file. Optional. If not provided, the file will be uploaded to the user's root.)
	}

Output:

	{
		"id": (ID of the newly created file.)
	}

#### **/downloadFile**:

Download a file from the server.

Input:

	{
		"token": (Auth token.),
		"id": (ID of the file you want.)
	}

Output:

	{
		"data": (BLOB of the data you want.)
	}

#### **/admin_newUser**:

Create new user. Requires admin user.

Input:

	{
		"token": (Auth token.),
		"username": (Username.),
		"password": (Password.)
	}

Output:

	{
		"success": (boolean, true if successful, false if not)
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

**3**:
Incorrect POST arguments

**4**:
Unknonwn error

**5**:
No such method exists
