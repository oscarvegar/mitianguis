/**
 * Created by rmdj on 30/03/2015.
 */

var root = this;

var GET_METHOD = 'get';
var POST_METHOD = 'post';

var CONEKTA_API_AWS = 'https://conektaapi.s3.amazonaws.com/v0.3.2/js/conekta.js';
var CONEKTA_API_AWS_DEBUG = 'https://conektaapi.s3.amazonaws.com/v0.3.2/js/conekta.js';
var CONEKTA_API_ROOT_URL = 'https://api.conekta.io';

var CONEKTA_API_CHARGES_ROUTE = '/charges';
var CONEKTA_API_CUSTOMERS_ROUTE = '/customers';
var CONEKTA_API_SUBSCRIPTION_ROUTE = '/subscription';

var CONEKTA_API_HEADERS = {
  'Accept': 'application/vnd.conekta-v0.3.0+json',
  'Content-type': 'application/json'
};

var createSession =  function() {
  var useable_characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var session_id = '';
  for (i = _i = 0; _i <= 30; i = ++_i) {
    session_id += useable_characters.charAt(Math.floor(Math.random() * 36));
  }
  return session_id;
}

var SESSION_ID = createSession();

var TEST_BASIC_AUTHENTICATION_VERSION = function(ref) {
  var conekta = ref;
  return {
    create: function(params) {
      params['endpoint'] = CONEKTA_API_CHARGES_ROUTE;
      // params['method'] = POST_METHOD;
      params['typeOfCall'] = 'basic';
      conekta.load(params);
    }
  }
}

var CREDIT_DEBIT_CARD_BASIC_CHARGE = function(ref) {
  var conekta = ref;
  return {
    create: function(params) {
      params['endpoint'] = CONEKTA_API_CHARGES_ROUTE;
      params['method'] = POST_METHOD;
      params['typeOfCall'] = 'basic';
      conekta.load(params);
    }
  }
}

var CREDIT_DEBIT_CARD_ADVANCED_CHARGE = function(ref) {
  var conekta = ref;
  return {
    create: function(params) {
      params['endpoint'] = CONEKTA_API_CHARGES_ROUTE;
      params['method'] = POST_METHOD;
      params['typeOfCall'] = 'advanced';
      conekta.load(params);
    }
  }
}

var ConektaIO = function() {
  this.TEST_BASIC_AUTHENTICATION_VERSION = new TEST_BASIC_AUTHENTICATION_VERSION(this);
  this.CREDIT_DEBIT_CARD_BASIC_CHARGE = new CREDIT_DEBIT_CARD_BASIC_CHARGE(this);
  this.CREDIT_DEBIT_CARD_ADVANCED_CHARGE = new CREDIT_DEBIT_CARD_ADVANCED_CHARGE(this);
};

ConektaIO.prototype.public_key = void 0;
ConektaIO.prototype.private_key = void 0;

ConektaIO.prototype.build_request = function(args) {
  var absolute_path = CONEKTA_API_ROOT_URL + args.endpoint;
  var buff = new Buffer(this.private_key + ':');
  var strB64 = buff.toString('base64');
  var xhr = null;
  CONEKTA_API_HEADERS['Authorization'] = 'Basic ' + strB64;
  var params = {
    url: absolute_path,
    headers: CONEKTA_API_HEADERS
  };

  if(args.method == GET_METHOD) {
    params['qs'] = args.params;
  } else {
    params['form'] = args.params;
  }

  if(typeof module !== 'undefined' && module.exports) {
    xhr = require('request');
    xhr[args.method](params, function(error, response, body) {
      if(response.statusCode != 200 && response.statusCode != 201) {
        // args.error(body, args.params);
        args.result(body, null, args.params);
      } else {
        // args.success(body, args.params);
        args.result(null, body, args.params);
      }
    });
    return false;
  } else {
    if(window.ActiveXObject) {
      var activexModes = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];
      for(var i = 0; i < activexModes.length; i++) {
        try {
          xhr = new ActiveXObject(activexModes[i]);
        } catch(e) {}
      }
    } else {
      xhr = new XMLHttpRequest();
    }

    var url = params.url;
    var formData = null;

    if(args.method == GET_METHOD) {
      if(args.params != {}) {
        var qs = require('querystring');
        url += '?' + qs.stringify(args.params);
      }
    } else {
      formData = new FormData();
      for(var param in args.params) {
        formData.append(param, args.params[param]);
      }
    }

    xhr.open(args.method, url, true);

    for(var header in params.headers) {
      xhr.setRequestHeader(header, params.headers[header]);
    }

    xhr.onload = function() {
      // args.success(JSON.parse(xhr.responseText));
      args.result(null, JSON.parse(xhr.responseText), args.params);
    }

    xhr.onerror = function() {
      // args.error(JSON.parse(xhr.responseText));
      args.result(JSON.parse(xhr.responseText), null, args.params);
    }

    xhr.send(formData);
    return false;
  }
}

ConektaIO.prototype.load = function(data) {
  var args = {
    endpoint: data.endpoint,
    method: data.method || GET_METHOD,
    typeOfCall: data.typeOfCall || '',
    params: data.params || {},
    // success: data.success || function() {},
    // error: data.error || function() {}
    result: data.result || function() {}
  }

  return this.build_request(args);
}

if(typeof module !== 'undefined' && module.exports) {
  module.exports = new ConektaIO();
} else {
  root.conektaIO = new ConektaIO();
}
