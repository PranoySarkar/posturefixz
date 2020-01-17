google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);
var options = {
    title: 'Accelerometer',
    curveType: 'function',
    legend: { position: 'bottom' }
};
var chart = null;
var data = [
    ['time', 'beta', 'pureBeta'],
    [0, 0, 0]
];

let index=0
/************************/
let BETA = 0;
let pureBeta=0;
let tempBeta
let lastSomeBeta=[1,2,1,2,1,1,1,2,3,2,1,1,2,1,1,2,1,2,1,1,1,2,3,2,1,1,2,1,1,2,1,2,1,1,1,2,3,2,1,1,2,1];
const temp={
    lastBetaAvarage:0
}


window.addEventListener('deviceorientation', (event) => {
    tempBeta = Number.parseInt(Math.abs(event.beta - 90).toFixed(2));
    pureBeta=tempBeta;
    let avg = lastSomeBeta.reduce((acc,snd)=>acc+snd)/lastSomeBeta.length;

    lastSomeBeta.shift();
    lastSomeBeta.push(tempBeta)
    if(Math.abs(avg-tempBeta)<2){
        BETA=tempBeta+.5;
    }
    
});

function checkDeviceOrientation() {
    data.push([index++, BETA, tempBeta]);
    update()
}
setInterval(checkDeviceOrientation, 200);
/*****************************************/


function drawChart() {
    chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    update();
}
function update() {
    chart.draw(google.visualization.arrayToDataTable(data), options);
}


//let ball = document.querySelector('.ball');
let lastBeta = 0;
let avgBetaDiff = 0

let lastGama = 0;
let avgGamaDiff = 0;

const leanFbData = document.querySelector('.leanFbData')
const tiltLrData = document.querySelector('.tiltLrData')

function clean() {
    leanFbData.innerHTML = '';
    tiltLrData.innerHTML = '';
    data = [
        ['time', 'lean-Forward-Back', 'tilt-left-right'],
        [0, 0, 0]
    ];
    update();
} 