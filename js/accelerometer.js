
/************************/
var BETA = 0;
var GAMMA = 0
var pureBeta = 0;
let tempBeta
let lastSomeBeta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var pureGamma = 0;
let tempGamma;
let lastSomeGamma = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


const temp = {
    lastUpdate: 0
}

let callback;

function registerListener(_callback) {
    window.addEventListener('deviceorientation', updatePosition);
    callback = _callback;
    return this;
}



function updatePosition(event) {
    tempBeta = Number.parseInt(Math.abs(event.beta - 90).toFixed(2));
    pureBeta = tempBeta;
    lastSomeBeta.shift();
    lastSomeBeta.push(tempBeta)
    let avg = lastSomeBeta.reduce((acc, snd) => acc + snd) / lastSomeBeta.length;
    BETA = avg;

    tempGamma = Number.parseInt(Math.abs(event.gamma).toFixed(2));
    pureGamma = tempGamma;
    lastSomeGamma.shift();
    lastSomeGamma.push(tempGamma)
    avg = lastSomeGamma.reduce((acc, snd) => acc + snd) / lastSomeGamma.length;
    GAMMA = avg;


    callback({
        beta: BETA,
        gamma: GAMMA
    })
}

/*****************************************/