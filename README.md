# Wordpress-RPC

Module for remote Wordpress control over the XML-RPC API. Supports API-Request listed on [XML-RPC](http://codex.wordpress.org/XML-RPC_WordPress_API) with JSON.


### Example for a [getPosts](http://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.getPosts)

```javascript
  var rpc = require('wordpress-rpc'); 
  var wp = new rpc();
  var parameter = [
    1,
    username,         //set your username
    password          //set your password
  ];
  
  
  wp.call('getPosts', parameter, function(err, data){
    console.log(data);
  });
```

###default Options

```javascript
  var options = {
    https : false,
    host : 'localhost',
    port : 80,
    path : '/xmlrpc.php'
  }
  
  var wp = new rpc(options);

```
