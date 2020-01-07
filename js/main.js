window.addEventListener('load', _ => {
    Settings.initIfNot();
    let currentScore = 0;
    let maxScore = Settings.getMaxScore();

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
    const currentScoreValue = document.querySelector('#currentScoreValue')
    const maxScoreValue= document.querySelector('#maxScoreValue');
    maxScoreValue.innerHTML=maxScore;
    const indicator= document.querySelector('#indicator');

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
                        currentScore += .3;
                        indicator.classList.add('indicator-goodPosture')
                        indicator.classList.remove('indicator-badPosture')
                    } else {

                        currentScore = currentScore > 0 ? currentScore - .6 : 0;
                        indicator.classList.add('indicator-badPosture')
                        indicator.classList.remove('indicator-goodPosture')
                    }
                    if(currentScore > maxScore){
                        maxScore=currentScore;
                        Settings.setMaxScore(maxScore);
                        maxScoreValue.innerHTML=Math.floor(currentScore);
                    }
                    currentScoreValue.innerHTML=Math.floor(currentScore);

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
            lockBtn.innerHTML = "Start";
            indicator.classList.remove('indicator-searching')
            indicator.classList.remove('indicator-goodPosture')
            indicator.classList.remove('indicator-badPosture')
            window.navigator.vibrate([100, 100, 100]);
        } else {
            positionLocked = 'IN_PROGRESS'
            lockBtn.innerHTML = "Detecting Position";
            indicator.classList.add('indicator-searching')
            detectPositionTimer = setInterval(detectPosition, 100)
        }

    })

    function lockPosition() {
        lockedAxis.x = axe;
        lockedAxis.y = ye;
        lockedAxis.z = zee;
        positionLocked = true
        positionDetectedAudio.play();
        currentScore = 0;
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
        if (Math.abs(temp.x - axe) < 3) {
            positionDetectionConfidence++;
         
        } else {
            positionDetectionConfidence = 0;
            console.log('Confidence reset')
            temp.x = axe
        }
        if(getComputedStyle(lockBtn).borderWidth=='3px'){
            lockBtn.style.borderWidth='4px'
        }else{
            lockBtn.style.borderWidth='3px'
        }
        if (positionDetectionConfidence > 10) {
            positionDetectionConfidence = 0;
            clearInterval(detectPositionTimer);
            console.log('Good position detected')
            lockPosition();
        }
    }


})