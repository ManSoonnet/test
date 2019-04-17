const user = require('../user/user');
const request = require('request');
module.exports = {
check: (id,callback) => {
    request({
        method: 'GET',
        uri: 'https://www.googleapis.com/youtube/v3/videos',
        qs: {
            id: id,
            key: 'AIzaSyA4hDuqj4BZoqW1qyBP6tchXjD9GYIBats',
            part: 'snippet,statistics',
            fields: 'items(snippet/title,snippet/description,statistics)'
        },
        json: true
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var s = body.items;
            if ((s[0].statistics.viewCount >= user.Luong_View) && ((s[0].snippet.title).indexOf(user.Tieu_De_Video) != -1 ) &&
                ((s[0].snippet.description).indexOf(user.Mo_Ta_Video) != -1)) {
                    callback(true); 
                } else {
                    callback(false);
                }
        } else {
            callback('err');
        }
    });
 }
}