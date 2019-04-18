'use strict';
const render = require('./render');
module.exports = {
    GreetingText: 
    [
        {"locale":"default", "text":"Welcome  to TEN Airdrop Program- Decentralized Online Education"},
        {"locale":"en_US", "text":"Welcome  to TEN Airdrop Program- Decentralized Online Education"},
        {"locale":"vi_VN", "text":"Chào mừng đến với chương trình Airdrop của TEN- Giáo dục trực tuyến phi tập trung"},
    ],
    PersistentMenu:
    [
        {"locale":"default", "composer_input_disabled": false, "call_to_actions":[render.menu_1,render.menu_2,render.menu_3]},
        {"locale":"en_US", "composer_input_disabled": false, "call_to_actions":[render.menu_1,render.menu_2,render.menu_3]},
        {"locale":"vi_VN", "composer_input_disabled": false, "call_to_actions":[render.menu_1_vi,render.menu_2_vi,render.menu_3_vi]},
    ]
};