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
    let xCheckbox = document.querySelector('#xCheckbox');
    let yCheckbox = document.querySelector('#yCheckbox');
    let zCheckbox = document.querySelector('#zCheckbox');

    let throttled = false;
    window.addEventListener('deviceorientation', (event) => {

        if (!throttled) {
            throttled = true;
            setTimeout((event) => {
                console.log(new Date().getTime())
                if (positionLocked) {
                    let goodPosition = true;
                    op.innerHTML = '';
                    if (xCheckbox.checked && Math.abs(event.alpha - lockedAxis.x) > Number.parseFloat(delta.value)) {
                        op.innerHTML = `Out Of posture by x ${Math.round(event.alpha)}<br/>`
                        goodPosition = false;
                        notifyIncorrectPosture();

                    }
                    if (yCheckbox.checked && Math.abs(event.beta - lockedAxis.y) > Number.parseFloat(delta.value)) {
                        op.innerHTML += `Out Of posture by Y ${Math.round(event.beta)}<br/>`
                        goodPosition = false;
                        notifyIncorrectPosture();
                    }
                    if (zCheckbox.checked && Math.abs(event.gamma - lockedAxis.z) > Number.parseFloat(delta.value)) {
                        op.innerHTML += `Out Of posture by Z ${Math.round(event.gamma)}<br/>`
                        goodPosition = false;
                        notifyIncorrectPosture();
                    }
                    if (goodPosition) {
                        op.innerHTML += `Good Possition detected`
                        if (incorrectPostureTimer != null) {
                            clearInterval(incorrectPostureTimer);
                            incorrectPostureTimer = null;
                            window.navigator.vibrate([100, 100, 100]);
                        }
                    }

                }
                else {
                    op.innerHTML = ``
                    clearInterval(incorrectPostureTimer)
                    incorrectPostureTimer = null;
                    axe = Math.round(event.alpha);
                    if (xCheckbox.checked) {
                        xDom.innerHTML = `X ${axe}`;
                    } else {
                        xDom.innerHTML = ''
                    }
                    ye = Math.round(event.beta);
                    if (yCheckbox.checked) {
                        yDom.innerHTML = `Y ${ye}`;
                    }
                    else {
                        yDom.innerHTML = ''
                    }
                    zee = Math.round(event.gamma);
                    if (zCheckbox.checked) {
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
            incorrectPostureTimer = setInterval(_ => {
                window.navigator.vibrate([200]);
            }, 2000)
        }


    }

    let detectPositionTimer = null;
    document.querySelector('#lockBtn').addEventListener('click', event => {
        if (positionLocked) {
            clearInterval(detectPositionTimer);
            positionLocked = false;
            lockBtn.innerHTML = "Detect Position";
            window.navigator.vibrate([100, 100, 100]);
        } else {
            detectPositionTimer = setInterval(detectPosition, 100)
        }
       
    })

    function lockPosition() {
        lockedAxis.x = axe;
        lockedAxis.y = ye;
        lockedAxis.z = zee;
        positionLocked = true
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
        if (positionDetectionConfidence > 5) {
            positionDetectionConfidence = 0;
            clearInterval(detectPositionTimer);
            console.log('Good position detected')
            lockPosition();
        }
    }


})