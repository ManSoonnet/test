var request = require('request');
var conf = require('../config');
const cat = require('./fall');
module.exports = {
check: (mail,call)=> {
request.post({
    url: 'http://tentech-test.appspot.com/api/User/Login',
    json: {email: conf.Test,password: conf.Pass_Test}
  }, function(error, response, body){
    var x = 'Bearer ' + body.data.token;
    request.post({
        url: 'http://tentech-test.appspot.com/api/User/LoadUserList',
        headers: {'Authorization':x},
       // body:require('querystring').stringify(postData),
       body: {'Email': mail},
       json: true
      }, function(err, res, kq){
          if (cat.no_err(kq) && cat.no_err(kq.data)) {
            user = kq.data; 
            if (typeof user[0] == 'object') {
                call(true);
            } else {
                call(false);
            }
          } else {
              console.log('Loi roi');
          }
      });

  });
}}

//check('tuhoc98@gmail.com',(x)=>{ console.log(x);});