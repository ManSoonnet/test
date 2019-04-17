class Make {
    constructor(arg0, arg1, arg2, arg3, arg4) {
        //Nut Long menu
        if (arg0 == "nested") {
            this.type = arg0;
            this.call_to_actions = arg1; //Mảng đối tượng nút 
            this.title = arg2; //Tiêu đề nút
        }
        //đối tượng Nut Postback
        if (arg0 == "postback") {
            this.type = arg0; 
            this.title = arg1; //Tiêu đều nút
            this.payload = arg2; //Giá trị trả về
        }
        //đối tượng Nut web Link
        if (arg0 == "web_url") {
            this.type = arg0;
            this.url = arg1; //Limk webview
            this.title = arg2; //Tiêu đề nút 
            this.webview_height_ratio = arg3; //độ cao webview
            this.messenger_extensions = arg4; //có webview hay ko [true|false]
            if (this.messenger_extensions =="true") {this.fallback_url = arg1;}
        }
        if (arg0 == "sweb_url") {
            this.type = arg0;
            this.url = arg1; //Limk webview
            this.title = arg2; //Tiêu đề nút 
        }

        //đối tượng Nut goi
        if (arg0 == "phone_number") {
            this.type = arg0;
            this.payload = arg1; //Số điện thoại  
            this.title = arg2; //Chữ ở trên 
        }
        //đối tượng Nut Quick rep
        if (arg0 == "Replies") {
            this.contentarg0 = "text";
            this.title = arg1; //Chữ trong reply
            this.payload = arg1; //Giá trị trả về
            this.image_url = arg2; //Link ảnh trong nút reply [nếu cần] | có thể bỏ đi nếu không cần 
        }
        //đối tượng Mau Chung
        if (arg0 == "image_url") {
            this.image_url = arg1; //Link ảnh cho mẫu
            this.title = arg2; //text Tiêu đề
            this.subtitle = arg3; //text Mô tả
            this.buttons = arg4; //Mảng đối tượng nút
        }
        //Mau Nut
        if (arg0 == "buttons") {
            this.buttons = arg1; //mảng đối tượng nút
            this.text = arg2; //Tiêu đề text phía trên
        }
        //Mau quick repl
        if (arg0 == "quickReplies") {
            this.quickReplies = arg1; //Mảng đối tượng repli
            this.text = arg2; //text ở trên 
        }
        //Mau chung xoay vong
        if (arg0 == "card") {
            this.cards = arg1; //Mảng đối tượng mẫu chung
        }
        if (arg0 == "elements") {
            this.elements = arg1; //Mảng đối tượng mẫu chung
        }
        //Mau List
        if (arg0 == "list") {
            this.elements = arg1;  //mảng đối tượng mẫu
            this.buttons = arg2;  //Mảng đối tượng nút
        }
        //Nut Share 
        if (arg0 == "share"){
            this.share = {
                "type": "element_share",
                "share_contents": { 
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "templatearg0": "generic",
                            "elements": arg1, //mảng đối tượng mẫu chung
                        }
                    }
                }
            };
        }
        //Gui file
        if (arg0 == 'video' || arg0 == 'audio' || arg0 == 'image' || arg0 == 'file') {
            this.attachment = arg0;
            this.url = arg1;
        }
        //Mau phương tiện custom
        if (arg0 =='media') {
            this.payload = {
                "template_type": arg0,
                "elements": [
                    {
                        "media_type": arg1, //"<image|video>"
                        "attachment_id": arg2, //<FACEBOOK_URL>
                        "buttons": arg3, //mảng đối tượng nút | có thể bỏ đi nếu ko cần nút
                    }
                ]
            };
        }
    }
}
module.exports = Make;

/*
Cach Tao Nut Share
var nut = new Make('postback','Share di');
var mau = new Make('image_url','https','cai nay la mau','nut ne',[nut]);
var share = new Make('share',[mau]).share;
 */
