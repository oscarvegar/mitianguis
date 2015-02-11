var context = require('rabbit.js').createContext("amqp://superpower:powersuper@mitianguis.mx");
 context.on('ready', function() {
    var sub = context.socket('WORKER',{ ack: true });
    sub.on('data', function(note) { 
        console.log(JSON.parse(note))
	sub.ack();
    });
    sub.connect('events', function() {

    }); 
});
