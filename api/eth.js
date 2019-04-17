const request = require('request');
const user = require('../user/user');
module.exports = {
check: (tx,call) => {
    request({
        method: 'GET',
        uri: 'https://api.blockcypher.com/v1/eth/main/txs/' + tx,
        json: true
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if ((('0x' + body.addresses[1]) == user.Eth_Adress) && (body.confirmations >= 15) && (body.double_spend == false)) {
                var x = body.total / 10**18;
                var n = parseFloat(x);
                x = Math.round(n * 1000)/1000;
                call(x);
            } else {
                call(0);
            }          
        } else {
            call(-1);
        }
    });
 }
}
function price(){
    request({
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/latest',
        headers: {
            'X-CMC_PRO_API_KEY': 'eaca1ea3-9ad1-4352-8612-b611aee70b14'
          },
        qs: {
            symbol: "ETH",
            convert: "USD"
        },
        json: true,
        //gzip: true
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //
        } else {//
        }
    });
}
//check('0x8f39fb4940c084460da00a876a521ef2ba84ad6ea8d2f5628c9f1f8aeb395342',(x)=>{console.log(x);});