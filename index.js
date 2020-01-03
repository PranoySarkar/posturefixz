window.addEventListener('load', _ => {

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
    let delta = document.querySelector('#delta');
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
                    op.innerHTML = '';
                    if (xCheckbox.checked && Math.abs(event.alpha - lockedAxis.x) > Number.parseFloat(delta.value)) {
                        op.innerHTML = `Out Of posture by x`
                        window.navigator.vibrate([100]);
                    }
                    if (yCheckbox.checked && Math.abs(event.beta - lockedAxis.y) > Number.parseFloat(delta.value)) {
                        op.innerHTML += `Out Of posture by Y`
                        window.navigator.vibrate([200]);
                    }
                    if (zCheckbox.checked && Math.abs(event.gamma - lockedAxis.z) > Number.parseFloat(delta.value)) {
                        op.innerHTML += `Out Of posture by Z`
                        window.navigator.vibrate([200]);
                    }

                }
                else {
                    axe = event.alpha;
                    if (xCheckbox.checked) {
                        xDom.innerHTML = `X ${axe}`;
                    } else {
                        xDom.innerHTML = ''
                    }
                    ye = event.beta;
                    if (yCheckbox.checked) {
                        yDom.innerHTML = `Y ${ye}`;
                    }
                    else {
                        yDom.innerHTML = ''
                    }
                    zee = event.gamma;
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

    document.querySelector('#lockBtn').addEventListener('click', _ => {
        lockedAxis.x = axe;
        lockedAxis.y = ye;
        lockedAxis.z = zee;
        positionLocked = !positionLocked;
    })
})