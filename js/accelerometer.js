
/************************/
let BETA = 0;
let GAMMA = 0
let pureBeta = 0;
let tempBeta
let lastSomeBeta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let pureGamma = 0;
let tempGamma;
let lastSomeGamma = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


const temp = {
    lastUpdate: 0
}

let callback;

function registerListener(_callback) {
    window.addEventListener('deviceorientation', updatePosition);
    callback=_callback;
    return this;
}



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
    callback({
        beta:BETA,
        gamma:GAMMA
    })
}

/*****************************************/