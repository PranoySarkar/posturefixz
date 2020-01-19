google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);
var options = {
    title: 'Accelerometer',
    curveType: 'function',
    legend: { position: 'bottom' }
};
var chart = null;
var data = [
    ['time', 'beta', 'gamma'],
    [0, 0, 0]
];

let index = 0
/************************/
let BETA = 0;
let GAMMA = 0
let pureBeta = 0;
let tempBeta
let lastSomeBeta =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

let pureGamma = 0;
let tempGamma;
let lastSomeGamma = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


const temp = {
    lastUpdate: 0
}


window.addEventListener('deviceorientation', updatePosition);

function updatePosition(event) {


    tempGamma = Number.parseInt((event.gamma).toFixed(2));
    pureGamma = tempGamma;
    lastSomeGamma.shift();
    lastSomeGamma.push(tempGamma)
    let avg = lastSomeBeta.reduce((acc, snd) => acc + snd) / lastSomeGamma.length;
    GAMMA = avg;

    tempBeta = Number.parseInt(Math.abs(event.beta - 90).toFixed(2));
    pureBeta = tempBeta;
    lastSomeBeta.shift();
    lastSomeBeta.push(tempBeta)
    avg = lastSomeBeta.reduce((acc, snd) => acc + snd) / lastSomeBeta.length;
    BETA = avg;
}

function checkDeviceOrientation() {


    data.push([index++, BETA, GAMMA]);
    //data.push([index++, GAMMA, tempGamma]);
    update()
}
setInterval(checkDeviceOrientation, 500);
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
        ['time', 'beta', 'gamma'],
        [0, 0, 0]
    ];
    update();
} 