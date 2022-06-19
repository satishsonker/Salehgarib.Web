const common={
    defaultIfEmpty: (input, defaultValue) => {
        if (input === undefined || input === null || input === "")
            return defaultValue;
        return input;
    },
    concatClassIfNotEmpty:(input,concatClass,condition)=>{
        return condition?`${input} ${concatClass}`:input;
    }
}

export { common };