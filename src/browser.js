/**
 * Created by xiaoqi on 2017/1/16.
 */
window.onload=function (e) {
    document.getElementById('uploadForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        console.log('submit upload form');
        var data =new FormData();
        data.append({name:'file upload'});
        
    });

};

/*
document.getElementById('uploadForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log('submit upload form');
});*/
