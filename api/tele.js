const request = require('request');
const conf = require('../config');
const user = require('../user/user');
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
          if ((body.result.status == 'member') || (body.result.status == 'administrator')) {
              call(true);
          } else {
              call(false);
          }
    });
 }}


 // check(664121187, (res)=>{ console.log(res); });