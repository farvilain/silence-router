# silence-router 

A request router for NodeJS, compatible with Connect middlewares.

The main goal is to provide a global `function (req, res, next)` that can do different work regarding the `req.method` and `req.path` values.

[Getting started](#GettingStarted)

[API](#API)

## <a name='GettingStarted'>Getting started</a>

### Install the module

In your project main directory, type `npm install silence-router`

### Creating an empty router


```javascript

	var router = require('silence-builder')()
		.createMW(badRequest, notAllowed);

	function badRequest(req, res, next){
		// URI doesn't exist in your router
	}

	function notAllowed(req, res, next){
		// Method req.method is not allowed in your router
	}

```

This will returns a function (req, res, next) than you will always proceed the badRequest method.

### It's not working, I never have `req.path` setted.

NodeJS doesn't set this value but it's very trivial to implements. Add this middleware before the router in your Express/Silence/whatever process.

```
function reqPath(req,res, next){
	var path = require('url').parse(req.url).pathname;
	req.path = path;
	next();
}
```

### Let's create our first endpoints to add a user and one to list users

```javascript

    function userCreate(req, res, next){
    	//Create the user here and send the response you want
    	next();
    }

    function userList(req, res, next){
    	//List users here and send the response you want
    	next();
    }

	var router = require('silence-builder')()
		.path("user")
			.post("userCreate", userCreate)
			.get("userList", userList)
		.createMW(badRequest, notAllowed);

```

Now you can handle `POST /user` and `GET /user`. You can see that if there is a route match, `res.matchedResource` contains the resource matched.
You MUST give the function name as first param, sorry for this choice but I'm not very fan of optionnal things.

### I'd like to handle the OPTIONS verb

You can of course specify it by yourself.

```javascript

	var router = require('silence-builder')()
		.path("user")
			.post("userCreate", userCreate)
			.get("userList", userList)
			.options("userOptions", someFunction)
		.createMW(badRequest, notAllowed);

```

### I need path variable

You can add a subpath with a name starting with `:` that will be populated into req.params.

```javascript

	function userGet(req, res, next){
		//Retrieve user via req.params.userId
	}

	function userDelete(req, res, next){
		//Retrieve user via req.params.userId
	}

	var router = require('silence-builder')()
		.path("user")
			.post("userCreate", userCreate)
			.get("userList", userList)
			.options("userOptions", someFunction)
			.path(":userId")
				.get("userGet", userGet)
				.delete("userDelete", userDelete)
		.createMW(badRequest, notAllowed);
```



### How can I stop the path hierarchy?

Simply use ̀.parent()` to go up the path hierarchy.

```javascript

	var router = require('silence-builder')()
		.path("user")
			.post("userCreate", userCreate)
			.get("userList", userList)
			.options("userOptions", someFunction)
			.path(":userId")
				.get("userGet", userGet)
			.parent()
		.parent()
		.path("other")
			.get("otherGet", somethingHere)
		.createMW(badRequest, notAllowed);

```
### I have a problem when adding some param path

Be aware that the router will always find the first matche, definition order is important.
Look at the following example:

```javascript
	var router = require('silence-builder')()
		.path("user")
			.post("userCreate", userCreate)
			.get("userList", userList)
			.options("userOptions", someFunction)
			.path(":userId")
				.get("userGet", userGet)
				.delete("userDelete", userDelete)
			.parent()
			.path("me")
				.get("whoAmI", whoAmi)
		.createMW(badRequest, notAllowed);
```

The `whoAmi` will never be called, just invert two blocks and you problem will be solved.

```javascript
	var router = require('silence-builder')()
		.path("user")
			.post("userCreate", userCreate)
			.get("userList", userList)
			.options("userOptions", someFunction)
			.path("me")
				.get("whoAmI", whoAmi)
			.parent()
			.path(":userId")
				.get("userGet", userGet)
				.delete("userDelete", userDelete)
			.parent()
		.createMW(badRequest, notAllowed);
```


### I want to have some behavior on every path '/user/:id', how can I do it?

The `path` method allows you to add as many function you want, that will be executed in the right order.
Than can be very usefull in some case, see the exemple below.

```javascript

	function loadUser(req, res, next){
		User.findById(req.params.id, function(err, user){
			if(err){
				return next(err);
			}
			if(!user){
				//Respond with 404
			}

			res.loaded = res.loaded || {};
			res.loaded.user = user;
			next();
		});
	}

	function userGet(req, res, next){
		//Simply use res.loaded.user
		next();
	}

	var router = require('silence-builder')()
		.path("user")
			.post("userCreate", userCreate)
			.get("userList", userList)
			.options("userOptions", someFunction)
			.path(":userId", loadUser, doALog)
				.get("userGet", userGet)
			.parent()
		.parent()
		.path("other")
			.get("otherGet", somethingHere)
		.createMW(badRequest, notAllowed);

```

# <a name='API'>API</a>

* [Constructor](#method_constructor)
* [createMW](#method_createMW)
* [path](#method_path)
* [parent](#method_parent)
* [use](#method_before)
* [method](#method_method)
* [options](#method_options)
* [head](#method_head)
* [get](#method_get)
* [put](#method_put)
* [patch](#method_patch)
* [del](#method_del)

