import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { common } from '../../utils/common'
import ButtonBox from '../common/ButtonBox';
import './DeleteConfirmation.css';

export default function DeleteConfirmation({ deleteHandler, dataId, modelId, title, message, buttonText, cancelButtonText }) {
    deleteHandler = common.defaultIfEmpty(deleteHandler, () => { });
    dataId = common.defaultIfEmpty(dataId, 0);
    title = common.defaultIfEmpty(title, "Delete Confirmation");
    modelId = common.defaultIfEmpty(modelId, 'delete-confirm-model-' + dataId)
    message = common.defaultIfEmpty(message, "You want to delete! Are you sure?");
    buttonText = common.defaultIfEmpty(buttonText, "Delete");
    cancelButtonText = common.defaultIfEmpty(cancelButtonText, "Cancel");
    const modalRef = useRef(null);

    useEffect(() => {
        const modalElement = document.getElementById(modelId);
        if (!modalElement) return;

        const handleShow = () => {
            // Set very high z-index for modal and dialog to ensure it's above all overlays
            modalElement.style.zIndex = '99999';
            modalElement.style.position = 'fixed';
            const dialog = modalElement.querySelector('.modal-dialog');
            if (dialog) {
                dialog.style.zIndex = '100000';
            }
            // Find and update backdrop z-index - use multiple timeouts to catch backdrop creation
            const updateBackdrop = () => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach((backdrop, index) => {
                    // Set the last backdrop (for this modal) z-index lower than modal but still high
                    if (index === backdrops.length - 1) {
                        backdrop.style.zIndex = '99998';
                    }
                });
            };
            // Try multiple times to catch backdrop creation
            setTimeout(updateBackdrop, 10);
            setTimeout(updateBackdrop, 50);
            setTimeout(updateBackdrop, 100);
        };

        const handleHidden = () => {
            modalElement.style.zIndex = '';
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                if (backdrop.style.zIndex === '9998') {
                    backdrop.style.zIndex = '';
                }
            });
        };

        modalElement.addEventListener('shown.bs.modal', handleShow);
        modalElement.addEventListener('hidden.bs.modal', handleHidden);

        return () => {
            modalElement.removeEventListener('shown.bs.modal', handleShow);
            modalElement.removeEventListener('hidden.bs.modal', handleHidden);
        };
    }, [modelId]);

    const modalContent = (
        <div 
            ref={modalRef}
            id={modelId} 
            className="modal fade delete-confirmation-modal" 
            tabIndex="-1" 
            role="dialog" 
            aria-labelledby={modelId + 'Label'}
            aria-hidden="true" 
            data-bs-backdrop="static" 
            data-bs-keyboard="false"
            style={{ zIndex: 99999 }}
        >
            <div className="modal-dialog modal-dialog-centered">
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
    );

    // Render modal directly to body using portal to avoid stacking context issues
    return createPortal(modalContent, document.body);
}
