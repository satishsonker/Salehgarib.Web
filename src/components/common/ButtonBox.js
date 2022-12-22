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
    modelDismiss
}) {
    btnList = common.defaultIfEmpty(btnList, []);
    type=common.defaultIfEmpty(type,"button");
    id=common.defaultIfEmpty(id,"");
    modelDismiss=common.defaultIfEmpty(modelDismiss,"");
    className=common.defaultIfEmpty(className,"");
    if(type.toLowerCase()==="save")
    {
        icon="bi bi-save";
        text="Save";
        className+=" btn-info";
    }
    if(type.toLowerCase()==="cancel")
    {
        icon="bi bi-x-square";
        text="Cancel";
        className+=" btn-danger";
    }
    if(type.toLowerCase()==="delete")
    {
        icon="bi bi-trash";
        text="Delete";
        className+=" btn-warning";
    }
    if(type.toLowerCase()==="update")
    {
        icon="bi bi-arrow-clockwise";
        text="Update";
        className+=" btn-success";
    }
    return (
        <>
            {btnList.length === 0 && <button 
            type={type} 
            id={id}
            onClick={e => onClickHandler(e)} 
            data-bs-dismiss={modelDismiss}
            className={'btn ' + className}><i className={icon}></i> {text}</button>}
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
                            className={'btn ' + ele.className}><i className={ele.icon}></i> {ele.text}</button>
                        })
                    }

                </div>
            }
        </>
    )
}
