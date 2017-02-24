/**
 * Created by xiaoqi on 2017/2/22.
 */
let  d3 = require('d3');
import  fs from 'fs';
import jsdom from 'jsdom';
class drawEcg {
    sendSvgUrl(req,res,ecg){
        jsdom.env({
            html:'',
            url: "http://news.ycombinator.com/",
            features:{ QuerySelector:true }, //you need query selector for D3 to work
            done:function(errors, window){
                window.d3 = d3.select(window.document);
                let svg=drawEcg.writeFile(ecg,path.resolve(__dirname,'test.svg'),window.d3);
                //console.log('svg',svg);
                res.send(svg)
            }
        });
    }
    static formatBufferData(buffer){
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
        return ecg;
    }
    static readEcgDataFile(){
        fs.readFile('./data/ecg.bin',(err,buffer)=>{
            // console.log('global:',global);

          return new Promise((resolve,reject)=>{
              if(err){
                  reject(err)
              }else {
                  resolve(buffer)
              }
          });
        });
    }
    static  writeFile(data,outputLocation,d3Selector){

    //get d3 into the dom
    //console.log(window.d3);
    var sampleRate = 256;
    var options = {
    margin: {
        top: 0,
        right: 1,
        bottom: 10,
        left: 10
    },
    // 整个图形的高度 (px)
    height: 240,
    // 整个图形的宽度 (px)
    width: 3600,

    // 控制在整个图形上显示多少个点(256 个点是一秒)
    xMin: 0,
    xMax: 3840,

    // x 方向大格
    xMajorTicks: sampleRate * 0.2,
    // x 方向小格
    xMinorTicks: sampleRate * 0.04,

    // y 轴最小值 (V)
    yMin: -1,
    // y 轴最大值 (V)
    yMax: 1.5
};

    //console.log('body:',body);
    var svg = d3Selector.select('body')
    .append('div')
    .attr('class','container')
    .append('svg')
    .attr('height', options.height).attr('width', options.width);
    options.height = options.height - options.margin.top - options.margin.bottom;
    options.width = options.width - options.margin.left - options.margin.right;

    // Create a root canvas to put all elements into and move it according to the margins.
    // The extra 0.5 pixels is to avoid blur on retina screens.
    var canvas = svg.append('g')
    .attr('transform', 'translate(' + (options.margin.left + 0.5) + ',' + (options.margin.top + 0.5) + ')');

    // Create a background for the chart area.
    canvas.call(function(selection) {
    selection.append('rect')
        .classed('background', true)
        .attr('height', options.height).attr('width', options.width)
        .attr('x', 0).attr('y', 0);
});

    // Create a scale for the y-coordinates.
    var yScale = d3.scaleLinear()
    .domain([options.yMax, options.yMin])
    .range([0, options.height]);

    // Create a scale for x-coordinates.
    var xScale = d3.scaleLinear()
    .domain([options.xMin, options.xMax])
    .range([0, options.width]);

    // Create the y-axis.
    var yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)
    .tickFormat('');
    var yAxis = canvas
    .append('g')
    .classed('axis axis-y', true)
    .call(yAxisGenerator);

    // Create a horizontal grid.
    var yMajorGridGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)
    .tickSize(-options.width)
    .tickFormat('');
    var yMajorGrid = canvas
    .append('g')
    .classed('major-grid', true)
    .call(yMajorGridGenerator);

    var yMinorGridGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(20)
    .tickSize(-options.width)
    .tickFormat('');
    var yMinorGrid = canvas
    .append('g')
    .classed('minor-grid', true)
    .call(yMinorGridGenerator);

    // Create the x-axis.
    var xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .ticks(options.xMax / options.xMajorTicks)
    .tickFormat('');
    var xAxis = canvas
    .append('g')
    .classed('axis axis-x', true)
    .attr('transform', 'translate(0,' + options.height + ')')
    .call(xAxisGenerator);

    // Create a vertical grid.
    var xMajorGridGenerator = d3.axisTop()
    .scale(xScale)
    .ticks(options.xMax / options.xMajorTicks)
    .tickSize(-options.height)
    .tickFormat('');
    var xMajorGrid = canvas
    .append('g')
    .classed('major-grid', true)
    .call(xMajorGridGenerator);

    var xMinorGridGenerator = d3.axisTop()
    .scale(xScale)
    .ticks(options.xMax / options.xMinorTicks)
    .tickSize(-options.height)
    .tickFormat('');
    var xMinorGrid = canvas
    .append('g')
    .classed('minor-grid', true)
    .call(xMinorGridGenerator);

    // Create a clipping mask to make sure that the chart don't escape.
    var clipMask;
    svg.call(function(selection) {
    clipMask = selection
        .append('defs')
        .append('svg:clipPath')
        .attr('id', 'ecgChartClip')
        .append('svt:rect')
        .attr('x', 0).attr('y', 0)
        .attr('height', options.height)
        .attr('width', options.width);
});

    var lineGenerator = d3.line(data)
    .x(function(d) {
        return xScale(d[0]);
    })
    .y(function(d) {
        return yScale(d[1]);
    })
    .curve(d3.curveCardinalOpen);
    var line = canvas.append('g')
    .attr('clip-path', 'url(#ecgChartClip)')
    .append('path').datum(data)
    .classed('ecg-line', true).attr('d', lineGenerator);
    let result= d3Selector.select('.container').html();
    //console.log(result);
    fs.writeFileSync(outputLocation, result); //using sync to keep the code simple
    return result;
}
}

export default drawEcg