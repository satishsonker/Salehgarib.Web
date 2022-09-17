import React from 'react'
import { common } from '../../utils/common';
import DeleteConfirmation from './DeleteConfirmation';

export default function TableAction({ option, dataId, data }) {
    const optionTemplatObject = {
        showView: true,
        showEdit: true,
        showDelete: true,
        showPrint: false,
        view: {
            title: "View",
            handler: () => { },
            icon: 'bi bi-eye-fill'
        },
        edit: {
            title: "Edit",
            handler: () => { },
            icon: 'bi bi-pencil-fill'
        },
        delete: {
            title: "Delete",
            handler: () => { },
            icon: 'bi bi-trash-fill',
            showModel: true
        },
        print: {
            title: "Print",
            handler: () => { },
            icon: 'bi bi-printer'
        },
        popupModelId: 'model',
        buttons: []
    }
    option = common.defaultIfEmpty(option, optionTemplatObject);
    option.edit = Object.assign(optionTemplatObject.edit, option.edit);
    option.view = Object.assign(optionTemplatObject.view, option.view);
    option.delete = Object.assign(optionTemplatObject.delete, option.delete);
    option.print = Object.assign(optionTemplatObject.print, option.print);
    option.buttons = Object.assign(optionTemplatObject.buttons, option.buttons);
    dataId = common.defaultIfEmpty(dataId, 0);
    option = Object.assign(optionTemplatObject, option);
    return (
        <>
            <div className="table-actions d-flex align-items-center gap-3 fs-6">
                {option.showPrint && <div style={{ cursor: "pointer" }} onClick={e => option.print.handler(dataId, data)} className="text-success" data-bs-placement="bottom" title={option.print.title} data-bs-original-title={option.print.title} aria-label={option.print?.title}><i className={option.print.icon}></i></div>}
                {option.showView && <div style={{ cursor: "pointer" }} onClick={e => option.view.handler(dataId, data)} className="text-primary" data-bs-placement="bottom" title={option.view?.title} data-bs-original-title={option.view?.title} aria-label={option.view?.title} data-bs-toggle="modal" data-bs-target={"#" + (option.view.modelId === undefined ? "" : option.view.modelId)}><i className={option.view.icon}></i></div>}
                {option.showEdit && <div style={{ cursor: "pointer" }} onClick={e => option.edit.handler(dataId, data)} className="text-warning" data-bs-toggle="modal" data-bs-target={"#" + (option.edit.modelId === undefined ? option.popupModelId : option.edit.modelId)} data-bs-placement="bottom" title={option.edit.title} data-bs-original-title={option.edit.title} aria-label={option.edit?.title}><i className={option.edit.icon}></i></div>}
                {option.showDelete && <div style={{ cursor: "pointer" }} data-bs-toggle="modal" onClick={e => !option.delete.showModel ? option.delete.handler(dataId, data) : () => { }} data-bs-target={option.delete.showModel ? "#delete-confirm-model-" + dataId : ""} className="text-danger" data-bs-placement="bottom" title={option.delete.title} data-bs-original-title={option.delete.title} aria-label={option.delete?.title}><i className={option.delete.icon}></i></div>}
                {
                    option.buttons?.map((ele, index) => {
                        return <div key={index} style={{ cursor: "pointer !important" }}
                            data-bs-toggle="modal"
                            onClick={e => ele.handler(dataId, data)}
                            data-bs-target={ele?.showModel ? '#'+ele.modelId : ""}
                            className={!ele.className?"text-primary":ele.className}
                            data-bs-placement="bottom"
                            title={ele?.title}
                            data-bs-original-title={ele?.title}
                            aria-label={ele?.title}>
                            <i className={ele.icon}></i>
                        </div>
                    })
                }
            </div>
            <DeleteConfirmation deleteHandler={option.delete.handler} dataId={dataId} ></DeleteConfirmation>
        </>
    )
}
