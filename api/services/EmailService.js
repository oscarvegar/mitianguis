// EmailService.js - in api/services
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'oscarvegar@gmail.com',
        pass: 'boniboni'
    }  
});

module.exports = {

    sendEmail: function(options) {
        var mailOptions = {
            from: 'Notificacion ✔ <miTianguis@miTianguis.mx>', // sender address
            to: options.to, // list of receivers
            subject: options.subject, // Subject line
            text: options.text, // plaintext body
            html: options.html // html body
        };
        // send mail with defined transport object
        // console.log("ENVIANDO CORREO>>>>>>>>>>");
        // console.log('Sending Email: ' + JSON.stringify(mailOptions));
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
  

    }
};