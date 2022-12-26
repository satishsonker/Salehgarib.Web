import React from 'react'
import { common } from '../../utils/common'

export default function ButtonBox({
    text,
    onClickHandler,
    onClickHandlerData,
    className,
    btnList,
    icon,
    type,
    id,
    modelDismiss,
    modalId
}) {
    btnList = common.defaultIfEmpty(btnList, []);
    type = common.defaultIfEmpty(type, "button");
    id = common.defaultIfEmpty(id, "");
    text = common.defaultIfEmpty(text, "");
    modelDismiss = common.defaultIfEmpty(modelDismiss, false);
    modalId = common.defaultIfEmpty(modalId, "");
    className = common.defaultIfEmpty(className, "");
    onClickHandler = common.defaultIfEmpty(onClickHandler, () => { });
    var modifiedData = modifyOnType(type, text, className);
    text = modifiedData.text;
    className = modifiedData.className;
    icon = modifiedData.icon;
    btnList.forEach(res=>{
        var typeData=modifyOnType(res.type, res.text, res.className);
        res.text=typeData.text;
        res.className=typeData.className;
        res.icon=typeData.icon;
    });
    return (
        <>
            {btnList.length === 0 && <button
                type={type}
                id={id}
                onClick={e => onClickHandler(e, onClickHandlerData)}
                data-bs-dismiss={modelDismiss ? "modal" : ""}
                className={'btn ' + className}
                data-bs-toggle={modalId === "" ? "" : "modal"}
                data-bs-target={modalId === "" ? "" : modalId}><i className={icon}></i> {text}</button>}
            {btnList.length > 0 &&
                <div className="btn-group" role="group" aria-label="Basic example">
                    {
                        btnList.map((ele, index) => {
                            return <button
                                key={index}
                                type={type}
                                id={id}
                                onClick={e => ele.onClickHandler(e)}
                                data-bs-dismiss={modelDismiss}
                                className={'btn ' + ele.className}
                                data-bs-toggle={ele.modalId === "" ? "" : "modal"}
                                data-bs-target={ele.modalId === "" ? "" : ele.modalId}
                            ><i className={ele.icon}></i> {ele.text}</button>
                        })
                    }

                </div>
            }
        </>
    )
}

const modifyOnType = (type, text, className) => {
    type=common.defaultIfEmpty(type,"")
    text=common.defaultIfEmpty(text,""); 
    className=common.defaultIfEmpty(className,"");

    if (type.toLowerCase() === "save") {
        return {
            icon: "bi bi-save",
            text: text === "" ? "Save" : text,
            className: className += " btn-info"
        }
    }
    if (type.toLowerCase() === "cancel") {
        return {
            icon: "bi bi-x-square",
            text: text === "" ? "Cancel" : text,
            className: className += " btn-danger"
        }
    }
    if (type.toLowerCase() === "delete") {
        return {
            icon: "bi bi-trash",
            text: text === "" ? "Delete" : text,
            className: className += " btn-warning"
        }
    }
    if (type.toLowerCase() === "update") {
        return {
            icon: "bi bi-arrow-clockwise",
            text: text === "" ? "Update" : text,
            className: className += " btn-success"
        }
    }
    if (type.toLowerCase() === "print") {
        return {
            icon: "bi bi-printer",
            text: text === "" ? "Print" : text,
            className: className += " btn-warning"
        }
    }
    if (type.toLowerCase() === "go") {
        return {
            icon: "bi bi-arrow-left-circle",
            text: text === "" ? "Go" : text,
            className: className += " btn-success"
        }
    }
    return {
        text,className
    }
}