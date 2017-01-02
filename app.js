import express from 'express';
import cookieParser from 'cookie-parser';
import BodyParser from 'body-parser';
import path from 'path';
const app =express();
const port =3000;
app.use(cookieParser());
app.use(BodyParser());
app.get('/',(req,res)=>{
    res.set({'Accept-Charset':'utf-8'});
    res.cookie('isVisit',true,{maxAge:60*1000});
    res.sendFile(path.join(__dirname,'/index.html'));

});
app.listen(port,(error)=>{
    if(error){
        console.log(error)
    }else {
        console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
    }
});
