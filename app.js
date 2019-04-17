//git add . && git commit -m "update" && git push heroku master && clear && heroku logs --tail
'use strict';
const conf = require('./config');
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
const app = bot.app;
/*---------------------------------router----------------------------*/
//Cau hinh Views ejs
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/index', (req, res) => {
  res.render("index");
});
//------------------------------------------------------------------------
app.get('/condition', (req, res) => {
  res.render("condition");
});
//-------------------------------------------------------------------------
app.get('/wallet', (req, res) => {
  var re = req.query;
  model.get({psid: re.id},(x)=>{
    //-----Chinh vi
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
  })
}); 

//--------------------------------------------------------------------
app.get('/mail', (req, res) => {
  var re = req.query;
  model.get({psid: re.value},(x)=>{
    if (re.key == x.email) {
      if (re.locale == 'vn') {
        bot.say(re.value,"Bạn đã xác nhận Email thành công!")
        .then(()=>{
          bot.say(re.value,card.card_4_vi); //Gui card app tieng viet
        })
        if (re.rec != 'None') {
          bot.say(re.rec,'Chúc mừng bạn vừa nhận được 50 TEN. Bạn bè của bạn đã tham gia TENTECH');
          model.upinc({psid: re.rec},{refnumber: 1,total: 50});
        }
      } else {
        bot.say(re.value,"You have successfully confirmed Email!")
        .then(()=>{
          bot.say(re.value,card.card_4); //Gui card app tieng anh
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
        bot.say(re.value,'Email đã tồn tại!')
      } else {
        bot.say(re.value,'Email already exists!')
      }
    }
  })
});
//---------------------------------------------------------
//FAQ
app.get('/faq', (req, res) => {
  var re = req.query;
  console.log(re);
  //bo sung lenh chan mo lai link
  model.get({psid: re.id},(a)=>{
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
    if (x.locale == 'vi_VN'){
      var text = 'Bạn đã trả lời chính xác ' + qa + ' câu hỏi trong nhiệm vụ này. Chúc mừng bạn đã nhận được phần thưởng: '+ ten + ' TEN';
      bot.say(_psid,text);
    } else {
      var text = 'Your reply is correct ' + qa + ' questions in this task. Congratulations on receiving the reward: '+ ten + ' TEN';
      bot.say(_psid,text);
    }
  })
  model.upset({psid: _psid},{faq: qa});
  model.upinc({psid: _psid},{total: ten});
});
//--------------------------------------------------------------------------------
//FB
app.get('/likefb', (req, res) => {
  var re = req.query;
  console.log(re);
  model.get({psid: re.id},(a)=>{
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
  })
});

app.get('/fb', (req, res) => {
  res.render("mail");
  var re = req.query; 
  console.log(re);
  var _psid = Object.keys(re)[0];
  var qa = re[Object.keys(re)[0]];
  model.get({psid: _psid},(x)=>{
    if (x.locale == 'vi_VN') {
      bot.say(_psid,'Bạn đã nhận được 30 TEN cho nhiệm vụ Like Fanpage')
    } else {
      bot.say(_psid,'You have received 30 TEN for Fanpage Like tasks')
    }
  })
  model.upset({psid: _psid},{fanpage: true});
  model.upinc({psid: _psid},{total: 30});
});
//-------------------------------------------------------------------------------
//TW
app.get('/liketw', (req, res) => {
  var re = req.query;
  console.log(re);
  model.get({psid: re.id},(a)=>{
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
  })
});

app.get('/tw', (req, res) => {
  res.render("mail");
  var re = req.query;
  console.log(re);
  var _psid = Object.keys(re)[0];
  var qa = re[Object.keys(re)[0]];
  model.get({psid: _psid},(x)=>{
    if (x.locale == 'vi_VN') {
      bot.say(_psid,'Bạn đã nhận được 30 TEN cho nhiệm vụ Follow Twitter')
    } else {
      bot.say(_psid,'You have received 30 TEN for Twitter Follow tasks')
    }
  })
  model.upset({psid: _psid},{twitter: true});
  model.upinc({psid: _psid},{total: 30});
});
//-----------------------------------------------------------

/*----------------------------------header----------------------------*/
async function header() {
  await bot.setGetStartedButton("Start");
  await bot.setGreetingText(outbox.GreetingText);
  await bot.setPersistentMenu(outbox.PersistentMenu);
}
header();
/*----------------------------------postback--------------------------*/
//Bat Dau
bot.on('postback:Start', (payload, chat) => {
  var isref = payload.postback.referral;
  chat.getUserProfile()
  .then((user)=>{ 
    //Gui loi chao bat dau theo ngon ngu
    if (user.locale == 'vi_VN') {chat.say(card.card_1_vi);} //The Tieng Viet
    else {chat.say(card.card_1);} //The Tieng ANh
  })
  .then(()=>{
    chat.getUserProfile()
    .then((user)=>{
      var email_link = sha256(user.id + 'Tulpo.vn');
      var name = user.first_name + ' ' + user.last_name;
      //check có ref hay ko
      if (typeof isref === "undefined") {
        isref = 'None';
      } else {
        isref = isref.ref;
        //Cong so luong ref cho ng phia tren
        model.upinc({psid: isref},{refnumber: 1});  
      }
      //set người mới
      model.get({psid: user.id},(res)=>{
        if (res === null) {
          model.set(user.id,name,user.locale,isref,0,email_link,false,false,false,false,'None',0,0);
        } else {
          console.log('Đã tham gia');
        }
      })
      //-----------------
    })
  })
 });

 bot.on('postback:Thuc_Hien_Dieu_Kien',(payload,chat)=>{
   chat.say(card.card_2_vi);
 });
 bot.on('postback:Perform_Conditions',(payload,chat)=>{
  chat.say(card.card_2);
});
//------------------------postback o menu -----------------------
//Check Youtube
bot.on('postback:youtube',(payload,chat)=>{
  chat.say(card.card_3);
});
bot.on('postback:youtube_vi',(payload,chat)=>{
  chat.say(card.card_3_vi);
});
bot.on('postback:Lien_He_Support',(payload,chat)=>{
  chat.say('Vui lòng gửi yêu cầu của bạn đến:')
  .then(()=>{
    chat.say(user.Link_HoTro);
  });
});
bot.on('postback:Contact_Support',(payload,chat)=>{
  chat.say('Please send your request to:')
  .then(()=>{
    chat.say(user.Link_HoTro);
  });
});
bot.on('postback:Bao_Cao_Video',(payload,chat)=>{
  var _psid = payload.sender.id;
  chat.conversation((convo) => {
    const question = `Nhập ID video của bạn:`;
    
    const answer = (payload, convo) => {
      const text = payload.message.text;
      model.get({psid: _psid},(res) =>{
        if (res.youtube != 'None') {
          convo.say(`Bạn đã hoàn thành nhiệm vụ này trước đó`);
        } else {
          tube.check(text,(res) => {
            if (res == true) {
              model.upset({psid: _psid},{youtube: text});
              model.upinc({psid: _psid},{total: 1000});
              convo.say(`Chúc mừng bạn. Video của bạn đạt đủ các tiêu chí của nhiệm vụ Youtube. Bạn đã được cộng 1000 TEN`);
            } else if (res == false) {
              convo.say(`Video chưa đủ điều kiện, vui lòng kiểm tra lại`);
            } else {
              convo.say(`Lỗi ID`);
            }
        });
        }
      })
    };
    convo.ask(question, answer);
  })
});
bot.on('postback:Report_Video',(payload,chat)=>{
  var _psid = payload.sender.id;
  chat.conversation((convo) => {
    const question = `Enter your video ID:`;
    
    const answer = (payload, convo) => {
      const text = payload.message.text;
      model.get({psid: _psid},(res) =>{
        if (res.youtube != 'None') {
          convo.say(`You have completed this task before`);
        } else {
          tube.check(text,(res) => {
            if (res == true) {
              model.upset({psid: _psid},{youtube: text});
              model.upinc({psid: _psid},{total: 1000});
              convo.say(`Congratulation! Your video meets the criteria of Youtube task. You have received 1000 TEN`);
            } else if (res == false) {
              convo.say(`Video is not eligible, please check back`);
            } else {
              convo.say(`Error ID`);
            }
        });
        }
      })
    };
    convo.ask(question, answer);
  })
});
//REF
bot.on('postback:Lien_Ket',(payload,chat)=>{
  var _psid = payload.sender.id;
  var ref = user.Link_Ref + _psid;
  chat.say({
    cards: [
      { title: 'Phần Thưởng 50 TEN', image_url: pic.anh_3, subtitle: '50 TEN/lượt giới thiệu thành công. Hãy tích cực chia sẻ nào!',buttons:[
          { type: "element_share", share_contents: { 
                attachment: { type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{title: "TEN Airdrop Campaign", subtitle: "Tham gia chiến dịch Airdrop của dự án TENTECH để nhận tối thiểu 20$", image_url: pic.anh_0,
                        buttons: [{type: "web_url", url: ref, title: "Tham Gia"}]
                      }]
                  }}}
            }]}
    ]});
})
bot.on('postback:Affiliate',(payload,chat)=>{
  var _psid = payload.sender.id;
  var ref = user.Link_Ref + _psid;
  chat.say({
    cards: [
      { title: '50 TEN Rewards', image_url: pic.anh_3, subtitle: '50 TEN/successful introduction. Let is actively share it!',buttons:[
          { type: "element_share", share_contents: { 
                attachment: { type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{title: "TEN Airdrop Campaign", subtitle: "Join the Airdrop campaign of the TENTECH project to receive a minimum of $20", image_url: pic.anh_0,
                        buttons: [{type: "web_url", url: ref, title: "Join"}]
                      }]
                  }}}
            }]}
    ]});
})
//Check vao nhom
bot.on('postback:Nhap_UserID',(payload,chat)=>{
  var _psid = payload.sender.id;
  var ref = user.Link_Ref + _psid;
  model.get({psid: _psid},(res)=>{
    if (res.group == false) {
      chat.conversation((convo) => {
        const question = `ID Telegram của bạn là:`;
        const answer = (payload, convo) => {
          const text = payload.message.text;
          tele.check(text,(kq)=>{
            if (kq) {
              convo.say('Chuẩn xác!')
              /*
              .then(()=>{
                convo.say('Tiếp tục ngay nào!')})
                */
              .then(()=> {
                const question = `Nhập chính xác địa chỉ email của bạn, sau đó kiểm tra hòm thư để xác nhận:`;
                const answer = (payload, convo) => {
                  const text = payload.message.text;
                    var pre = 'Cảm ơn bạn đã tham gia chiến dịch Airdrop của TEN. Vui lòng xác nhận theo địa chỉ sau: ';
                    var token =pre + user.Link_XacNhan + res.email + '&value=' + _psid  + '&mail=' + text +'&locale=vn' + '&rec=' + res.refof; //Them cau van hay
                    email.send(text,token);
                }
                convo.ask(question, answer); 
              });
            model.upset({psid: _psid},{group: text});
            } else {
              convo.say('Bạn chưa gia nhập cộng đồng hoặc có thể đã nhập sai')
              .then(()=>{
                convo.say('Cố gắng thực hiện lại nhé, rất nhiều phần thưởng đang chờ đón bạn')
                .then(()=>{
                  convo.say(card.card_2_vi)
                })
              })
            }
          })
        }
        convo.ask(question, answer);
      })
    } else {
      chat.say('Bạn đã là thành viên của TEN')
      .then(()=>{
        chat.say('Cùng nhau chia sẻ thật nhiều nhé!')
        .then(()=>{
          chat.say({
            cards: [
              { title: 'Phần Thưởng 50 TEN', image_url: pic.anh_3, subtitle: '50 TEN/lượt giới thiệu thành công. Hãy tích cực chia sẻ nào!',buttons:[
                  { type: "element_share", share_contents: { 
                        attachment: { type: "template",
                          payload: {
                            template_type: "generic",
                            elements: [{title: "TEN Airdrop Campaign", subtitle: "Tham gia chiến dịch Airdrop của dự án TENTECH để nhận tối thiểu 20$", image_url: pic.anh_0,
                                buttons: [{type: "web_url", url: ref, title: "Tham Gia"}]
                              }]
                          }}}
                    }]}
            ]})
        })
      })
    }
  })
})
//--------------------------------------------------------------------------------------------------------------
bot.on('postback:Enter_UserID',(payload,chat)=>{
  var _psid = payload.sender.id;
  var ref = user.Link_Ref + _psid;
  model.get({psid: _psid},(res)=>{
    if (res == false) {
      chat.conversation((convo) => {
        const question = `Your Telegram ID is:`;
        const answer = (payload, convo) => {
          const text = payload.message.text;
          tele.check(text,(kq)=>{
            if (kq) {
              convo.say('Exactly!')
              /*
              .then(()=>{
                convo.say('Continue now!')})
                */
              .then(()=>{
                const question = `Enter your email address correctly, then check your inbox to confirm:`;
                const answer = (payload, convo) => {
                  const text = payload.message.text;
                  var pre = 'Thank you for taking part in TEN\'s Airdrop campaign. Please confirm at the following address: ';
                    var token =pre + user.Link_XacNhan + res.email + '&value=' + _psid + '&mail=' + text + '&locale=us' + '&rec=' + res.refof; //Them cau van hay
                    email.send(text,token);
                }
                convo.ask(question, answer);
              });
            model.upset({psid: _psid},{group: text});
            } else {
              convo.say('You have not joined the community or may have entered it incorrectly')
              .then(()=>{
                convo.say('Try to do it again, lots of rewards await you')
                .then(()=>{
                  convo.say(card.card_2)
                })
              })
            }
          })
        }
        convo.ask(question, answer);
      })
    } else {
      chat.say('You are a member of TEN')
      .then(()=>{
        chat.say('Let is share a lot!')
        .then(()=>{
          chat.say({
            cards: [
              { title: '50 TEN Rewards', image_url: pic.anh_3, subtitle: '50 TEN/successful introduction. Let is actively share it!',buttons:[
                  { type: "element_share", share_contents: { 
                        attachment: { type: "template",
                          payload: {
                            template_type: "generic",
                            elements: [{title: "TEN Airdrop Campaign", subtitle: "Join the Airdrop campaign of the TENTECH project to receive a minimum of $20", image_url: pic.anh_0,
                                buttons: [{type: "web_url", url: ref, title: "Join"}]
                              }]
                          }}}
                    }]}
            ]})
        })
      })
    }
  })
})
//Check App
bot.on('postback:Da_Dang_Ki',(payload,chat)=>{
  console.log('Da Bam Vao');
  var _psid = payload.sender.id;
  var ref = user.Link_Ref + _psid;
  model.get({psid: _psid},(x)=>{
    if (x.app == false) {
      chat.conversation((convo) => {
        const question = `Nhập Email bạn đã dùng để đăng kí tài khoản trên App:`;
        const answer = (payload, convo) => {
          const text = payload.message.text;
          ten.check(text,(res)=>{
            if (res) {
              convo.say('Chúc mừng bạn đã hoàn thành tất cả các nhiệm vụ điều kiện. Phần thưởng 200 TEN đã được cộng vào tài khoản')
              .then(()=>{
                convo.say('Rất nhiều phần thưởng còn ở phía sau, xem menu để chọn nhiệm vụ bạn muốn thực hiện')
                .then(()=>{
                  convo.say('TEN sẽ được IEO trên Labs vào ngày 28 tháng 4 năm 2019. Hãy tích lũy nhiều TEN hơn nào!')
                  .then(()=>{
                    convo.say({
                      cards: [
                        { title: 'Phần Thưởng 50 TEN', image_url: pic.anh_3, subtitle: '50 TEN/lượt giới thiệu thành công. Hãy tích cực chia sẻ nào!',buttons:[
                            { type: "element_share", share_contents: { 
                                  attachment: { type: "template",
                                    payload: {
                                      template_type: "generic",
                                      elements: [{title: "TEN Airdrop Campaign", subtitle: "Tham gia chiến dịch Airdrop của dự án TENTECH để nhận tối thiểu 20$", image_url: pic.anh_0,
                                          buttons: [{type: "web_url", url: ref, title: "Tham Gia"}]
                                        }]
                                    }}}
                              }]}
                      ]}); //thẻ chia sẻ
                  })
                })
              })
              model.upinc({psid: _psid},{total: 200});
              model.upset({psid: _psid},{app: text})
            } else {
              convo.say('Bạn chưa mở tài khoản trên App hoặc Email của bạn không chính xác!')
              .then(()=>{
                convo.say('Đăng kí App hoặc nhập lại Email')
                .then(()=>{
                  convo.say(card.card_4_vi)
                })
              })
            }
          });
        }
        convo.ask(question, answer);
      })
    } else {
      chat.say('Bạn đã hoàn thành nhiệm vụ điều kiện từ trước đó')
      .then(()=>{
        chat.say('Để nhận được nhiều TEN hơn, chia sẻ và chia sẻ')
        .then(()=>{
          chat.say({
            cards: [
              { title: 'Phần Thưởng 50 TEN', image_url: pic.anh_3, subtitle: '50 TEN/lượt giới thiệu thành công. Hãy tích cực chia sẻ nào!',buttons:[
                  { type: "element_share", share_contents: { 
                        attachment: { type: "template",
                          payload: {
                            template_type: "generic",
                            elements: [{title: "TEN Airdrop Campaign", subtitle: "Tham gia chiến dịch Airdrop của dự án TENTECH để nhận tối thiểu 20$", image_url: pic.anh_0,
                                buttons: [{type: "web_url", url: ref, title: "Tham Gia"}]
                              }]
                          }}}
                    }]}
            ]});//ther chia se
        })
      })
    }
  })
})
//-----------------------------------------------------------
bot.on('postback:Registered',(payload,chat)=>{
  var _psid = payload.sender.id;
  var ref = user.Link_Ref + _psid;
  model.get({psid: _psid},(x)=>{
    if (x.app == false) {
      chat.conversation((convo) => {
        const question = `Enter the email you used to register your account on the App:`;
        const answer = (payload, convo) => {
          const text = payload.message.text;
          ten.check(text,(res)=>{
            if (res) {
              convo.say('Congratulations on completing all the conditions. The reward of 200 TEN has been added to the account')
              .then(()=>{
                convo.say('A lot of rewards are still behind, see the menu to choose the task you want to perform')
                .then(()=>{
                  convo.say('TEN will be on IEO on Labs on April 28, 2019. Please accumulate more TEN!')
                  .then(()=>{
                    convo.say({
                      cards: [
                        { title: '50 TEN Rewards', image_url: pic.anh_3, subtitle: '50 TEN/successful introduction. Let is actively share it!',buttons:[
                            { type: "element_share", share_contents: { 
                                  attachment: { type: "template",
                                    payload: {
                                      template_type: "generic",
                                      elements: [{title: "TEN Airdrop Campaign", subtitle: "Join the Airdrop campaign of the TENTECH project to receive a minimum of $20", image_url: pic.anh_0,
                                          buttons: [{type: "web_url", url: ref, title: "Join"}]
                                        }]
                                    }}}
                              }]}
                      ]}); //thẻ chia sẻ
                  })
                })
              })
              model.upinc({psid: _psid},{total: 200});
              model.upset({psid: _psid},{app: text})
            } else {
              convo.say('You have not opened an account on your App or Email is incorrect!')
              .then(()=>{
                convo.say('Register App or re-enter Email')
                .then(()=>{
                  convo.say(card.card_4)
                })
              })
            }
          });
        }
        convo.ask(question, answer);
      })
    } else {
      chat.say('You have completed the condition task from before')
      .then(()=>{
        chat.say('To get more TEN, share and share')
        .then(()=>{
          chat.say({
            cards: [
              { title: '50 TEN Rewards', image_url: pic.anh_3, subtitle: '50 TEN/successful introduction. Let is actively share it!',buttons:[
                  { type: "element_share", share_contents: { 
                        attachment: { type: "template",
                          payload: {
                            template_type: "generic",
                            elements: [{title: "TEN Airdrop Campaign", subtitle: "Join the Airdrop campaign of the TENTECH project to receive a minimum of $20", image_url: pic.anh_0,
                                buttons: [{type: "web_url", url: ref, title: "Join"}]
                              }]
                          }}}
                    }]}
            ]});//ther chia se
        })
      }) 
    }
  }) 
})
//Ví
bot.on('postback:So_Du',(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnk = user.Link_Vi + _psid;
  chat.say({
    text: 'Ví Airdrop của bạn',
    buttons: [{ type: 'web_url', title: 'Kiểm Tra', url: _lnk, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnk}]
  });
})
bot.on('postback:My_Wallet',(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnk = user.Link_Vi + _psid;
  chat.say({
    text: 'Your Airdrop wallet',
    buttons: [{ type: 'web_url', title: 'Check', url: _lnk, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnk}]
  });
})
//Like
bot.on('postback:Like_Vi',(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnkfb = user.Link_Likefb + _psid;
  var _lnktw = user.Link_Liketw + _psid;
  model.get({psid:_psid},(x)=>{
    if ((x.fanpage == false) || (x.twitter == false)) {
      chat.say({
        text: 'Nhiệm vụ Like + Follow',
        buttons: 
        [
          { type: 'web_url', title: 'Fanpage', url: _lnkfb, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnkfb},
          { type: 'web_url', title: 'Twitter', url: _lnktw, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnktw},
        ]
      });
    } else {
      chat.say('Nhiệm vụ đã hoàn thành trước đó');
    }
  })
})
bot.on('postback:Like',(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnkfb = user.Link_Likefb + _psid;
  var _lnktw = user.Link_Liketw + _psid;
  model.get({psid:_psid},(x)=>{
    if ((x.fanpage == false) || (x.twitter == false)) {
      chat.say({
        text: 'Mission Like + Follow',
        buttons: 
        [
          { type: 'web_url', title: 'Fanpage', url: _lnkfb, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnkfb},
          { type: 'web_url', title: 'Twitter', url: _lnktw, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnktw},
        ]
      });
    } else {
      chat.say('The task has been completed before');
    }
  })
})
//FAQ
bot.on('postback:Hoi_Dap',(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnk = user.Link_Faq + _psid;
  model.get({psid:_psid},(x)=>{
    if (x.faq == 0) {
      var _lnk = user.Link_Faq + _psid;
      chat.say({
        text: 'Nhiệm vụ khảo nghiệm',
        buttons: [{ type: 'web_url', title: 'Bắt Đầu', url: _lnk, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnk}]
      });
    } else {
      chat.say('Nhiệm vụ đã hoàn thành trước đó');
    }
  })
})
bot.on('postback:FAQ',(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnk = user.Link_Faq + _psid;
  model.get({psid:_psid},(x)=>{
    if (x.faq == 0) {
      chat.say({
        text: 'Q&A Tasks',
        buttons: [{ type: 'web_url', title: 'Start', url: _lnk, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnk}]
      });
    } else {
      chat.say('The task has been completed before');
    }
  })
})
//App
bot.on('postback:App_Education',(payload,chat)=>{
  chat.say(card.card_5);
})
//Buy
bot.on('postback:Mua_Token',(payload,chat)=>{
  var _psid = payload.sender.id;
  chat.conversation((convo) => {
    const question = 'Chuyển ETH vào địa chỉ: ' + user.Eth_Adress + ' . Đợi đủ 15 xác nhận sau đó nhập mã giao dịch(TX) của bạn:';
    const answer = (payload, convo) => {
      const text = payload.message.text;
      model.getbuy({tx: text},(x)=>{
        if (x == null) {
          eth.check(text,(y)=>{
            if (y == 0) {
              convo.say('Giao dịch chưa hợp lệ, vui lòng thực hiện lại sau');
            } else 
            if (y == -1) {
              convo.say('Giao dịch chưa được kiểm tra, vui lòng thực hiện lại sau');
            } else {
              var receive = y* user.Rate;
              convo.say('Bạn đã thực hiện giao dịch thành công. '+ receive + ' TEN đã được cộng vào tài khoản của bạn');
              model.setbuy(text);
              model.upinc({psid: _psid},{total: receive});
            }
          })
        } else {
          convo.say('Giao dịch đã tồn tại trên hệ thống!');
        }
      })
    }
    convo.ask(question, answer);
  })
})
//-----------------------------------
bot.on('postback:Buy_Token',(payload,chat)=>{
  var _psid = payload.sender.id;
  chat.conversation((convo) => {
    const question = 'Transfer ETH to address: '+ user.Eth_Adress + ' . Wait for 15 validations then enter your transaction code(TX):';
    const answer = (payload, convo) => {
      const text = payload.message.text;
      model.getbuy({tx: text},(x)=>{
        if (x == null) {
          eth.check(text,(y)=>{
            if (y == 0) {
              convo.say('The transaction is not valid, please do it again later');
            } else 
            if (y == -1) {
              convo.say('The transaction has not been checked, please try again later');
            } else {
              var receive = y* user.Rate;
              convo.say('You have made a successful transaction. '+ receive + ' TEN has been added to your account');
              model.setbuy(text);
              model.upinc({psid: _psid},{total: receive});
            }
          })
        } else {
          convo.say('The transaction already exists on the system!');
        }
      })
    }
    convo.ask(question, answer);
  })
})
//Nhan Token
bot.on('postback:Nhan_Token',(payload,chat)=>{
  chat.say('Trả thưởng sẽ bắt đầu sau ngày: 14/06/2019')
})
bot.on('postback:Recieve_Token',(payload,chat)=>{
  chat.say('Rewards will begin after: 06/14/2019')
})
//------------------------------------------------------------------------------------------------
//Phan chat = tay
bot.hear('hello',(payload,chat)=>{
  chat.say('i love you');
})
bot.hear('chao',(payload,chat)=>{
  chat.say('toi yeu ban');
})
bot.hear('tam biet',(payload,chat)=>{
  chat.say('hen gap lai');
})
//-------------------------------------------------------------------------------------------------
bot.hear([/mua/],(payload,chat)=>{
  var _psid = payload.sender.id;
  chat.conversation((convo) => {
    const question = 'Chuyển ETH vào địa chỉ: ' + user.Eth_Adress + ' . Đợi đủ 15 xác nhận sau đó nhập mã giao dịch(TX) của bạn:';
    const answer = (payload, convo) => {
      const text = payload.message.text;
      model.getbuy({tx: text},(x)=>{
        if (x == null) {
          eth.check(text,(y)=>{
            if (y == 0) {
              convo.say('Giao dịch chưa hợp lệ, vui lòng thực hiện lại sau');
            } else 
            if (y == -1) {
              convo.say('Giao dịch chưa được kiểm tra, vui lòng thực hiện lại sau');
            } else {
              var receive = y* user.Rate;
              convo.say('Bạn đã thực hiện giao dịch thành công. '+ receive + ' TEN đã được cộng vào tài khoản của bạn');
              model.setbuy(text);
              model.upinc({psid: _psid},{total: receive});
            }
          })
        } else {
          convo.say('Giao dịch đã tồn tại trên hệ thống!');
        }
      })
    }
    convo.ask(question, answer);
  })
})
bot.hear([/buy/],(payload,chat)=>{
  var _psid = payload.sender.id;
  chat.conversation((convo) => {
    const question = 'Transfer ETH to address: '+ user.Eth_Adress + ' . Wait for 15 validations then enter your transaction code(TX):';
    const answer = (payload, convo) => {
      const text = payload.message.text;
      model.getbuy({tx: text},(x)=>{
        if (x == null) {
          eth.check(text,(y)=>{
            if (y == 0) {
              convo.say('The transaction is not valid, please do it again later');
            } else 
            if (y == -1) {
              convo.say('The transaction has not been checked, please try again later');
            } else {
              var receive = y* user.Rate;
              convo.say('You have made a successful transaction. '+ receive + ' TEN has been added to your account');
              model.setbuy(text);
              model.upinc({psid: _psid},{total: receive});
            }
          })
        } else {
          convo.say('The transaction already exists on the system!');
        }
      })
    }
    convo.ask(question, answer);
  })
})
bot.hear([/ví/,/tài khoản/,/số dư/,/kiểm tra/],(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnk = user.Link_Vi + _psid;
  chat.say({
    text: 'Ví Airdrop của bạn',
    buttons: [{ type: 'web_url', title: 'Kiểm Tra', url: _lnk, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnk}]
  });
})
bot.hear([/balance/,/wallet/],(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnk = user.Link_Vi + _psid;
  chat.say({
    text: 'Your Airdrop wallet',
    buttons: [{ type: 'web_url', title: 'Check', url: _lnk, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnk}]
  });
})
bot.hear([/theo dõi/,/thích/],(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnkfb = user.Link_Likefb + _psid;
  var _lnktw = user.Link_Liketw + _psid;
  model.get({psid:_psid},(x)=>{
    if ((x.fanpage == false) || (x.twitter == false)) {
      chat.say({
        text: 'Nhiệm vụ Like + Follow',
        buttons: 
        [
          { type: 'web_url', title: 'Fanpage', url: _lnkfb, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnkfb},
          { type: 'web_url', title: 'Twitter', url: _lnktw, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnktw},
        ]
      });
    } else {
      chat.say('Nhiệm vụ đã hoàn thành trước đó');
    }
  })
})
bot.hear([/like/,/facebook/,/twitter/,/follow/],(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnkfb = user.Link_Likefb + _psid;
  var _lnktw = user.Link_Liketw + _psid;
  model.get({psid:_psid},(x)=>{
    if ((x.fanpage == false) || (x.twitter == false)) {
      chat.say({
        text: 'Mission Like + Follow',
        buttons: 
        [
          { type: 'web_url', title: 'Fanpage', url: _lnkfb, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnkfb},
          { type: 'web_url', title: 'Twitter', url: _lnktw, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnktw},
        ]
      });
    } else {
      chat.say('The task has been completed before');
    }
  })
})
bot.hear([/chia sẻ/],(payload,chat)=>{
  var _psid = payload.sender.id;
  var ref = user.Link_Ref + _psid;
  chat.say({
    cards: [
      { title: 'Phần Thưởng 50 TEN', image_url: pic.anh_3, subtitle: '50 TEN/lượt giới thiệu thành công. Hãy tích cực chia sẻ nào!',buttons:[
          { type: "element_share", share_contents: { 
                attachment: { type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{title: "TEN Airdrop Campaign", subtitle: "Tham gia chiến dịch Airdrop của dự án TENTECH để nhận tối thiểu 20$", image_url: pic.anh_0,
                        buttons: [{type: "web_url", url: ref, title: "Tham Gia"}]
                      }]
                  }}}
            }]}
    ]});
})
bot.hear([/share/],(payload,chat)=>{
  var _psid = payload.sender.id;
  var ref = user.Link_Ref + _psid;
  chat.say({
    cards: [
      { title: '50 TEN Rewards', image_url: pic.anh_3, subtitle: '50 TEN/successful introduction. Let is actively share it!',buttons:[
          { type: "element_share", share_contents: { 
                attachment: { type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{title: "TEN Airdrop Campaign", subtitle: "Join the Airdrop campaign of the TENTECH project to receive a minimum of $20", image_url: pic.anh_0,
                        buttons: [{type: "web_url", url: ref, title: "Join"}]
                      }]
                  }}}
            }]}
    ]});
})
bot.hear([/hỏi đáp/],(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnk = user.Link_Faq + _psid;
  model.get({psid:_psid},(x)=>{
    if (x.faq == 0) {
      var _lnk = user.Link_Faq + _psid;
      chat.say({
        text: 'Nhiệm vụ khảo nghiệm',
        buttons: [{ type: 'web_url', title: 'Bắt Đầu', url: _lnk, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnk}]
      });
    } else {
      chat.say('Nhiệm vụ đã hoàn thành trước đó');
    }
  })
})
bot.hear([/faq/],(payload,chat)=>{
  var _psid = payload.sender.id;
  var _lnk = user.Link_Faq + _psid;
  model.get({psid:_psid},(x)=>{
    if (x.faq == 0) {
      chat.say({
        text: 'Q&A Tasks',
        buttons: [{ type: 'web_url', title: 'Start', url: _lnk, webview_height_ratio: 'full', messenger_extensions: 'true',fallback_url: _lnk}]
      });
    } else {
      chat.say('The task has been completed before');
    }
  })
})
bot.hear([/báo cáo/],(payload,chat)=>{
  chat.say(card.card_3);
})
bot.hear([/video/,/youtube/,/report/],(payload,chat)=>{
  chat.say(card.card_3_vi);
})
bot.hear([/điều kiện/,/gì/,/thế nào/,/luật/],(payload,chat)=>{
  chat.say(card.card_6_vi);
})
bot.hear([/condition/,/role/,/how/],(payload,chat)=>{
  chat.say(card.card_6);
})
bot.hear([/app/],(payload,chat)=>{
  chat.say(card.card_5);
})
bot.hear([/ref/,/link/,/link ref/,/copy/,/link giới thiệu/,/cần link/,/link của tôi/],(payload,chat)=>{
  var _psid = payload.sender.id;
  var ref = user.Link_Ref + _psid;
  chat.say(ref);
})
bot.hear(['haivi'],(payload,chat)=>{
  var _psid = payload.sender.id;
  chat.conversation((convo) => {
    const question = 'Ngài muốn truyền đạt điều gì ạ? Xin hãy nói:';
    const answer = (payload, convo) => {
      const text = payload.message.text;
      convo.say('Lệnh của chủ nhân đã được ban bố ^^');
      model.getall({locale: 'vi_VN'},(x)=>{
        var i=0;
        var n = x.length;
        for (i = 0;i < n; i++) {
          if (x[i].psid != _psid) {bot.say(x[i].psid,text);}
        }
      })
    }
    convo.ask(question, answer);
  })
})
bot.hear(['haien'],(payload,chat)=>{
  var _psid = payload.sender.id;
  chat.conversation((convo) => {
    const question = 'Ngài muốn truyền đạt điều gì ạ? Xin hãy nói:';
    const answer = (payload, convo) => {
      const text = payload.message.text;
      convo.say('Lệnh của chủ nhân đã được ban bố ^^');
      model.getall({locale: 'en_US'},(x)=>{
        var i=0;
        var n = x.length;
        for (i = 0;i < n; i++) {
          if (x[i].psid != _psid) {bot.say(x[i].psid,text);}
        }
      })
    }
    convo.ask(question, answer);
  })
})
/*-------------------------------------end----------------------------*/
bot.start(process.env.PORT);
