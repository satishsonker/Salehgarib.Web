import React,{useState} from 'react'
import { common } from '../../utils/common'
import ErrorLabel from './ErrorLabel';
import Label from './Label';

export default function InputModelBox({handler,dataId,message,modelId,title,buttonText,cancelButtonText,labelText,isInputRequired=true}) {
    handler=common.defaultIfEmpty(handler,()=>{});
    dataId=common.defaultIfEmpty(dataId,0);
    title=common.defaultIfEmpty(title,"Input reason");
    modelId=common.defaultIfEmpty(modelId,'input-model-'+dataId)
    message=common.defaultIfEmpty(message,"You want to delete! Are you sure?");
    buttonText=common.defaultIfEmpty(buttonText,"Delete");
    cancelButtonText=common.defaultIfEmpty(cancelButtonText,"Cancel");
    const [inputValue, setInputValue] = useState("");
    const [errors, setErrors] = useState({});  
    const clickHandler=()=>{
        if(!isInputRequired)
        handler(dataId,inputValue);
        else{
            if(!inputValue || inputValue === "")
            {
                setErrors({inputValue:"Please enter the reason!"});
                return;
            } 
            setErrors({});
            handler(dataId,inputValue);
            document.getElementById('modelCancelButton').click();
        }
    }
    return (
        <div id={modelId} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby={modelId+'Label'} 
            aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"><i className='bi bi-trash-fill text-danger'></i> {title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                       
                    </div>
                    <div className="modal-body">
                        <h5>{message}</h5>
                     <Label isRequired={isInputRequired} text={labelText}/>
                     <input className='form-control' type="text" maxLength={70} value={inputValue} onChange={e=>setInputValue(e.target.value)}></input>
                     <ErrorLabel message={errors.inputValue}></ErrorLabel>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={e=>handler(dataId,inputValue)} className="btn btn-danger text-white waves-effect">{buttonText}</button>
                        <button type="button" id='modelCancelButton' className="btn btn-warning waves-effect" data-bs-dismiss="modal">{cancelButtonText}</button>
                    </div>
                </div>
            </div></div>
    )
}
