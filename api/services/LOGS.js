
var traceback = require('traceback');
function format(args){
	var keys = Object.keys(args)
	var arre = [traceback()[2].file+" - "+traceback()[2].name+" - "];
	for(var i in keys){
		arre.push(args[keys[i]])
	}
	return arre;
}
module.exports = {
	info:function(){
		sails.log.info.apply(this,format(arguments))
	},
	warn:function(){
		sails.log.warn.apply(this,format(arguments))
	},
	error:function(){
		sails.log.error.apply(this,format(arguments))
	},
	verbose:function(){
		sails.log.verbose.apply(this,format(arguments))
	},
	debug:function(){
		sails.log.debug.apply(this,format(arguments))
	}
}
