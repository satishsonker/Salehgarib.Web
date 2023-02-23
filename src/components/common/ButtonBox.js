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
    modalId,
    disabled,
    style
}) {
    btnList = common.defaultIfEmpty(btnList, []);
    type = common.defaultIfEmpty(type, "button");
    id = common.defaultIfEmpty(id, "");
    text = common.defaultIfEmpty(text, "");
    modelDismiss = common.defaultIfEmpty(modelDismiss, false);
    modalId = common.defaultIfEmpty(modalId, "");
    className = common.defaultIfEmpty(className, "");
    onClickHandler = common.defaultIfEmpty(onClickHandler, () => { });
    var modifiedData = modifyOnType(type, text, className,icon);
    text = modifiedData.text;
    className = modifiedData.className;
    disabled = common.defaultIfEmpty(disabled, false);
    icon = modifiedData.icon;
    btnList.forEach(res => {
        var typeData = modifyOnType(res.type, res.text, res.className,res.icon);
        res.text = typeData.text;
        res.className = typeData.className;
        res.icon = typeData.icon;
    });
    return (
        <>
            {btnList.length === 0 && <button
                type={type}
                id={id}
                onClick={e => onClickHandler(e, onClickHandlerData)}
                disabled={disabled?"disabled":""}
                data-bs-dismiss={modelDismiss ? "modal" : ""}
                className={'btn ' + className}
                data-bs-toggle={modalId === "" ? "" : "modal"}
                data-bs-target={modalId === "" ? "" : modalId} style={style}><i className={icon}></i> {text}</button>}

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

const modifyOnType = (type, text, className,icon) => {
    type = common.defaultIfEmpty(type, "")
    text = common.defaultIfEmpty(text, "");
    icon = common.defaultIfEmpty(icon, "");
    className = common.defaultIfEmpty(className, "");

    if (type.toLowerCase() === "save") {
        return {
            icon: icon===""?"bi bi-save":icon,
            text: text === "" ? "Save" : text,
            className: className += " btn-info"
        }
    }
    if (type.toLowerCase() === "cancel") {
        return {
            icon:icon===""?"bi bi-x-square":icon,
            text: text === "" ? "Cancel" : text,
            className: className += " btn-danger"
        }
    }
    if (type.toLowerCase() === "delete") {
        return {
            icon: icon===""?"bi bi-trash":icon,
            text: text === "" ? "Delete" : text,
            className: className += " btn-warning"
        }
    }
    if (type.toLowerCase() === "update") {
        return {
            icon: icon===""?"bi bi-arrow-clockwise":icon,
            text: text === "" ? "Update" : text,
            className: className += " btn-warning"
        }
    }
    if (type.toLowerCase() === "reset") {
        return {
            icon: icon===""?"bi bi-arrow-clockwise":icon,
            text: text === "" ? "Reset" : text,
            className: className += " btn-success"
        }
    }
    if (type.toLowerCase() === "upload") {
        return {
            icon: icon===""?"bi bi-cloud-arrow-up":icon,
            text: text === "" ? "Upload" : text,
            className: className += " btn-warning"
        }
    }
    if (type.toLowerCase() === "print") {
        return {
            icon: icon===""?"bi bi-printer":icon,
            text: text === "" ? "Print" : text,
            className: className += " btn-warning"
        }
    }
    if (type.toLowerCase() === "go") {
        return {
            icon: icon===""?"bi bi-arrow-left-circle":icon,
            text: text === "" ? "Go" : text,
            className: className += " btn-success"
        }
    }
    if (type.toLowerCase() === "back") {
        return {
            icon: icon===""?"bi bi-arrow-left":icon,
            text: text === "" ? "Back" : text,
            className: className += " btn-secondary"
        }
    }
    if (type.toLowerCase() === "add") {
        return {
            icon: icon===""?"bi bi-cloud-plus":icon,
            text: text === "" ? "Add" : text,
            className: className += " btn-info"
        }
    }
    if (type.toLowerCase() === "view") {
        return {
            icon: icon===""?"bi bi-eye":icon,
            text: text === "" ? "View" : text,
            className: className += " btn-primary"
        }
    }
    return {
        text, className,icon
    }
}