/**
 * Created by xiaoqi on 2017/2/23.
 */
import gulp from 'gulp';
import bem from 'gulp-bem';
import concat from 'gulp-concat'
let levels =['base','blocks'];
let tree =bem(levels);
gulp.task('default',()=>{
    tree.deps('svgTest.html')
        .pipe(bem.src('{bem}.css'))
        .pipe(concat('src/demo.css'))
        .pipe(gulp.dest('./dist'))
});