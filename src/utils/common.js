import RegexFormat from "./RegexFormat";
const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];


const common = {
    defaultIfEmpty: (input, defaultValue) => {
        if (input === undefined || input === null || input === "")
            return defaultValue;
        return input;
    },
    concatClassIfNotEmpty: (input, concatClass, condition) => {
        return condition ? `${input} ${concatClass}` : input;
    },
    formatTableData: (input, action) => {
        var returnVal='';
        if (typeof input === 'boolean') {
            returnVal = input.toString();
            if (action?.replace) {

                for (var key in action.replace) {
                    if (key.toLocaleLowerCase() === returnVal.toLocaleLowerCase())
                        returnVal = action.replace[key];
                }
            }
            return returnVal;
        }
        if (typeof input === 'number') {
            returnVal = input.toString();
            if (action?.decimal) {
                returnVal = parseFloat(input).toFixed(2);
            }
            if (action?.currency) {
                returnVal = returnVal + ' ' + action.currency
            }
            return returnVal;
        }

        if (typeof input !== 'string')
            return input;

        if (action?.image) {
            if (input === undefined || input === "")
                return "No Image";
            return <img style={{ height: "40px", width: "40px", cursor: "pointer" }} src={process.env.REACT_APP_API_URL + input} data-bs-toggle="modal" data-bs-target="#table-image-viewer"></img>
        }
        if (input === common.defaultDate) {
           return returnVal
        }
        if (input.match(RegexFormat.dateTimeRegex) !== null)
            return input.match(RegexFormat.dateRegex)[0];
        return input;
    },
    assignDefaultValue: (sourceObj, targetObj) => {
        if (typeof sourceObj === "object" && typeof targetObj === "object") {
            for (var key in sourceObj) {
                if (targetObj[key] === null || targetObj[key] === undefined || targetObj[key] === "0" || targetObj[key] === "") {
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
    getLastDateOfMonth: (month, year) => {
        let currentDate = new Date();
        month = typeof month === "number" ? month : currentDate.getMonth() + 1;
        year = typeof year === "number" ? year : currentDate.getFullYear();
        let lastDateOfMonth = new Date(`${year}-${month + 1}-01`).setDate(-1);
        return new Date(lastDateOfMonth).toDateString();
    },
    getFirstDateOfMonth: (month, year) => {
        let currentDate = new Date();
        month = typeof month === "number" ? month : currentDate.getMonth();
        year = typeof year === "number" ? year : currentDate.getFullYear();
        return new Date(`${year}-${month + 1}-01`).toDateString();
    },
    daysInMonth: (month, year) => {
        return new Date(year, month, 0).getDate();
    },
    getHtmlDate: (date) => {
        if (typeof date !== "object") {
            date = new Date(date);
        }
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = (date.getDate()).toString().padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    },
    closePopup: (closeButonId) => {
        closeButonId=closeButonId===undefined || closeButonId===''?'closePopup':closeButonId;
        const closeButton = document.getElementById(closeButonId);
        closeButton.click();
    },
    numberRanger: (start, end) => {
        var range = []
        if (isNaN(start) || isNaN(end))
            return range;
        for (let index = start; index <= end; index++) {
            range.push(index);
        }
        return range;
    },
    monthList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    defaultIfIsNaN: (input, defaultValue = 0) => {
        return isNaN(input) ? defaultValue : input;
    },
    getDaysInMonth: (year, month) => {
        return new Date(year, month, 0).getDate();
    },
    toUpperCase: (e) => {
        e.target.value = e.target.value.toUpperCase();
    },
    throttling: (callback, wait, args) => {
        var timer = setTimeout(() => {
            callback(args);
            timer = undefined;
        }, wait);
        if (timer)
            return;
    },
    calculateVAT: (amount, vat) => {
        let vatAmount = (amount / 100) * vat;
        let totalAmount = vatAmount + amount;
        return { vatAmount, amountWithVat: totalAmount }
    },
    printDecimal: (number) => {
        number = parseFloat(number);
        if (isNaN(number)) return 0.00
        return number.toFixed(2);

    },
    cloneObject: (obj) => {
        if(obj===undefined || obj===null)
        return  obj;
        return JSON.parse(JSON.stringify(obj));
    },
    defaultDate:"0001-01-01T00:00:00",
    inWords:(num)=> {
        debugger;
        num=isNaN(parseFloat(num))?0:parseFloat(num);
        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lac ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
        return str;
    }
    
}

export { common };