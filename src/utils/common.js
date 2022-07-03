const common = {
    defaultIfEmpty: (input, defaultValue) => {
        if (input === undefined || input === null || input === "")
            return defaultValue;
        return input;
    },
    concatClassIfNotEmpty: (input, concatClass, condition) => {
        return condition ? `${input} ${concatClass}` : input;
    },
    formatTableData: (input) => {
        if (typeof input !== 'string')
            return input;
        var dateTimeRegex = /\d{2,4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}.?\d+/ig;
        if (input.match(dateTimeRegex) !== null)
            return input.match(/\d{2,4}-\d{1,2}-\d{1,2}/ig)[0];
        return input;
    },
    assignDefaultValue: (sourceObj, targetObj) => {
        if (typeof sourceObj === "object" && typeof targetObj === "object") {
            for (var key in sourceObj) {
                if (targetObj[key] === null || targetObj[key] === undefined || targetObj[key]==="0" || targetObj[key]==="") {
                    switch (typeof sourceObj[key]) {
                        case "number":
                            targetObj[key] = 0;
                            break;
                        case "boolean":
                            targetObj[key] = false;
                            break;
                        default:
                            targetObj[key] = sourceObj[key];
                            break;
                    }
                }
            }
        }
        return targetObj;
    },
    getLastDateOfMonth:(month,year)=>{
        let currentDate=new Date();
        month=typeof month==="number"?month:currentDate.getMonth();
        year=typeof year==="number"?year:currentDate.getFullYear();
        let lastDateOfMonth=new Date(`${year}-${month+2}-01`).setDate(-1);
        return new Date(lastDateOfMonth).toDateString();
    },
    getFirstDateOfMonth:(month,year)=>{
        let currentDate=new Date();
        month=typeof month==="number"?month:currentDate.getMonth();
        year=typeof year==="number"?year:currentDate.getFullYear();
        return new Date(`${year}-${month+1}-01`).toDateString();
    },
    getHtmlDate:(date)=>{
        if(typeof date!=="object")
        {
            date=new Date(date);
        }
        var month=(date.getMonth()+1).toString().padStart(2, '0');
        var day=(date.getDate()).toString().padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    },
    closePopup:()=>{
       const closeButton= document.getElementById('closePopup');
       closeButton.click();
    }
}

export { common };