import React from 'react'
import { common } from '../../utils/common'

export default function DeleteConfirmation({deleteHandler,dataId,modelId}) {
    deleteHandler=common.defaultIfEmpty(deleteHandler,()=>{});
    dataId=common.defaultIfEmpty(dataId,0);
    modelId=common.defaultIfEmpty(modelId,'delete-confirm-model-'+dataId)
    return (
        <div id={modelId} className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby={modelId+'Label'} 
            aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"><i className='bi bi-trash-fill text-danger'></i> Delete Confirmation</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        <h4 className="modal-title" id={modelId+'Label'}></h4>
                    </div>
                    <div className="modal-body">
                      <h5>You want to delete! Are you sure?</h5>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={e=>deleteHandler(dataId)} className="btn btn-danger text-white waves-effect" data-bs-dismiss="modal">Delete</button>
                        <button type="button" className="btn btn-warning waves-effect" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div></div>
    )
}
