// EmailService.js - in api/services
var nodemailer = require('nodemailer');
var fs = require('fs');

var transporter = nodemailer.createTransport({
    //service: 'Gmail',
    auth: {
        user: 'notificaciones@mitianguis.mx',
        pass: 'powersuper'
    },
    host: 'smtp.zoho.com',
    port: 465,
    secure:true
});

module.exports = {

    sendEmail: function(options) {
        var mailOptions = {
            from: 'Equipo MiTianguis ✔ <notificaciones@mitianguis.mx>', // sender address
            to: options.to, // list of receivers
            subject: options.subject, // Subject line
            text: options.text, // plaintext body
            html: options.html // html body
        };

        if(options.cc) {
          mailOptions['cc'] = options.cc;
        }
        if(options.bcc) {
          mailOptions['bcc'] = options.bcc;
        }

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


    },
    enviarBienvenida:function(usuario,passwd){
        var file = fs.readFileSync('./config/mail/bienvenida.html',{encoding:'UTF-8'});
        file = file.replace("#usuario",usuario.username).replace("#password",passwd);
        var options ={
            to:usuario.email,
            subject:'Bienvenido a MiTianguis',
            html:file
        }
        module.exports.sendEmail(options);
    },

    enviarBienvenidaCliente:function(usuario,passwd){
        var file = fs.readFileSync('./config/mail/bienvenida.html',{encoding:'UTF-8'});
        file = file.replace("#usuario",usuario).replace("#password",passwd);
        var options ={
            to:usuario,
            subject:'Bienvenido a MiTianguis',
            html:file
        }
        module.exports.sendEmail(options);
    }
};
