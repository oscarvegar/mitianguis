var webUtil = {
	getDomain: function() {
		var indexInit = window.location.origin.indexOf("//") + 2;
	    var indexFin = window.location.origin.indexOf(".mitianguis");
	    var urlMercanteFind = window.location.origin.substring( indexInit, indexFin );
	    return urlMercanteFind;
	}
};
