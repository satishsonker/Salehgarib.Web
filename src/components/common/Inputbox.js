import React,{useState} from 'react'
import { common } from '../../utils/common'
import ErrorLabel from './ErrorLabel'
import Label from './Label'

export default function Inputbox({ labelText, isRequired, type, name, labelTextHelp, max, min, id, className, onChangeHandler, maxLength, errorMessage, showError, showLabel, value, placeholder, disabled,
    labelFontSize, overrideClass, onChangeHandlerData, checked, style, onBlur,onFocus, title, disableTitle }) {
    const [viewPassword, setViewPassword] = useState(false);
    labelText = common.defaultIfEmpty(labelText, "Label1");
    isRequired = common.defaultIfEmpty(isRequired, false);
    type = common.defaultIfEmpty(type, "text");
    name = common.defaultIfEmpty(name, "name1");
    max = common.defaultIfEmpty(max, 99999999);
    min = common.defaultIfEmpty(min, 0);
    id = common.defaultIfEmpty(id, "textbox1");
    className = common.defaultIfEmpty(className, '');
    onChangeHandler = common.defaultIfEmpty(onChangeHandler, () => { });
    onBlur = common.defaultIfEmpty(onBlur, () => { });
    onFocus = common.defaultIfEmpty(onFocus, () => { });
    onChangeHandlerData = common.defaultIfEmpty(onChangeHandlerData, undefined);
    maxLength = common.defaultIfEmpty(maxLength, 150);
    errorMessage = common.defaultIfEmpty(errorMessage, undefined);
    showError = common.defaultIfEmpty(showError, true);
    showLabel = common.defaultIfEmpty(showLabel, true);
    value = common.defaultIfEmpty(value, "");
    placeholder = common.defaultIfEmpty(placeholder, "");
    disabled = common.defaultIfEmpty(disabled, false);
    checked = common.defaultIfEmpty(checked, false);
    labelFontSize = common.defaultIfEmpty(labelFontSize, "12px");
    overrideClass = common.defaultIfEmpty(overrideClass, false);
    labelTextHelp = common.defaultIfEmpty(labelTextHelp, "");
    disableTitle = common.defaultIfEmpty(disableTitle, true);
    title = common.defaultIfEmpty(title, "");
    style = common.defaultIfEmpty(style, {});
    style = common.defaultIfEmpty(style, {});
    return (
        <>
            {showLabel && <Label text={labelText} helpText={labelTextHelp} fontSize={labelFontSize} isRequired={isRequired}></Label>}
            <div style={{position:'relative'}}>
            <input
                maxLength={maxLength}
                min={min}
                max={max}
                onChange={e => onChangeHandler(e, onChangeHandlerData)}
                name={name}
                value={value}
                type={viewPassword?"text": type}
                id={id}
                className={overrideClass ? className : "form-control " + className}
                placeholder={placeholder}
                disabled={disabled ? "disabled" : ""}
                checked={checked}
                style={style}
                onBlur={e => onBlur(e)}
                onFocus={e => onFocus(e)}
                data-toggle={disableTitle?"": "tooltip"}
                title={title}
            />
             {type==="password" && <i style={{position: 'absolute',right: '9px',top: '5px'}} className={!viewPassword? 'bi bi-eye-fill':'bi bi-eye-slash-fill'} onClick={e=>{setViewPassword(p=>!viewPassword)}}></i>}
            </div>
          
            {showError && <ErrorLabel message={errorMessage}></ErrorLabel>}
        </>
    )
}
