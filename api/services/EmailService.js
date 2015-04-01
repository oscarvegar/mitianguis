// EmailService.js - in api/services
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'oscar.monroyg@gmail.com',
        pass: 'Myoptle020406'
    }  
});
/*
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'no-reply@encuestaflu.org',
        pass: '1*Y+kXLmMY',
        host : "localhost",              // smtp server hostname
        port : "465",                     // smtp server port
        ssl: true
    }
});*/

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols



module.exports = {

    sendEmail: function(options) {
        console.log("EmailService");
        console.log(options);
        var mailOptions = {
            from: 'Notificacion ✔ <oscar.monroyg@gmail.com>', // sender address
            to: options.to, // list of receivers
            subject: options.subject, // Subject line
            text: options.text, // plaintext body
            html: options.html // html body
        };
        // send mail with defined transport object
        console.log("ENVIANDO CORREO>>>>>>>>>>");
        console.log('Sending Email: ' + JSON.stringify(mailOptions));
        transporter.sendMail(mailOptions, function(error, info){

            console.log("ERROR");
            console.log(error);

            console.log("INFO");
            console.log(info);
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
  

    }
};