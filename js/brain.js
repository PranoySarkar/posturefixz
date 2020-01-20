google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);
var options = {
    title: 'Accelerometer',
    curveType: 'function',
    legend: { position: 'bottom' }
};
var chart = null;
var data = [
    ['time', 'gamma', 'pure-gamma'],
    [0, 0, 0]
];

registerListener(updateData);
let index = 0;
function updateData(event) {
    data.push([index++, GAMMA, pureGamma]);
    update()
}





/*****************************************/


function drawChart() {
    chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    update();
}
function update() {
    chart.draw(google.visualization.arrayToDataTable(data), options);
}




const leanFbData = document.querySelector('.leanFbData')
const tiltLrData = document.querySelector('.tiltLrData')

function clean() {
    leanFbData.innerHTML = '';
    tiltLrData.innerHTML = '';
    data = [
        ['time', 'gamma', 'pure-gamma'],
        [0, 0, 0]
    ];
    update();
} 