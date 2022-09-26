const RegexFormat={
mobile:/^(?:\+971|00971|0)(?!2)((?:2|3|4|5|6|7|9|50|51|52|55|56)[0-9]{7,})$/gi,
dateTimeRegex:/\d{2,4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}.?\d+/ig,
dateRegex:/\d{2,4}-\d{1,2}-\d{1,2}/ig,
specialCharectors:/[^a-z]+/ig,
endWithHyphen:/_+$/ig,
digitOnly:/^[0-9]+$/
}

export default RegexFormat;