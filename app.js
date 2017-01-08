import express from 'express';
import cookieParser from 'cookie-parser';
import BodyParser from 'body-parser';
import path from 'path';
var session =require('express-session') ;
import xlsx from 'node-xlsx';

//var redisStore =require('connect-redis')(session);
const app =express();
const port =3000;
app.set('view engine','jade')
app.use(cookieParser());
app.use(BodyParser());
app.use(session({
    //store:new redisStore(),
    secret:'somesecretoken',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:true}

}));
app.get('/',(req,res)=>{
    res.set({'Accept-Charset':'utf-8'});
    console.log(req.session);
    let h1='hello';
   /*
   *  if(req.session.isVisit){
    req.session.isVisit++;
    //res.send(`<p>第${isVisit}次来到此页面`)
    h1=`第${isVisit}次来到此页面`;
    }else {
    req.session.isVisit=1;
    h1=`欢迎第一次访问此页面`;
    //res.send('欢迎第一次访问此页面')
    }
   * */
    app.set('trust proxy', 1)
    res.render(path.join(__dirname,'/index.jade'),{h1});
   /*
   *  if(req.session.isVisit){
    req.session.isVisit++;
    res.send(`<p>第${isVisit}次来到此页面`)
    }else {
    req.session.isVisit=1;
    res.send('欢迎第一次访问此页面')
    }
   * */
   // res.cookie('isVisit',true,{maxAge:60*1000});
    //

});
app.get('/file.xlsx',(req,res)=>{
// Or var xlsx = require('node-xlsx').default;

    //const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
    const data=[['姓名','手机号码','年龄'],['xiaoqi',134232323,23]];
    var buffer = xlsx.build([{name: "mySheetName", data: data}]);
    res.send(buffer)
});
app.listen(port,(error)=>{
    if(error){
        console.log(error)
    }else {
        console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
    }
});
