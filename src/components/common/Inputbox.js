import React from 'react'
import { common } from '../../utils/common'
import ErrorLabel from './ErrorLabel'
import Label from './Label'

export default function Inputbox({ labelText,isRequired,type,name,max,min,id,className,onChangeHandler,maxLength,errorMessage,showError,showLabel,value }) {
    labelText = common.defaultIfEmpty(labelText, "Label1");
    isRequired = common.defaultIfEmpty(isRequired, false);
    type = common.defaultIfEmpty(type, "text");
    name = common.defaultIfEmpty(name, "name1");
    max = common.defaultIfEmpty(max, 99999999);
    min = common.defaultIfEmpty(min, 0);
    id = common.defaultIfEmpty(id, "textbox1");
    className = common.defaultIfEmpty(min, 0);
    onChangeHandler = common.defaultIfEmpty(onChangeHandler, () => { });
    maxLength = common.defaultIfEmpty(maxLength, 150);
    errorMessage = common.defaultIfEmpty(errorMessage, undefined);
    showError = common.defaultIfEmpty(showError, true);
    showLabel = common.defaultIfEmpty(showLabel, true);
    value = common.defaultIfEmpty(value, "");
    return (
        <>
        {  showLabel &&  <Label text={labelText} isRequired={isRequired}></Label>}
            <input
                maxLength={maxLength}
                min={min}
                max={max}
                onChange={e => onChangeHandler(e)}
                name={name}
                value={value}
                type={type}
                id={id}
                className={"form-control " + className}
            />
       {showError &&     <ErrorLabel message={errorMessage}></ErrorLabel>}
       </>
    )
}
