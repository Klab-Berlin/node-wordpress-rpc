var xml2js = require('xml2js'),
	http = require('http'),
	https = require('https'),
	convertJS = require('./convertJS.js'),
	convertXML = require('./convertXML.js');

var xmlRpc = function() {
	
	var options = arguments[0] || {};
	if (options.https === true) {
		this.options.port = 443
	}
	for (var i in options) {
		this.options[i] = options[i];
	}
	
	return this;
}

xmlRpc.prototype.options = {
	https : false,
	host : 'localhost',
	port : 80,
	path : "/xmlrpc.php"
}

xmlRpc.prototype.getPosts = function(parameter, callback){
	this.call('wp.getPosts', parameter, callback);
}

xmlRpc.prototype.getPost = function(parameter, callback){
	this.call('wp.getPost', parameter, callback);
}

xmlRpc.prototype.getPage = function(parameter, callback){
	this.call('wp.getPage', parameter, callback);
}


xmlRpc.prototype.call = function(method, parameter, callback){
	
	var cXML = new convertXML();
	var str = "";
	
	function convertParams () {
		var str = "<params>";
		
		for (var i in parameter) {
			str += cXML.solve(parameter[i]);
		}
		return str+"</params>"
	}
	
	str += '<methodCall>';
	str += '<methodName>' + method + '</methodName>';
	str += convertParams() + '</methodCall>';
	
	// return console.log(str);
	this.request(str, callback);
}

xmlRpc.prototype.handleXML = function(xml, callback){
	var myInstance = this;
	
	function doCallback(json){
		var c = new convertJS();
		json = c.solve(json);
		callback(null, json);
	}

	new xml2js
	.Parser({explicitArray  : false, mergeAttrs : true})
	.addListener('end', doCallback)
	.parseString(xml);
}

xmlRpc.prototype.request = function(){
	
	var post = new Buffer("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>" + arguments[0]),
		callback = arguments[1];
	var errors = [],
		response = [],
		myInstance = this,
		options = {
			method: "POST",
			headers : {
				"content-length" : post.length
			},
			host : myInstance.options.host,
			port : myInstance.options.port,
			path : myInstance.options.path
		},
		req;

	function setResponse(res) {
		res.setEncoding('utf8');
		res.on('data',responseData);
		res.on('error',responseError);
		res.on('end', responseEnd);		
	}
	
	function responseData(data) {
		response.push(data);	
	}

	function responseError(data) {
		errors.push(data);
	}
	
	function responseEnd(){

		if (errors.length > 0){
			return callback(errors.join(""))
		}	
		myInstance.handleXML(response.join(""), callback);
	}
	
	req = 
		(this.options.https === true)
		? https.request(options,setResponse)
		: http.request(options,setResponse);
	req.write(post);
	req.on('error', responseError),
	req.end();
}

module.exports = xmlRpc;

