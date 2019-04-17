'use strict';
const user = require('../user/user');
const pic = require('../user/pic');
const make = require('../make');
module.exports = {
    //Mau Chung 1
    button_1_vi: new make('web_url',user.Link_DieuKien,'Xem Chiến Dịch','full','true'),
    button_1: new make('web_url',user.Link_DieuKien,'View Campaign','full','true'),
    button_2_vi: new make('postback','Thực Hiện Điều Kiện',"Thuc_Hien_Dieu_Kien"),
    button_2: new make('postback','Perform Conditions',"Perform_Conditions"),
    //Mau Nut 2
    button_3_vi: new make('web_url',user.Link_Telegram,'Tham Gia','full','false'),
    button_3: new make('web_url',user.Link_Telegram,'Join','full','false'),
    button_4_vi: new make('postback','Nhập UserID',"Nhap_UserID"),
    button_4: new make('postback',"Enter UserID","Enter_UserID"),
    //Mau Chung Youtube --> Menu
    button_5_vi: new make('postback',"Báo Cáo Video","Bao_Cao_Video"),
    button_5: new make('postback',"Report Video","Report_Video"),
    button_6_vi: new make('postback',"Liên Hệ Support","Lien_He_Support"),
    button_6: new make('postback',"Contact Support","Contact_Support"),
    button_7_vi: new make("web_url",user.Link_Vi,"Xem Tài Khoản","full","true"),
    button_7: new make("web_url",user.Link_Vi,"My Account","full","true"),
    //Mau chung chia se
    button_8_vi: new make("web_url","https://t.me/userinfobot","Lấy UserID","full","false"),
    button_8: new make("web_url","https://t.me/userinfobot","Get UserID","full","false"),
    //App
    button_9_vi: new make('postback',"Đã Đăng Kí","Da_Dang_Ki"),
    button_9: new make('postback',"Registered","Registered"),
}