import React from 'react'
import { common } from '../../utils/common';
import DeleteConfirmation from './DeleteConfirmation';

export default function TableAction({ option, dataId }) {
    const optionTemplatObject = {
        showView: true,
        showEdit: true,
        showDelete: true,
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
            icon: 'bi bi-trash-fill'
        }
    }
    option = common.defaultIfEmpty(option, optionTemplatObject);
    option.edit = Object.assign(optionTemplatObject.edit, option.edit);
    option.view = Object.assign(optionTemplatObject.view, option.view);
    option.delete = Object.assign(optionTemplatObject.delete, option.delete);
    dataId = common.defaultIfEmpty(dataId, 0);
    option = Object.assign(optionTemplatObject, option);
    return (
        <>
            <div className="table-actions d-flex align-items-center gap-3 fs-6">
                {option.showView && <a href="#" onClick={e => option.view.handler()} className="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title={option.view.title} aria-label={option.view.title}><i className={option.view.icon}></i></a>}
                {option.showEdit && <div className="text-warning" data-bs-toggle="modal" data-bs-target={"#add-customer"} data-bs-placement="bottom" title="" data-bs-original-title={option.edit.title} aria-label={option.edit.title}><i className={option.edit.icon}></i></div>}
                {option.showDelete && <a href="#" data-bs-toggle="modal" data-bs-target={"#delete-confirm-model-"+dataId} className="text-danger" data-bs-placement="bottom" title="" data-bs-original-title={option.delete.title} aria-label={option.delete.title}><i className={option.delete.icon}></i></a>}
            </div>
            <DeleteConfirmation deleteHandler={option.delete.handler} dataId={dataId} ></DeleteConfirmation>
        </>
    )
}
