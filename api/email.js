const config = require('../config');
const user = require('../user/user');
module.exports = {
send: (mail,text,html) => {
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user.Email,
    pass: config.PASS_MAIL
  }
});

var mailOptions = {
  from: user.Email,
  to: mail,
  subject: 'Sending Email',
  text: text,
  html: html,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}}
//send('henryskyway@gmail.com','dcm anh');