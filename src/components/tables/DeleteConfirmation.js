import React from 'react'
import { common } from '../../utils/common'
import ButtonBox from '../common/ButtonBox';

export default function DeleteConfirmation({ deleteHandler, dataId, modelId, title, message, buttonText, cancelButtonText }) {
    deleteHandler = common.defaultIfEmpty(deleteHandler, () => { });
    dataId = common.defaultIfEmpty(dataId, 0);
    title = common.defaultIfEmpty(title, "Delete Confirmation");
    modelId = common.defaultIfEmpty(modelId, 'delete-confirm-model-' + dataId)
    message = common.defaultIfEmpty(message, "You want to delete! Are you sure?");
    buttonText = common.defaultIfEmpty(buttonText, "Delete");
    cancelButtonText = common.defaultIfEmpty(cancelButtonText, "Cancel");

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
                    </div>
                    <div className="modal-footer">
                        <ButtonBox type="delete" onClickHandler={()=>{deleteHandler(dataId)}} modelDismiss={true} text={buttonText} className="btn-sm"/>
                        <ButtonBox type="cancel" className="btn-sm" modelDismiss={true} text={cancelButtonText}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
