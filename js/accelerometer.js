
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
    
    return new Promise((resolve, reject) => {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', updatePosition);
                    callback = _callback;
                    resolve();
                }else{
                    reject('permission needed');
                }
            })
                .catch(err => {
                    reject('permission needed');
                });
        } else {
            window.addEventListener('deviceorientation', updatePosition);
            callback = _callback;
            resolve();
        }
    });



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