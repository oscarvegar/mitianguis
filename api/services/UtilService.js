
var traceback = require('traceback');
module.exports = {

	onlyUnique : function (value, index, self) {
	    return self.indexOf(value) === index;

	},

	className:function(){
		var stack = traceback();
		return stack[1].file;
	}
}
