
let positionDetectionConfidence = 0;
let positionTrail = [];
window.addEventListener('load', _ => {
    Settings.initIfNot();

    fetch(`config.json?cacheBust=${new Date().getTime()}`)
        .then(response => { return response.json() })
        .then(config => {
            document.querySelector('.copyRightDiv').innerHTML = `<div>Posture Corrector ${config.version + ''}</div><div>&copy; ${new Date().getFullYear()}</div>`;

            if (Settings.getVersion() == 0) {
                Settings.setVersion(config.version)
            }
            else if (Settings.getVersion() != config.version) {

                fetch(`config.json?clean-cache=true&cacheBust=${new Date().getTime()}`).then(_ => {
                    //actually cleans the cache
                    Settings.setVersion(config.version);
                    window.location.reload(true);
                });


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
    let accelerometerAccessed = false;



    let lockBtn = document.querySelector('#lockBtn');
    let delta = document.querySelector('#delta');
    delta.value = Number.parseInt(Settings.getSensitivity());
    delta.addEventListener('change', updateSensitivity)
    delta.addEventListener('keyup', updateSensitivity)


    const currentScoreValue = document.querySelector('#currentScoreValue')
    const maxScoreValue = document.querySelector('#maxScoreValue');
    maxScoreValue.innerHTML = Math.floor(maxScore);
    const indicator = document.querySelector('#indicator');

    let vibrationEnabled = Settings.getVibration();
    let vibrationChkb = document.querySelector(`#vibrationChkb`)
    if (vibrationEnabled) {
        vibrationChkb.checked = true;
    }
    vibrationChkb.addEventListener('change', event => {
        Settings.setVibration(event.target.checked)
        vibrationEnabled = event.target.checked;
    })


    document.querySelector('#whatsAppShare').addEventListener('click', _ => {
        let anchor = document.createElement('a');
        let greetings = ``;
        if (maxScore > 0) {
            greetings = `${Math.floor(maxScore)}!! My new max score in Posture Corrector!  Improve your sitting posture & beat my score https://posturecorrector.app/`
        }
        else {
            greetings = `Improve your sitting posture by using Posture Corrector!! check this https://posturecorrector.app/`
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
            greetings = `${Math.floor(maxScore)}!! My new max score in Posture Corrector! Improve your sitting posture & beat my score`
        }
        else {
            greetings = `Improve your sitting posture by using Posture Corrector!! check this`
        }
        greetings = encodeURIComponent(greetings)
        anchor.href = `https://www.facebook.com/sharer/sharer.php?u=https://posturecorrector.app/&quote=${greetings}`
        anchor.setAttribute('target', '_blank')
        anchor.click();
    })

    document.querySelector('#twitterShare').addEventListener('click', _ => {
        let anchor = document.createElement('a');
        let greetings = ``;
        if (maxScore > 0) {
            greetings = `${Math.floor(maxScore)}!! My new max score in Posture Corrector! Improve your sitting posture & beat my score`
        }
        else {
            greetings = `Improve your sitting posture by using Posture Corrector!! check this`
        }
        greetings = encodeURIComponent(greetings)
        anchor.href = `https://twitter.com/intent/tweet?url=https://posturecorrector.app/&text=${greetings}&related=PostureCorrector`
        anchor.setAttribute('target', '_blank')
        anchor.click();
    })




    let throttled = false;
    function positionUpdate(event) {

        if (!throttled) {
            throttled = true;
            setTimeout((event) => {

                let beta = Math.round(event.beta * 1000) / 1000;
                let gamma = Math.round(event.gamma * 1000) / 1000;

                if (positionLocked === true) {
                    // for position locked
                    let goodPosition = true;

                    if ((Math.abs(beta - lockedAxis.y)) > Number.parseFloat(delta.value)) {
                        goodPosition = false;
                        notifyIncorrectPosture();
                        document.querySelector('#readings').innerHTML += `Y[${beta}] z[${gamma}] Y-False ${Math.abs(beta - lockedAxis.y)}<br/>`
                    }
                    /* if ((Math.abs(gamma - lockedAxis.z) > (Number.parseFloat(delta.value)))) {
                         goodPosition = false;
                         notifyIncorrectPosture();
                         document.querySelector('#readings').innerHTML += `Y[${beta}] z[${gamma}] Z-False ${Math.abs(gamma - lockedAxis.z)}<br>`
                     }*/

                    if (goodPosition) {

                        if (incorrectPostureTimer != null) {
                            // good position found && clean previous incorrect position timer
                            clearInterval(incorrectPostureTimer);
                            incorrectPostureTimer = null;
                            playSound('repositionSound');
                            vibrate([100, 100, 100]);
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
            vibrate([200]);
            playSound('negativeSound');
            incorrectPostureTimer = setInterval(_ => {
                vibrate([200]);
                playSound('negativeSound');
            }, 2000)
        }
    }

    function playSound(type) {
        switch (type) {
            case 'negativeSound':
                negativeSound.play();
                break;
            case 'possitiveSound':
                possitiveSound.play();
                break;
            case 'repositionSound':
                repositionSound.play()
                break;
            case 'muted_all':
                possitiveSound.muted=true;
                possitiveSound.play();
                possitiveSound.pause();
                possitiveSound.muted=false;

                repositionSound.muted=true;
                repositionSound.play();
                repositionSound.pause();
                repositionSound.muted=false;

                negativeSound.muted=true;
                negativeSound.play();
                negativeSound.pause();
                negativeSound.muted=false;
                break;
        }

    }

    function vibrate(seq) {
        if (vibrationEnabled) {
            window.navigator.vibrate(seq);
        }
    }

    const noSleep = new NoSleep();
    let detectPositionTimer = null;
    document.querySelector('#lockBtn').addEventListener('click', event => {
        playSound('muted_all');

        if (!accelerometerAccessed) {
            registerListener(positionUpdate).then(_ => {
                accelerometerAccessed = true;
                start();
            })
        }
        else {
            start();
        }
    })



    function start() {

        if (positionLocked === 'IN_PROGRESS' || positionLocked == true) {
            clearInterval(detectPositionTimer);
            positionLocked = false;
            lockBtn.innerHTML = "Start";
            indicator.classList.remove('indicator-searching')
            indicator.classList.remove('indicator-goodPosture')
            indicator.classList.remove('indicator-badPosture')
            vibrate([100, 100, 100]);
            noSleep.disable();

        } else {
            
            positionLocked = 'IN_PROGRESS'
            lockBtn.innerHTML = "Detecting Posture";
            currentScoreValue.innerHTML = "0";
            indicator.classList.add('indicator-searching')
            throttlingFrequency = 100;
            document.querySelector('#gen').innerHTML = '';
            positionTrail = [];
            positionDetectionConfidence = 0;
            detectPosition();
            detectPositionTimer = setInterval(detectPosition, 100);
            noSleep.enable();

        }
    }

    function lockPosition() {

        lockedAxis.x = axe;
        lockedAxis.y = ye;
        lockedAxis.z = zee;
        positionLocked = true
        playSound('possitiveSound')

        currentScore = 0;
        throttlingFrequency = 500
        vibrate([100, 100, 100]);
        lockBtn.innerHTML = "Stop";

    }

    function updateSensitivity() {
        Settings.setSensitivity(this.value)
    }


    let temp = {
        y: -9613,
        z: -9613
    }



    function detectPosition() {
        if (Math.abs(temp.y - ye) <= 5 && Math.abs(temp.z - zee) <= 5) {
            positionTrail.push(temp)
            positionDetectionConfidence++;
        } else {
            positionDetectionConfidence = 0;
            temp.y = ye;
            temp.z = zee;
        }
        if (getComputedStyle(lockBtn).borderWidth == '3px') {
            lockBtn.style.borderWidth = '4px'
        } else {
            lockBtn.style.borderWidth = '3px'
        }

        if (positionDetectionConfidence > 10) {
            positionDetectionConfidence = 0;
            clearInterval(detectPositionTimer);

            if (isAuthenticPosition(positionTrail)) {
                lockPosition();
            }
            else {
                start();
                document.querySelector('#goTotroubleShoot').click();
            }

        }
    }

    function isAuthenticPosition(positionTrail) {
        let op = positionTrail.reduce((first, second) => {
            return {

                y: first.y - second.y,
                z: first.z - second.z
            }
        })
        if (op.y == 0 && op.z == 0) {
            return false;
        }
        else {
            return true;
        }

    }


    function cancelDownloadPrompt() {
        document.querySelector('.downloadPrompt').style.display = 'none';
    }

    document.querySelector('.downloadButton').addEventListener('click', downloadButtonClicked)
    function downloadButtonClicked() {
        deferredPrompt.prompt();
        deferredPrompt.userChoice
            .then(function (choiceResult) {
                if (choiceResult.outcome === 'accepted') {
                    cancelDownloadPrompt();
                    deferredPrompt = null;
                }
            })
    }

    function showDownloadPrompt() {
        document.querySelector('.downloadPrompt').style.display = 'grid';

    }

    var deferredPrompt;
    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        showDownloadPrompt();
    });

})