import React, { useState } from 'react'
import { common } from '../../utils/common'
import ButtonBox from './ButtonBox';
import InputBox from './Inputbox';
import ErrorLabel from './ErrorLabel';
import Label from './Label';

export default function InputModelBox({ handler, note,textboxType, dataId, message, buttonType, modelId, title, buttonText, cancelButtonText, labelText, isInputRequired = true }) {
    handler = common.defaultIfEmpty(handler, () => { });
    dataId = common.defaultIfEmpty(dataId, 0);
    title = common.defaultIfEmpty(title, "Input reason");
    modelId = common.defaultIfEmpty(modelId, 'input-model-' + dataId)
    message = common.defaultIfEmpty(message, "You want to delete! Are you sure?");
    buttonText = common.defaultIfEmpty(buttonText, "Delete");
    buttonType = common.defaultIfEmpty(buttonType, "delete"); 
    textboxType = common.defaultIfEmpty(textboxType, "text");
    cancelButtonText = common.defaultIfEmpty(cancelButtonText, "Cancel");
    const [inputValue, setInputValue] = useState("");
    const [errors, setErrors] = useState({});
    const clickHandler = () => {
        if (!isInputRequired)
            handler(dataId, inputValue);
        else {
            if (!inputValue || inputValue === "") {
                setErrors({ inputValue: "Please enter the reason!" });
                return;
            }
            setErrors({});
            document.getElementById('modelCancelButton').click();
            handler(dataId, inputValue);
        }
    }
    return (
        <div id={modelId} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby={modelId + 'Label'}
            aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"><i className='bi bi-trash-fill text-danger'></i> {title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>

                    </div>
                    <div className="modal-body">
                        <h5>{message}</h5>
                        <InputBox labelText={labelText} type={textboxType} errorMessage={errors.inputValue} isRequired={isInputRequired} maxLength={70} value={inputValue} onChangeHandler={(e) => { setInputValue(e.target.value) }} />
                        <div style={{ fontSize: '11px' }} className="text-danger my-2">{note}</div>
                    </div>
                    <div className="modal-footer">
                        <ButtonBox type={buttonType} className="btn-sm" onClickHandler={clickHandler} text={buttonText} />
                        <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" id="modelCancelButton" />
                    </div>
                </div>
            </div></div>
    )
}
