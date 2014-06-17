var convert = function(){
	return this;
}

convert.prototype.solve = function(data) {
	
	if (data instanceof Array) {
		return c.array(data);
	}
	if (data instanceof Date) {
		return c.date(data);
	}
        if (data instanceof Buffer) {
		return c.Buffer(data);
        }
	if (typeof c[typeof data] === 'function'){
		return c[typeof data](data);
	}	
	return c.value(data);
}

convert.prototype.object = function(data) {
	var ret = "<struct>";
	for (var name in data) {
		ret += "<member>";
		ret += "<name>" + name + "</name>";
		ret += "<value>" + c.solve(data[name]) + "</value>";
		ret += "</member>";
	}
	return ret + "</struct>";
}

convert.prototype.array = function(data){
	
	var ret = "<array><data>"
	for (var i in data){
		ret += "<value>" + c.solve(data[i])+ "</value>";
	}
	return ret + "</data></array>";
}

convert.prototype.Buffer = function(data){
        return '<base64>' + data.toString('base64') + '</base64>';
}

convert.prototype.date = function(data){
        // cf http://xmlrpc.scripting.com/spec.html
	return "<dateTime.iso8601>" + data.toISOString() + "</dateTime.iso8601>";
}

convert.prototype.string = function(data){
	return "<string>" + data + "</string>";
}

convert.prototype.number = function(data){
	return "<int>" + data + "</int>";
}

convert.prototype.boolean = function(data){
	return "<boolean>" + ((data === true) ? "1" : "0") + "</boolean>";
}

convert.prototype.value = function(data){
	return "<value>" + data + "</value>";
}

module.exports = convert;
var c = new convert();