

var convert = function(){
	
	return this;
}

convert.prototype.solve = function(data) {
	
	for (var i in data) {
		if (typeof this[i] !== 'undefined') {
			data = this[i](data);
		}
	}
	return data
}

convert.prototype.methodResponse = function(data) {
	var value;
	var IsFault = false;
        
	if (typeof data.methodResponse.params !== 'undefined') {
		value = data.methodResponse.params.param.value || [];
	}
	else if (typeof data.methodResponse.fault !== 'undefined') {
                IsFault = true;
		value = data.methodResponse.fault.value || [];
	}
	else throw JSON.stringify(data)
	
	var arr = [];
	value = 
		(value instanceof Array)
		? value
		: [value];
	for (var i in value) {
		arr.push(c.solve(value[i]));
	}
	// todo: by fault no params
        // faults are both in fault and params to avoid compatibility break
        if (IsFault)
                return {methodResponse : {fault : arr, params : arr}}
	return {methodResponse : {params : arr}}
}
convert.prototype.array = function(data){
	
	data = data.array.data.value || [];
	var arr = [];
	
	if (typeof data !== 'undefined') {
		data = 
			(data instanceof Array)
			? data
			: [data];
	}
	for (var i in data) {
		arr.push(c.solve(data[i]));
	}
	return arr;
}
convert.prototype['base64'] = function(data){
	var buff = new Buffer( data['base64'], 'base64');
	return buff;
}
convert.prototype['dateTime.iso8601'] = function(data){
	var date = new Date( data['dateTime.iso8601']);
	return date;
}
convert.prototype.int = function(data){
	return (!isNaN(data["int"])) ? Number(data["int"]) : null;
}
convert.prototype.string = function(data){
	return (typeof data.string === 'string') ? data.string : ""
}
convert.prototype.struct = function(data){
	data = data.struct.member || [];
	data = 
		(data instanceof Array)
		? data
		: [data];
		
	var struct = {};
	for (var i in data) {
		struct[data[i].name] = c.solve(data[i].value);
	}
	return struct;
}
convert.prototype.boolean = function(data){
	var bool = (data.boolean === '1')
		? true 
		: (data.boolean === '0')
		? false
		: data;
	return bool;
}
module.exports = convert;
var c = new convert();