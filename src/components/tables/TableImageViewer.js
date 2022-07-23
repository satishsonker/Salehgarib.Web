import React,{useState,useEffect} from 'react'

export default function TableImageViewer({ imagePath, previousModelId }) {
    return (
        <div id="table-image-viewer" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Image Viewer</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-horizontal form-material">
                            <div className="card">
                                <div className="card-body">
                                    <img src={process.env.REACT_APP_API_URL + imagePath} style={{ width: "100%", maxHeight: "550px" }}></img>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger waves-effect" data-bs-target={"#" + previousModelId} data-bs-dismiss="modal">{previousModelId?.length > 0 ? "Back to Previous" : "Cancel"}</button>
                    </div>
                </div>
                {/* <!-- /.modal-content --> */}
            </div>
        </div>
    )
}
