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
                if (targetObj[key] === null || targetObj[key] === undefined) {
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
    }
}

export { common };