//git add . && git commit -m "update" && git push heroku master && clear && heroku logs --tail
'use strict';
const conf = require('./config');
const cat = require('./api/fall');
const user = require('./user/user');
const pic = require('./user/pic');
const outbox = require('./outbox/outbox'); 
const card = require('./inbox/card');
const model = require('./model/model');
const tube = require('./api/tube'); 
const email = require('./api/email'); 
const tele = require('./api/tele');
const ten = require('./api/ten'); 
const eth = require('./api/eth'); 
const sha256 = require('js-sha256');
const BootBot = require('bootbot');
const express = require('express');
const bot = new BootBot({
  accessToken: conf.FB_PAGE_TOKEN,
  verifyToken: conf.FB_VERIFY_TOKEN,
  appSecret: conf.FB_APP_SECRET
}); 
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/condition', (req, res) => {
  res.render("condition");
});
app.get('/wallet', (req, res) => {
  var re = req.query;
  model.get({psid: re.id},(x)=>{
    if (cat.no_err(x)) {
      if (x.locale == 'vi_VN'){
        if (x.fanpage == false) {x.fanpage = 'Chưa hoàn thành'} else {x.fanpage = 'Đã Like'}
        if (x.twitter == false) {x.twitter = 'Chưa hoàn thành'} else {x.twitter = 'Đã Follow'}
        if (x.youtube == 'None') {x.youtube = 'Chưa thực hiện'}
        if (x.app == false) {x.app = 'Chưa đăng kí'}
        if (x.group == false) {x.group = 'Chưa tham gia'} 
        var a = x.email;
        if (a.indexOf('@') == -1) {x.email = 'Chưa xác nhận'}
      } else {
        if (x.fanpage == false) {x.fanpage = 'Incomplete'} else {x.fanpage = 'Liked'}
        if (x.twitter == false) {x.twitter = 'Incomplete'} else {x.twitter = 'Followed'}
        if (x.youtube == 'None') {x.youtube = 'Unfulfilled'}
        if (x.app == false) {x.app = 'Not registered'}
        if (x.group == false) {x.group = 'Not participate'}
        var a = x.email;
        if (a.indexOf('@') == -1) {x.email = 'Unconfimred'}   
      }
      var link = user.Link_Ref + x.psid;
      res.render("wallet",{
        total: x.total,
        ref: link,
        psid: x.psid,
        name: x.name,
        refnumber: x.refnumber,
        email: x.email,
        group: x.group,
        app: x.app,
        fanpage: x.fanpage,
        twitter: x.twitter,
        youtube: x.youtube,
        faq: x.faq
      });
    } else {
      res.send('ERROR');
    }
  })
});
app.get('/mail', (req, res) => {
  var re = req.query;
  model.get({psid: re.value},(x)=>{
    if (cat.no_err(x)) {
      if (re.key == x.email) {
        if (re.locale == 'vn') {
          bot.say(re.value,"Bạn đã xác nhận Email thành công!")
          .then(()=>{
            bot.say(re.value,card.card_4_vi); 
          })
          if (re.rec != 'None') {
            bot.say(re.rec,'Chúc mừng bạn vừa nhận được 50 TEN. Bạn bè của bạn đã tham gia TENTECH');
            model.upinc({psid: re.rec},{refnumber: 1,total: 50});
          }
        } else {
          bot.say(re.value,"You have successfully confirmed Email!")
          .then(()=>{
            bot.say(re.value,card.card_4);
          })
          if (re.rec != 'None') {
            bot.say(re.rec,'Congratulations on receiving 50 TEN. Your friends have joined TENTECH');
            model.upinc({psid: re.rec},{refnumber: 1,total: 50});
          }
        }
        model.upset({email: re.key},{email: re.mail});
        res.render("formail");
      } else {
        if (re.locale == 'vn') {
          res.render("formail");
          //bot.say(re.value,'Email đã tồn tại!')
        } else {
          res.render("formail");
          //bot.say(re.value,'Email already exists!')
        }
      }
    } else {
      bot.say(re.value,'UNKNOW');
    }
  })
});
app.get('/faq', (req, res) => {
  var re = req.query;
  console.log(re);
  model.get({psid: re.id},(a)=>{
    if (cat.no_err(a)) {
      if (a.faq == 0) {
        res.render("faq",{id: re.id});
      } else {
        res.send('<h1>ERROR</h1>');
        if (a.locale == 'vi_VN') {
          bot.say(a.psid,'Bạn đã hoàn thành nhiệm vụ này trước đó')
        } else {
          bot.say(a.psid,'You have completed this task before')
        } 
      }
    } else {
      bot.say(a.psid,'UNKNOW')
    }
  })
});
app.get('/aq', (req, res) => {
  res.render("mail");
  var re = req.query;
  console.log(re);
  var _psid = Object.keys(re)[0];
  var qa = re[Object.keys(re)[0]];
  var ten = qa*20;
  model.get({psid: _psid},(x)=>{
    if (cat.no_err(x)) {
      if (x.locale == 'vi_VN'){
        var text = 'Bạn đã trả lời chính xác ' + qa + ' câu hỏi trong nhiệm vụ này. Chúc mừng bạn đã nhận được phần thưởng: '+ ten + ' TEN';
        bot.say(_psid,text);
      } else {
        var text = 'Your reply is correct ' + qa + ' questions in this task. Congratulations on receiving the reward: '+ ten + ' TEN';
        bot.say(_psid,text);
      }
    } else {
      console.log('Bi loi');
    }
  })
  model.upset({psid: _psid},{faq: qa});
  model.upinc({psid: _psid},{total: ten});
});
app.get('/likefb', (req, res) => {
  var re = req.query;
  console.log(re);
  model.get({psid: re.id},(a)=>{
    if (cat.no_err(a)) {
      if (a.fanpage == false) {
        res.render("likefb",{id: re.id});
      } else {
        res.send('<h1>ERROR</h1>');
        if (a.locale == 'vi_VN') {
          bot.say(a.psid,'Bạn đã hoàn thành nhiệm vụ này trước đó')
        } else {
          bot.say(a.psid,'You have completed this task before')
        } 
      }
    } else {
      console.log('Bi loi');
    }
  })
});
app.get('/fb', (req, res) => {
  res.render("mail");
  var re = req.query; 
  console.log(re);
  var _psid = Object.keys(re)[0];
  var qa = re[Object.keys(re)[0]];
  model.get({psid: _psid},(x)=>{
    if (cat.no_err(x)) {
      if (x.locale == 'vi_VN') {
        bot.say(_psid,'Bạn đã nhận được 30 TEN cho nhiệm vụ Like Fanpage')
      } else {
        bot.say(_psid,'You have received 30 TEN for Fanpage Like tasks')
      }
    } else {
      console.log('Bi loi');
    }
  })
  model.upset({psid: _psid},{fanpage: true});
  model.upinc({psid: _psid},{total: 30});
});
app.get('/liketw', (req, res) => {
  var re = req.query;
  console.log(re);
  model.get({psid: re.id},(a)=>{
    if (cat.no_err(a)) {
      if (a.twitter == false) {
        res.render("liketw",{id: re.id});
      } else {
        res.send('<h1>ERROR</h1>');
        if (a.locale == 'vi_VN') {
          bot.say(a.psid,'Bạn đã hoàn thành nhiệm vụ này trước đó')
        } else {
          bot.say(a.psid,'You have completed this task before')
        } 
      }
    } else {
      console.log('Bi loi');
    }
  })
});
app.get('/tw', (req, res) => {
  res.render("mail");
  var re = req.query;
  console.log(re);
  var _psid = Object.keys(re)[0];
  var qa = re[Object.keys(re)[0]];
  model.get({psid: _psid},(x)=>{
    if (cat.no_err(x)) {
      if (x.locale == 'vi_VN') {
        bot.say(_psid,'Bạn đã nhận được 30 TEN cho nhiệm vụ Follow Twitter')
      } else {
        bot.say(_psid,'You have received 30 TEN for Twitter Follow tasks')
      }
    } else {
      console.log('Bi loi');
    }
  })
  model.upset({psid: _psid},{twitter: true});
  model.upinc({psid: _psid},{total: 30});
});
app.listen(process.env.PORT || 3000, () => {
  console.log('App listening');
});