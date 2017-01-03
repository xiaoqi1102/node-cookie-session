import express from 'express';
import cookieParser from 'cookie-parser';
import BodyParser from 'body-parser';
import path from 'path';
var session =require('express-session') ;
//var redisStore =require('connect-redis')(session);
const app =express();
const port =3000;
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
    res.render(path.join(__dirname,'/index.html'),{h1:'hello'});
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
app.listen(port,(error)=>{
    if(error){
        console.log(error)
    }else {
        console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
    }
});
