import express from 'express';
import cookieParser from 'cookie-parser';
import BodyParser from 'body-parser';
import path from 'path';
import * as d3 from 'd3';
import  session from 'express-session' ;
import xlsx from 'node-xlsx';
import parseUrl from 'parseUrl';
import  fs from 'fs';
//var redisStore =require('connect-redis')(session);
const app =express();
const port =3000;
//模板

app.set('view engine','jade');
app.use(cookieParser());
app.use(BodyParser());
//app.use(express.static(pub));
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true
}));
app.use((req,res,next)=>{
    //突然想到中间件拦截了会怎样
    //res.render(path.join(__dirname,'/index.jade'),{h1:'我就是拦截你了咋地'});
   let {views}=req.session;
   if (!views){
       views=req.session.views={}
   }
   let  pathname=parseUrl(req).pathname;
   views[pathname]=(views[pathname]||0)+1;
   next();
});
app.get('/svg',(req,res)=>{
    let svg=d3.svg;
    console.log(svg)
    let  line = svg.append('line').attr('x1',100).attr('y1',100).style({fill:'none',stroke:'#000'});
    res.send(line)
});
app.get('/ecg',(req,res)=>{
    fs.readFile('.data/ecg.bin',(err,buffer)=>{
        let  ecg = [];
        for(let  i = 0; i < buffer.byteLength / 2; i++) {
            //

            let number= buffer.readInt16BE(i * 2)/ 2048;
            if (i==1){
                console.log(number)
            }
            // console.log(number);
            ecg.push([i, number])
        }
        ecg = ecg.slice(0, 20000);

    });
});
app.get('/',(req,res)=>{
    res.set({'Accept-Charset':'utf-8'});
    console.log(req.session);
    let {
        session:{
            views
        }
    }=req;
    console.log(views);
    let h1=`hello 小齐,发现你是第${views['/']}次访问网站`;
    res.render(path.join(__dirname,'/index.jade'),{h1});

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
