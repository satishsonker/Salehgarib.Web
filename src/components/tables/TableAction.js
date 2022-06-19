import React from 'react'
import { common } from '../../utils/common';

export default function TableAction({option}) {
    const optionTemplatObject={
        showView:true,
        showEdit:true,
        showDelete:true,
        view:{
            title:"View",
            handler:()=>{},
            icon:'bi bi-eye-fill'
        },
        edit:{
            title:"Edit",
            handler:()=>{},
            icon:'bi bi-pencil-fill'
        },
        delete:{
            title:"Delete",
            handler:()=>{},
            icon:'bi bi-trash-fill'
        }
    }
    option = common.defaultIfEmpty(option,optionTemplatObject  );
    option.edit=Object.assign(optionTemplatObject.edit,option.edit);
    option.view=Object.assign(optionTemplatObject.view,option.view);
    option.delete=Object.assign(optionTemplatObject.delete,option.delete);
option=Object.assign(optionTemplatObject,option);
    return (
        <>
            <div className="table-actions d-flex align-items-center gap-3 fs-6">
               { option.showView && <a href="#" onClick={option.view.handler()} className="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title={option.view.title} aria-label={option.view.title}><i className={option.view.icon}></i></a>} 
               { option.showEdit && <a href="#" onClick={option.edit.handler()} className="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title={option.edit.title} aria-label={option.edit.title}><i className={option.edit.icon}></i></a>} 
               { option.showDelete && <a href="#" onClick={option.delete.handler()} className="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title={option.delete.title} aria-label={option.delete.title}><i className={option.delete.icon}></i></a>} 
               </div>
        </>
    )
}
