'use strict';
const user = require('../user/user');
const make = require('../make');
//*************************Menu***********************************
//Menu Tang 2
const menu_1_1_vi =  new make("web_url",user.Link_DieuKien,"Điều Kiện","full","false");//
const menu_1_1 =  new make("web_url",user.Link_DieuKien,"Condition","full","false");//
const menu_1_2_vi =  new make("postback","Like","Like_Vi");
const menu_1_2 =  new make("postback","Like","Like");
const menu_1_3_vi =  new make("postback","Liên Kết","Lien_Ket");
const menu_1_3 =  new make("postback","Affiliate","Affiliate");
const menu_1_4_vi =  new make("postback","Hỏi Đáp","Hoi_Dap");
const menu_1_4 =  new make("postback","FAQ","FAQ");
const menu_1_5_vi =  new make("postback","Youtube","youtube_vi");
const menu_1_5 =  new make("postback","Youtube","youtube");

const menu_2_1_vi =  new make("postback","Số Dư","So_Du");
const menu_2_1 =  new make("postback","My Wallet","My_Wallet");
const menu_2_2_vi =  new make("postback","Mua Token","Mua_Token");
const menu_2_2 =  new make("postback","Buy Token","Buy_Token");
const menu_2_3_vi =  new make("postback","Nhận Token","Nhan_Token");
const menu_2_3 =  new make("postback","Recieve Token","Recieve_Token");

const menu_3_1_vi =  new make("web_url",user.Link_CongDong,"Cộng Đồng","full","false");
const menu_3_1 =  new make("web_url",user.Link_CongDong,"Community","full","false");
const menu_3_2 =  new make("postback","App Education","App_Education");
const menu_3_3_vi =  new make("web_url",user.Link_TrangChu,"Website","full","false");
const menu_3_3 =  new make("web_url",user.Link_TrangChu,"Website","full","false");
const menu_3_4_vi =  new make("web_url",user.Link_GiayTrang,"Giấy Trắng","full","false");
const menu_3_4 =  new make("web_url",user.Link_GiayTrang,"White Page","full","false");
const menu_3_5_vi =  new make("web_url",user.Link_Token,"Token TEN","full","false");
const menu_3_5 =  new make("web_url",user.Link_Token,"Token TEN","full","false");

//Menu Tang 1
module.exports = {
    menu_1_vi :  new make("nested",[menu_1_1_vi,menu_1_2_vi,menu_1_3_vi,menu_1_4_vi,menu_1_5_vi],"Nhiệm Vụ"),
    menu_1 :  new make("nested",[menu_1_1,menu_1_2,menu_1_3,menu_1_4,menu_1_5],"Mission"),
    menu_2_vi :  new make("nested",[menu_2_1_vi,menu_2_2_vi,menu_2_3_vi],"Tài Khoản"),
    menu_2 :  new make("nested",[menu_2_1,menu_2_2,menu_2_3],"Account"),
    menu_3_vi :  new make("nested",[menu_3_1_vi,menu_3_2,menu_3_3_vi,menu_3_4_vi,menu_3_5_vi],"Về Chúng Tôi"),
    menu_3 :  new make("nested",[menu_3_1,menu_3_2,menu_3_3,menu_3_4,menu_3_5],"About Us"),
    menu_3_2_1 : new make("web_url",user.Link_IOS,"IOS","full","false"),
    menu_3_2_2 : new make("web_url",user.Link_Android,"ANDROID","full","false"),
    menu_1_1_vi : new make("web_url",user.Link_DieuKien,"Điều Kiện","full","false"),//
    menu_1_1 : new make("web_url",user.Link_DieuKien,"Condition","full","false")//
}