var Settings = {

    initIfNot: () => {
        if(localStorage.getItem('settings')==undefined){
            localStorage.setItem('settings', '{}')
        }
       
    },
    getSensitivity:()=>{
        let settings= JSON.parse(localStorage.getItem('settings'));
        return settings.sensitivity || 4;
    },
    setSensitivity:(sensitivity)=>{
        let settings= JSON.parse(localStorage.getItem('settings'));
        settings.sensitivity=sensitivity;
        localStorage.setItem('settings', JSON.stringify(settings))
    }
}
