var schedule = require('node-schedule'),
    mongodb = require('mongodb'),
    moment = require('moment');

var dbg = null;

var job = new schedule.Job(function() {
    var Mercante = dbg.collection('mercante');
    console.log({createdAt:{$gte:moment().startOf('day').toDate(),$lt:moment().add(1,'days').startOf('day').toDate() }})
    Mercante.find({createdAt:{$gte:moment().startOf('day').toDate(),$lt:moment().add(1,'days').startOf('day').toDate() }}).toArray(function(err,found){
        console.log(found);
    })
});



//SE DECLARA LA CONEXIÓN SI ES DESARROLLO O PRODUCCIÓN
var dbstr = "mongodb://localhost:27017/dev_mitianguis";
if(process.argv.slice(2).indexOf('--prod')>=0){
    console.log("AMBIENTE PRODUCTIVO");
    dbstr = "mongodb://10.100.1.31:27017/mitianguis";
}
mongodb.connect(dbstr, function (err, db) {
    if(!err) {
        console.log("We are connected");
        var rule = new schedule.RecurrenceRule();
        //rule.hour = 12; // fire at twelve o'clock
        //rule.minute = 0; // fire at minute 0
        rule.second = null; // fire at second 0
        dbg = db;
        job.schedule(rule);
    }
});
