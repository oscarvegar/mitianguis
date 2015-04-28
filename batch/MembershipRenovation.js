/**
 * Created by phoenix on 22/04/15.
 */

var root = this;

var Renovating = function(ref) {
  var memberRenew = ref;
  return {
    exec: function(params) {
      memberRenew.log('Renovating');
    }
  };
}

var Reprocessing = function(ref) {
  var memberRenew = ref;
  return {
    exec: function(params) {
      memberRenew.log('Reprocessing');
    }
  };
}

var MembershipRenovation = function() {
  this.renovating = new Renovating(this);
  this.reprocessing = new Reprocessing(this);
};

MembershipRenovation.prototype.log = function(method) {
  console.log('MembershipRenovation! :: ' + method);
};

MembershipRenovation.prototype.renovate = function(opt, cb) {

};

MembershipRenovation.prototype.reprocess = function(opt, cb) {
  var amqp = require('amqplib'),
    connection = amqp.connect('amqp://superpower:powersuper@mitianguis.mx'),
    w = 'billing-renovacion-fail',
    q = 'billing-renovacion';

  // Consumer
  connection.then(function(conn) {
    var ok = conn.createChannel();
    ok = ok.then(function(ch) {
      var index = 0;
      var assert = ch.assertQueue(w);
      assert.then(function(ok) {

        ch.consume(w, function(msg) {
          if (msg !== null) {
            index++;
            if(index <= ok.messageCount) {

              console.log(msg.content.toString());

              var jsonVal = JSON.parse(msg.content.toString());
              if(jsonVal.mercante == opt.mercante) {

                console.log('this is the ONE! :: ' + msg.content.toString());

                // Publisher
                var ok2 = conn.createChannel();
                ok2 = ok2.then(function(chw) {
                  chw.assertQueue(q);
                  var options = {
                    deliveryMode: 2,
                    contentEncoding: 'utf8'
                  };
                  // chw.sendToQueue(q, jsonVal);
                  var pubVal = chw.publish('', q, msg.content, options);
                  return pubVal;
                }).then(function(data) {
                  console.log('then publisher channel');
                  console.log(data);
                  cb(null, data);
                  return data;
                });

                ch.ack(msg);
                return ok;
              } else {
                ch.nack(msg, false, true);
              }

            } else {
              console.log('ya me pase!');

              var secs = 1;
              setTimeout(function() {
                console.log(" [x] Done");
                ch.close();
                conn.close();
              }, secs * 1000);
            }
          }
        }, { noAck: false }).then(function(data) {
          console.log('then consumer consumeOper');
          console.log(data);
          return data;
        });

      });
    }).then(function(data) {
      console.log('then consumer channel');
      console.log(data);
      return data;
    });
    return ok;
  }).then(function(data) {
    console.log('then consumer conn');
    console.log(data);
    return data;
  });

};

if(typeof module !== 'undefined' && module.exports) {
  module.exports = new MembershipRenovation();
} else {
  root.membershipRenovation = new MembershipRenovation();
}
