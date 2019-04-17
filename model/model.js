const conf = require('../config');
const options = {
  useNewUrlParser: true
  /*
  keepAlive: 1,
  reconnectTries: 300
  */
}
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(conf.Test_Atlas_URI,options);
module.exports = {

set: (_psid,_name,_locale,_refof,_refnumber,_email,_group,_app,_fanpage,_twitter,_youtube,_faq,_total) => {
  client.connect((err,client) => {
    const collection = client.db("tentech").collection("user");
        collection.insertOne({
            psid: _psid, //ID page ----> show
            name: _name, //Ho ten ---> show
            locale: _locale, //quoc gia | XIN CAP QUYEN: user_location
            refof: _refof, //Nguoi gioi thieu 
            refnumber: _refnumber, //so nguoi duoc gioi thieu  --> show
            email: _email, //mail --> show
            group: _group, //Check vao nhom  -->show
            app: _app, //check nv app dang ki -->show
            fanpage: _fanpage, //Check nv fb -->show
            twitter: _twitter, //check nv tw --> show
            youtube: _youtube, //check nv yt --> show
            faq: _faq, //check nv faq --> so luong cau dung | show
            total: _total //Tong tien --> show
        });
        //
  //client.close();
  });
},

get: (fill,call)=>{
    client.connect((err,client) => {
    const collection = client.db("tentech").collection("user");
    collection.findOne(fill, (err, res) => {call(res)});
  });
},

upset: (fill,up)=>{
client.connect((err,client) => {
    const collection = client.db("tentech").collection("user");
    collection.updateOne( fill, {$set: up} )
    //
    //client.close();
  });
 },
 upinc: (fill,up)=>{
  client.connect((err,client) => {
      const collection = client.db("tentech").collection("user");
      collection.updateOne( fill, {$inc: up} )
      //
    //client.close();
    });
},
setbuy: (_tx) => {
  client.connect((err,client) => {
    const collection = client.db("tentech").collection("buy");
        collection.insertOne({tx: _tx});
        //
  //client.close();
  });
},
getbuy: (fill,call)=>{
  client.connect((err,client) => {
  const collection = client.db("tentech").collection("buy");
  collection.findOne(fill, (err, res) => {call(res)});
  });
 },
 getall: (a,call)=>{
  client.connect((err,client) => {
    const collection = client.db("tentech").collection("user");
    collection.find(a).toArray((err, res) => {call(res)});
    //
    //client.close();
    });
 }
}

//fill, up la obj | Vi du: {psid: '12345678'},{name: 'cai lol me'}
