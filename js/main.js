

window.addEventListener('load', _ => {
    Settings.initIfNot();

    fetch(`config.json?cacheBust=${new Date().getTime()}`).then(response => { return response.json() }).then(config => {
        if (Settings.getVersion() == 0) {
            Settings.setVersion(config.version)
        }
        else if (Settings.getVersion() != config.version) {
            Settings.setVersion(config.version)
            fetch(`config.json?clean-cache=true&cacheBust=${new Date().getTime()}`).then(_ => {
                document.body.append('cache cleaned')

                window.location.reload(true);
            })

        }
    })

    let currentScore = 0;
    let maxScore = Settings.getMaxScore();
    let throttlingFrequency = 500;

    let axe = 0;
    let ye = 0;
    let zee = 0;
    let lockedAxis = {};
    let positionLocked = false



    let lockBtn = document.querySelector('#lockBtn');
    let delta = document.querySelector('#delta');
    delta.value = Number.parseInt(Settings.getSensitivity());
    delta.addEventListener('change', updateSensitivity)
    delta.addEventListener('keyup', updateSensitivity)


    const currentScoreValue = document.querySelector('#currentScoreValue')
    const maxScoreValue = document.querySelector('#maxScoreValue');
    maxScoreValue.innerHTML = Math.floor(maxScore);
    const indicator = document.querySelector('#indicator');
    document.querySelector('#whatsAppShare').addEventListener('click', _ => {
        let anchor = document.createElement('a');
        let greetings = ``;
        if (maxScore > 0) {
            greetings = `${Math.floor(maxScore)}!! My new max score in Posture Fix!  Improve your sitting posture & beat my score ${document.location.href}`
        }
        else {
            greetings = `Improve your sitting posture by using Posture Fix!! check this ${document.location.href}`
        }
        greetings = encodeURIComponent(greetings)
        anchor.href = `whatsapp://send?text=${greetings}`
        anchor.setAttribute('target', '_blank')
        anchor.click();
    })

    document.querySelector('#facebookShare').addEventListener('click', _ => {
        let anchor = document.createElement('a');
        let greetings = ``;
        if (maxScore > 0) {
            greetings = `${Math.floor(maxScore)}!! My new max score in Posture Fix! Improve your sitting posture & beat my score`
        }
        else {
            greetings = `Improve your sitting posture by using Posture Fix!! check this`
        }
        greetings = encodeURIComponent(greetings)
        anchor.href = `https://www.facebook.com/sharer/sharer.php?u=${document.location.href}&quote=${greetings}`
        anchor.setAttribute('target', '_blank')
        anchor.click();
    })

    document.querySelector('#twitterShare').addEventListener('click', _ => {
        let anchor = document.createElement('a');
        let greetings = ``;
        if (maxScore > 0) {
            greetings = `${Math.floor(maxScore)}!! My new max score in Posture Fix! Improve your sitting posture & beat my score`
        }
        else {
            greetings = `Improve your sitting posture by using Posture Fix!! check this`
        }
        greetings = encodeURIComponent(greetings)
        anchor.href = `https://twitter.com/intent/tweet?url=${document.location.href}&text=${greetings}&related=postureFixz`
        anchor.setAttribute('target', '_blank')
        anchor.click();
    })


    registerListener(positionUpdate)

    let throttled = false;
    function positionUpdate(event) {

        if (!throttled) {
            throttled = true;
            setTimeout((event) => {

                let beta = Math.round(event.beta*1000)/1000;
                let gamma = Math.round(event.gamma*1000)/1000;
                
                if (positionLocked === true) {
                    // for position locked
                    let goodPosition = true;

                    if ((Math.abs(beta - lockedAxis.y)) > Number.parseFloat(delta.value)) {
                        goodPosition = false;
                        notifyIncorrectPosture();
                        document.querySelector('#readings').innerHTML+=`Y[${beta}] z[${gamma}] Y-False ${Math.abs(beta - lockedAxis.y)}<br>`
                    }
                    if ((Math.abs(gamma - lockedAxis.z) > (Number.parseFloat(delta.value)))) {
                        goodPosition = false;
                        notifyIncorrectPosture();
                        document.querySelector('#readings').innerHTML+=`Y[${beta}] z[${gamma}] Z-False ${Math.abs(gamma - lockedAxis.z)}<br>`
                    }

                    if (goodPosition) {

                        if (incorrectPostureTimer != null) {
                            // good position found && clean previous incorrect position timer
                            clearInterval(incorrectPostureTimer);
                            incorrectPostureTimer = null;
                            repositionSound.play();
                         //   window.navigator.vibrate([100, 100, 100]);
                        }
                        if (positionLocked === true) {
                            // increase current score
                            currentScore += .3;
                            indicator.classList.add('indicator-goodPosture')
                            indicator.classList.remove('indicator-badPosture')
                        }

                    } else {
                        // for bad position
                        if (positionLocked === true) {
                            // decrease current score
                            currentScore = currentScore > .15 ? currentScore - .15 : 0;
                            indicator.classList.add('indicator-badPosture')
                            indicator.classList.remove('indicator-goodPosture')
                        }
                    }
                    if (currentScore > maxScore) {
                        // new max score
                        maxScore = currentScore;
                        Settings.setMaxScore(maxScore);
                        maxScoreValue.innerHTML = Math.floor(currentScore);
                    }
                    currentScoreValue.innerHTML = Math.floor(currentScore);
                }
                else {
                    // op.innerHTML = ``
                    clearInterval(incorrectPostureTimer)
                    incorrectPostureTimer = null;
                    // update beta and gamma

                    ye = (event.beta);
                    zee = (event.gamma);
                }
                throttled = false;
            }, throttlingFrequency, event)
        }

    }

    let incorrectPostureTimer = null;

    function notifyIncorrectPosture() {
        if (incorrectPostureTimer == null) {
           // window.navigator.vibrate([200]);
            negativeSound.play();
            incorrectPostureTimer = setInterval(_ => {
              //  window.navigator.vibrate([200]);
                negativeSound.play();
            }, 2000)
        }


    }

    const noSleep = new NoSleep();
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
            noSleep.disable();

        } else {
            positionLocked = 'IN_PROGRESS'
            lockBtn.innerHTML = "Detecting Position";
            currentScoreValue.innerHTML = "0";
            indicator.classList.add('indicator-searching')
            throttlingFrequency = 100;
            detectPosition();
            detectPositionTimer = setInterval(detectPosition, 100);

            noSleep.enable();

        }

    })

    function lockPosition() {

        lockedAxis.x = axe;
        lockedAxis.y = ye;
        lockedAxis.z = zee;
        positionLocked = true
        possitiveSound.play();
        currentScore = 0;
        throttlingFrequency = 500
        //window.navigator.vibrate([100, 100, 100]);
        // history='';
        lockBtn.innerHTML = "Stop";

    }

    function updateSensitivity() {
        Settings.setSensitivity(this.value)
    }

    let positionDetectionConfidence = 0;
    let temp = {
        y: -9613,
        z: -9613
    }

    let history = '';

    function detectPosition() {

        history += `[ ${temp.y} ${temp.z}]`
        if (Math.abs(temp.y - ye) <= 5 && Math.abs(temp.z-zee)<=5) {
            positionDetectionConfidence++;

        } else {
            history += 'reset';
            positionDetectionConfidence = 0;
            temp.y = ye;
            temp.z=zee;
        }
        if (getComputedStyle(lockBtn).borderWidth == '3px') {
            lockBtn.style.borderWidth = '4px'
        } else {
            lockBtn.style.borderWidth = '3px'
        }

        if (positionDetectionConfidence > 10) {
            history.success = true;
            positionDetectionConfidence = 0;
            clearInterval(detectPositionTimer);
           document.querySelector('#gen').innerHTML = `y= [${temp.y}], z=[${temp.z}] delta=${delta.value}`;
            lockPosition();
        }
    }


})