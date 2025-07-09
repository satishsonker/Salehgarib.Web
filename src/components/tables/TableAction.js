import React, { memo, useMemo } from 'react'
import { common } from '../../utils/common';
import DeleteConfirmation from './DeleteConfirmation';

const TableAction = memo(({ option, dataId, data }) => {
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
    };

    // Process options once
    const processedOption = useMemo(() => {
        const opt = common.defaultIfEmpty(option, optionTemplatObject);
        return {
            ...opt,
            edit: { ...optionTemplatObject.edit, ...opt.edit },
            view: { ...optionTemplatObject.view, ...opt.view },
            delete: { ...optionTemplatObject.delete, ...opt.delete },
            print: { ...optionTemplatObject.print, ...opt.print },
            buttons: opt.buttons || []
        };
    }, [option]);

    return (
        <>
            <div className="table-actions d-flex align-items-center gap-3 fs-6">
                {processedOption.showPrint && (
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={() => processedOption.print.handler(dataId, data)}
                        className="text-success"
                        data-bs-placement="bottom"
                        title={processedOption.print.title}
                        data-toggle="tooltip"
                        aria-label={processedOption.print?.title}
                        data-bs-toggle={processedOption.print.modelId ? "modal" : ""}
                        data-bs-target={processedOption.print.modelId ? "#" + processedOption.print.modelId : ""}
                    >
                        <i className={processedOption.print.icon}></i>
                    </div>
                )}
                {processedOption.showView && (
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={() => processedOption.view.handler(dataId, data)}
                        className="text-primary"
                        data-bs-placement="bottom"
                        data-toggle="tooltip"
                        aria-label={processedOption.view?.title}
                        data-bs-toggle={processedOption.view.modelId ? "modal" : ""}
                        data-bs-target={processedOption.view.modelId ? "#" + processedOption.view.modelId : ""}
                    >
                        <i className={processedOption.view.icon}></i>
                    </div>
                )}
                {processedOption.showEdit && (
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={() => processedOption.edit.handler(dataId, data)}
                        className="text-warning"
                        data-bs-toggle="modal"
                        data-bs-target={"#" + (processedOption.edit.modelId || processedOption.popupModelId)}
                        title={processedOption.edit?.title}
                        data-toggle="tooltip"
                        data-bs-placement="bottom"
                        aria-label={processedOption.edit?.title}
                    >
                        <i className={processedOption.edit.icon}></i>
                    </div>
                )}
                {processedOption.showDelete && (
                    <div
                        style={{ cursor: "pointer" }}
                        data-bs-toggle="modal"
                        onClick={() => !processedOption.delete.showModel && processedOption.delete.handler(dataId, data)}
                        data-bs-target={processedOption.delete.showModel ? "#delete-confirm-model-" + dataId : ""}
                        className="text-danger"
                        data-bs-placement="bottom"
                        title={processedOption.delete.title}
                        data-toggle="tooltip"
                        aria-label={processedOption.delete?.title}
                    >
                        <i className={processedOption.delete.icon}></i>
                    </div>
                )}
                {processedOption.buttons.map((ele, index) => (
                    <div
                        key={index}
                        style={{ cursor: "pointer !important", ...ele?.style }}
                        data-bs-toggle={ele?.showModel ? 'modal' : ""}
                        onClick={() => ele.handler(dataId, data)}
                        data-bs-target={ele?.showModel ? '#' + ele.modelId : ""}
                        className={!ele.className ? "text-primary" : ele.className}
                        data-bs-placement="bottom"
                        title={typeof ele.title === 'function' ? ele.title(dataId, data) : ele.title}
                        data-toggle="tooltip"
                        aria-label={ele?.title}
                    >
                        <i className={typeof ele.icon === 'function' ? ele.icon(dataId, data) : ele.icon}></i>
                    </div>
                ))}
            </div>
            <DeleteConfirmation deleteHandler={processedOption.delete.handler} dataId={dataId} />
        </>
    );
});

export default TableAction;
