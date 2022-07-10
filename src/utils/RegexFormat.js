const RegexFormat={
mobile:/\+?\d{10,13}/gi,
dateTimeRegex:/\d{2,4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}.?\d+/ig,
dateRegex:/\d{2,4}-\d{1,2}-\d{1,2}/ig,
specialCharectors:/[^a-z]+/ig,
endWithHyphen:/_+$/ig
}

export default RegexFormat;