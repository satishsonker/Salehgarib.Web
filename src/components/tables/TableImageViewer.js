import React, { memo } from 'react'
import { common } from '../../utils/common'

const TableImageViewer = memo(({ imagePath, previousModelId, modelId = 'table-image-viewer' }) => {
    if (!imagePath) return null;

    return (
        <div 
            id={modelId} 
            className="modal fade in" 
            tabIndex="-1" 
            data-bs-backdrop="static" 
            data-bs-keyboard="false" 
            role="dialog" 
            aria-labelledby={`${modelId}Label`} 
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Image Viewer</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            data-bs-target={previousModelId ? `#${previousModelId}` : ''} 
                            data-bs-toggle="modal" 
                            data-bs-dismiss="modal" 
                            aria-hidden="true"
                        />
                    </div>
                    <div className="modal-body">
                        <div className="form-horizontal form-material">
                            <div className="card">
                                <div className="card-body">
                                    <img 
                                        src={`${process.env.REACT_APP_API_URL}${imagePath}`}
                                        style={{ width: "100%", maxHeight: "550px" }} 
                                        alt="design sample"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-danger waves-effect" 
                            data-bs-target={previousModelId ? `#${previousModelId}` : ''} 
                            data-bs-toggle="modal" 
                            data-bs-dismiss="modal"
                        >
                            {previousModelId ? "Back to Previous" : "Cancel"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

TableImageViewer.displayName = 'TableImageViewer';

export default TableImageViewer;
