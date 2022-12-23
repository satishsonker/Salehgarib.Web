import React from 'react'
import { common } from '../../utils/common'

export default function ButtonBox({
    text,
    onClickHandler,
    className,
    btnList,
    icon,
    type,
    id,
    modelDismiss,
    modalId
}) {
    btnList = common.defaultIfEmpty(btnList, []);
    type=common.defaultIfEmpty(type,"button");
    id=common.defaultIfEmpty(id,"");
    text=common.defaultIfEmpty(text,"");
    modelDismiss=common.defaultIfEmpty(modelDismiss,false); 
    modalId=common.defaultIfEmpty(modalId,"");
    className=common.defaultIfEmpty(className,"");
    onClickHandler=common.defaultIfEmpty(onClickHandler,()=>{});
    if(type.toLowerCase()==="save")
    {
        icon="bi bi-save";
        text=text===""?"Save":text;
        className+=" btn-info";
    }
    if(type.toLowerCase()==="cancel")
    {
        icon="bi bi-x-square";
        text=text===""?"Cancel":text;
        className+=" btn-danger";
    }
    if(type.toLowerCase()==="delete")
    {
        icon="bi bi-trash";
        text=text===""?"Delete":text;;
        className+=" btn-warning";
    }
    if(type.toLowerCase()==="update")
    {
        icon="bi bi-arrow-clockwise";
        text=text===""?"Update":text;;
        className+=" btn-success";
    }
    return (
        <>
            {btnList.length === 0 && <button 
            type={type} 
            id={id}
            onClick={e => onClickHandler(e)} 
            data-bs-dismiss={modelDismiss?"modal":""}
            className={'btn ' + className}
            data-bs-toggle={modalId===""?"":"modal"} 
            data-bs-target={modalId===""?"":modalId}><i className={icon}></i> {text}</button>}
            {btnList.length > 0 &&
                <div className="btn-group" role="group" aria-label="Basic example">
                    {
                        btnList.map((ele,index) => {
                            return <button 
                            key={index} 
                            type={type} 
                            id={id}
                            onClick={e => ele.onClickHandler(e)} 
                            data-bs-dismiss={modelDismiss}
                            className={'btn ' + ele.className}
                            data-bs-toggle={ele.modalId===""?"":"modal"} 
                            data-bs-target={ele.modalId===""?"":ele.modalId}
                            ><i className={ele.icon}></i> {ele.text}</button>
                        })
                    }

                </div>
            }
        </>
    )
}
