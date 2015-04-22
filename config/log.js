/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#/documentation/concepts/Logging
 */
var winston = require('winston');



module.exports.log = {
    /*colors: true,  // To get clean logs without prefixes or color codings
    custom: new winston.Logger({
    transports: [
       new (winston.transports.Console)({
        label: new Date()
    })
    ],
})*/

   level: 'verbose'
};
