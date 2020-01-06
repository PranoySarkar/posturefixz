window.addEventListener('load', _ => {
    Settings.initIfNot();

    let axe = 0;
    let ye = 0;
    let zee = 0;
    let lockedAxis = {};
    let positionLocked = false

    let flag = true;
    let xDom = document.querySelector('#x');
    let yDom = document.querySelector('#y');
    let zDom = document.querySelector('#z');
    let op = document.querySelector('#op');
    let lockBtn = document.querySelector('#lockBtn');
    let delta = document.querySelector('#delta');
    delta.value = Number.parseInt(Settings.getSensitivity());
    delta.addEventListener('change', updateSensitivity)
    delta.addEventListener('keyup', updateSensitivity)
    let allAxis = document.querySelector('#allAxis');
    let portraitRadioY = document.querySelector('#yAxis');
    let landscapeRadioZ = document.querySelector('#zAxis');
    let positionDetectedAudio = document.querySelector('#positionDetectedAudio');
    fetch('./assets/audio/positive.wav')
    let incorrectPositionAudio = document.querySelector('#incorrectPositionAudio');
    fetch('./assets/audio/negative_2.wav')
    let repositionDetectedAudio = document.querySelector('#repositionDetectedAudio');
    fetch('./assets/audio/reposition.wav')

    let throttled = false;
    window.addEventListener('deviceorientation', (event) => {

        if (!throttled) {
            throttled = true;
            setTimeout((event) => {
                if (positionLocked) {
                    let goodPosition = true;
                    op.innerHTML = '';
                    if (allAxis.checked && Math.abs(event.alpha - lockedAxis.x) > Number.parseFloat(delta.value)) {
                        op.innerHTML = `Out Of posture by x ${Math.round(event.alpha)}<br/>`
                        goodPosition = false;
                        notifyIncorrectPosture();

                    }
                    if ((allAxis.checked || portraitRadioY.checked) && Math.abs(event.beta - lockedAxis.y) > Number.parseFloat(delta.value)) {
                        op.innerHTML += `Out Of posture by Y ${Math.round(event.beta)}<br/>`
                        goodPosition = false;
                        notifyIncorrectPosture();
                    }
                    if ((allAxis.checked || landscapeRadioZ.checked) && Math.abs(event.gamma - lockedAxis.z) > Number.parseFloat(delta.value)) {
                        op.innerHTML += `Out Of posture by Z ${Math.round(event.gamma)}<br/>`
                        goodPosition = false;
                        notifyIncorrectPosture();
                    }
                    if (goodPosition) {
                        op.innerHTML += `Good Possition detected`
                        if (incorrectPostureTimer != null) {
                            clearInterval(incorrectPostureTimer);
                            incorrectPostureTimer = null;
                            repositionDetectedAudio.play();
                            window.navigator.vibrate([100, 100, 100]);
                        }
                    }

                }
                else {
                    op.innerHTML = ``
                    clearInterval(incorrectPostureTimer)
                    incorrectPostureTimer = null;
                    axe = Math.round(event.alpha);
                    if (allAxis.checked) {
                        xDom.innerHTML = `X ${axe}`;
                    } else {
                        xDom.innerHTML = ''
                    }
                    ye = Math.round(event.beta);
                    if (allAxis.checked || portraitRadioY.checked) {
                        yDom.innerHTML = `Y ${ye}`;
                    }
                    else {
                        yDom.innerHTML = ''
                    }
                    zee = Math.round(event.gamma);
                    if (allAxis.checked || landscapeRadioZ.checked) {
                        zDom.innerHTML = `Z ${zee}`;
                    } else {
                        zDom.innerHTML = ''
                    }
                }
                throttled = false;
            }, 500, event)
        }

    })

    let incorrectPostureTimer = null;

    function notifyIncorrectPosture() {
        if (incorrectPostureTimer == null) {
            window.navigator.vibrate([200]);
            incorrectPositionAudio.play();
            incorrectPostureTimer = setInterval(_ => {
                window.navigator.vibrate([200]);
                incorrectPositionAudio.play();
            }, 2000)
        }


    }

    let detectPositionTimer = null;
    document.querySelector('#lockBtn').addEventListener('click', event => {
        if (positionLocked === 'IN_PROGRESS' || positionLocked == true) {
            clearInterval(detectPositionTimer);
            positionLocked = false;
            lockBtn.innerHTML = "Detect Position";
            window.navigator.vibrate([100, 100, 100]);
        } else {
            positionLocked = 'IN_PROGRESS'
            lockBtn.innerHTML = "Detecting Position";
            detectPositionTimer = setInterval(detectPosition, 100)
        }

    })

    function lockPosition() {
        lockedAxis.x = axe;
        lockedAxis.y = ye;
        lockedAxis.z = zee;
        positionLocked = true
        positionDetectedAudio.play();
        window.navigator.vibrate([100, 100, 100]);

        lockBtn.innerHTML = "Stop";

    }

    function updateSensitivity() {
        Settings.setSensitivity(this.value)
    }

    let positionDetectionConfidence = 0;
    let temp = {
        x: -3535
    }
    function detectPosition() {
        if (Math.abs(temp.x - axe) < 2) {
            positionDetectionConfidence++;
        } else {
            positionDetectionConfidence = 0;
            console.log('Confidence reset')
            temp.x = axe
        }
        if (positionDetectionConfidence > 15) {
            positionDetectionConfidence = 0;
            clearInterval(detectPositionTimer);
            console.log('Good position detected')
            lockPosition();
        }
    }


})