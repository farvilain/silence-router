# silence-router 

A web router for NodeJS, compatible with Connect middlewares. The main goal is to provide a global `function (req, res, next)` that can do different work regarding the `req.method` and `req.path` values.

Notice that it will also fill `res.allowedmethods` with the list of methods implemented on the path, ie `['POST', 'GET']`.



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
You can also see that `res.allowedmethods` will always equals `[]`.

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

    function createUser(req, res, next){
    	//Create the user here and send the response you want
    	next();
    }

    function listUser(req, res, next){
    	//List users here and send the response you want
    	next();
    }

	var router = require('silence-builder')()
		.path("user")
			.post(createUser)
			.get(listUser)
		.createMW(badRequest, notAllowed);

```

Now you can handle `POST /user` and `GET /user` correctly with `res.allowedmethods` equals to `['POST','GET']`


### I'd like to handle the OPTIONS verb

You can of course specify it by yourself.

```javascript

	var router = require('silence-builder')()
		.path("user")
			.post(createUser)
			.get(listUser)
			.options(someFunction)
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
			.post(createUser)
			.get(listUser)
			.options(someFunction)
			.path(":userId")
				.get(userGet)
				.delete(userDelete)
		.createMW(badRequest, notAllowed);
```



### How can I stop the path hierarchy?

Simply use ̀.parent()` to go up the path hierarchy.

```javascript

	var router = require('silence-builder')()
		.path("user")
			.post(createUser)
			.get(listUser)
			.options(someFunction)
			.path(":userId")
				.get(userGet)
			.parent()
		.parent()
		.path("other")
			.get(somethingHere)
		.createMW(badRequest, notAllowed);

```
### I have a problem when adding some param path

Be aware that the router will always find the first matche, definition order is important.
Look at the following example:

```javascript
	var router = require('silence-builder')()
		.path("user")
			.post(createUser)
			.get(listUser)
			.options(someFunction)
			.path(":userId")
				.get(userGet)
				.delete(userDelete)
			.parent()
			.path("me")
				.get(whoAmi)
		.createMW(badRequest, notAllowed);
```

The `whoAmi` will never be called, just invert two blocks and you problem will be solved.

```javascript
	var router = require('silence-builder')()
		.path("user")
			.post(createUser)
			.get(listUser)
			.options(someFunction)
			.path("me")
				.get(whoAmi)
			.parent()
			.path(":userId")
				.get(userGet)
				.delete(userDelete)
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
			.post(createUser)
			.get(listUser)
			.options(someFunction)
			.path(":userId", loadUser, doALog)
				.get(userGet)
			.parent()
		.parent()
		.path("other")
			.get(somethingHere)
		.createMW(badRequest, notAllowed);

```

### Having a name on request

It could be very usefull for log to know which endpoint has been use without having to search for a http verb + a regular express on uri.
You can simply add a name for a handler as first optionnal parameter and silence-router will manage to set the variable `req.name`.

```javascript
	var router = require('silence-builder')()
		.path("user")
			.post("createUser", createUser)
			.get("listUser", listUser)
			.options(someFunction)
			.path(":userId", loadUser, doALog)
				.get("getUser", userGet)
			.parent()
		.parent()
		.path("other")
			.get("unamedMethod", somethingHere)
		.createMW(badRequest, notAllowed);

```

# <a name='API'>API</a>

* [Constructor](#method_constructor)
* [createMW](#method_createMW)
* [path](#method_path)
* [parent](#method_parent)
* [use](#method_use)
* [method](#method_method)
* [options](#method_options)
* [head](#method_head)
* [get](#method_get)
* [put](#method_put)
* [patch](#method_patch)
* [del](#method_del)

## <a name='method_constructor'>Constructor</a>

Create a new router builder.

## <a name='method_createMW'>createMW</a>

## <a name='method_path'>path</a> (path, _fcts)

Arguments : 
	* path
	* _fcts

## <a name='method_parent'>parent</a> : function()

Arguments : none

## <a name='method_use'>use</a> (_fcts)

Arguments : 
	* _fcts

## <a name='method_method'>method</a> : function(verb, name, _fct)

Arguments : 
	* verb
	* name
	* _fcts

## <a name='method_options'>options</a> (name, _fct)

This function is just an helper on [method](#method_method), using "OPTIONS" for verb param.


## <a name='method_head'>head</a> (name, _fct)

This function is just an helper on [method](#method_method), using "HEAD" for verb param.

## <a name='method_get'>get</a>

This function is just an helper on [method](#method_method), using "GET" for verb param

Arguments : 
	* name
	* _fcts

## <a name='method_put'>put</a>

This function is just an helper on [method](#method_method), using "PUT" for verb param

Arguments : 
	* name
	* _fcts

## <a name='method_patch'>patch</a>

This function is just an helper on [method](#method_method), using "PATCH" for verb param

Arguments : 
	* name
	* _fcts

## <a name='method_del'>del</a>

This function is just an helper on [method](#method_method), using "DELETE" for verb param

Arguments : 
	* name
	* _fcts
