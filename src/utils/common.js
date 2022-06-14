const common={
    defaultIfEmpty: (input, defaultValue) => {
        if (input === undefined || input === null || input === "")
            return defaultValue;
        return input;
    }
}

export { common };