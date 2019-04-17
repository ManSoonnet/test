'Receive 200 Token TEN when completing the first 3 conditions to start the campaign'
'Nhận 200 Token TEN khi hoàn thành 3 điều kiện đầu tiên để bắt đầu chiến dịch'
const make = require('../make');
const button = require('./button');
const pic = require('../user/pic');
const render = require('../outbox/render');
const image_url_1_vi = new make('image_url',pic.anh_1,'Điều Kiện Tham Gia','Nhận 200 Token TEN khi hoàn thành 3 điều kiện đầu tiên để bắt đầu chiến dịch',[button.button_1_vi,button.button_2_vi]);
const image_url_1 = new make('image_url',pic.anh_1,'Conditions of Participation','Receive 200 Token TEN when completing the first 3 conditions to start the campaign',[button.button_1,button.button_2]);
const image_url_2_vi = new make('image_url',pic.anh_2,'Phần Thưởng 1000 TEN','Thực hiện video review về TenTech theo yêu cầu',[button.button_5_vi,button.button_6_vi,button.button_7_vi]);
const image_url_2 = new make('image_url',pic.anh_2,'Rewards 1000 TEN','Make a review video of TenTech as required',[button.button_5,button.button_6,button.button_7]);
module.exports = {
    card_1_vi: new make('card',[image_url_1_vi]),
    card_1: new make('card',[image_url_1]),
    card_2_vi: new make('buttons',[button.button_3_vi,button.button_8_vi,button.button_4_vi],"Click để tham gia nhóm Telegram của chúng tôi"),
    card_2: new make('buttons',[button.button_3,button.button_8,button.button_4],"Click to join our Telegram group"),
    card_3_vi: new make('card',[image_url_2_vi]),
    card_3: new make('card',[image_url_2]),
    //App
    card_4_vi: new make('buttons',[render.menu_3_2_2,render.menu_3_2_1,button.button_9_vi],"Đăng kí TEN App ngay thôi. Phần thưởng đang đến gần lắm rồi"),
    card_4: new make('buttons',[render.menu_3_2_2,render.menu_3_2_1,button.button_9],"Sign up for TEN App now. Rewards are coming very close"),
    card_5: new make('buttons',[render.menu_3_2_2,render.menu_3_2_1],"-----> App:"),
    card_6_vi: new make('buttons',[render.menu_1_1_vi],"Điều kiện Airdrop"),
    card_6: new make('buttons',[render.menu_1_1],"Airdrop Role")
}