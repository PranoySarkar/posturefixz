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
    },
    getMaxScore:()=>{
        let settings= JSON.parse(localStorage.getItem('settings'));
        return settings.maxScore || 0;
    },
    setMaxScore:(maxScore)=>{
        let settings= JSON.parse(localStorage.getItem('settings'));
        settings.maxScore=maxScore;
        localStorage.setItem('settings', JSON.stringify(settings))
    },
}
