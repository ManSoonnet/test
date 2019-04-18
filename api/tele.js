const request = require('request');
const conf = require('../config');
const user = require('../user/user');
const cat = require('./fall');
module.exports = {
check: (id,call)=> {
    var _uri = 'https://api.telegram.org/bot' + conf.Token_Tele + '/getChatMember';
    console.log(_uri);
    request({
        method: 'GET',
        uri: _uri,
        qs: {
            chat_id: user.Chat_id,
            user_id: id 
        },
        json: true
      }, function (error, res, body) {
          if ( cat.no_err(body) && cat.no_err(body.result) ) {
            if ((body.result.status == 'member') || (body.result.status == 'administrator') || (body.result.status == 'creator') || (body.result.status == 'restricted')) {
                call(true);
            } else {
                call(false);
            }
          } else {
              console.log('Loi roi');
          }
    });
 }}


 // check(664121187, (res)=>{ console.log(res); });