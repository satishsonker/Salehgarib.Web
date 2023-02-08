import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import ButtonBox from '../common/ButtonBox';

export default function KandooraPicturePopup({ orderDetail }) {
    const [unstitchedfileModel, setUnstitchedFileModel] = useState({});
    const [stitchedfileModel, setStitchedFileModel] = useState({});
    const [unstitchedfile, setUnstitchedfile] = useState("");
    const [stitchedfile, setStitchedfile] = useState("");
    useEffect(() => {
        if (orderDetail === undefined || orderDetail?.id === undefined || orderDetail?.id === 0)
            return;
        Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `1?moduleIds=${orderDetail?.id}`)
            .then(res => {
                if (res.data.length > 0) {

                    res.data.forEach(ele => {
                        ele.filePath = process.env.REACT_APP_API_URL + ele.filePath;
                        if (ele.remark === 'stitched') {
                            setStitchedFileModel(ele);
                        }
                        if (ele.remark === 'unstitched') {
                            setUnstitchedFileModel(ele);
                        }
                    });
                }
                else {
                    setStitchedFileModel({});
                    setUnstitchedFileModel({});
                }
            })
    }, [orderDetail?.id])
    const setFiles=(file,type)=>{
        if(type==='stitched')
        {
            setStitchedfile(file);
        }
        else
        {
            setUnstitchedfile(file);
        }
    }

    const handleSave = (e, fileType) => {
        e.preventDefault();
        var formData = new FormData();
        let data = {
            file: fileType === 'stitched' ? stitchedfile : unstitchedfile,
            moduleId: orderDetail?.id,
            moduleName: 1,
            remark: fileType
        }
        for (var key in data) {
            if (key === 'file' && data?.file) {
                formData.append(key, data[key][0], data[key][0].name);
            }
            else
                formData.append(key, data[key]);
        }
        Api.FileUploadPut(apiUrls.fileStorageController.uploadFile, formData).then(res => {
            if (res.data.id > 0) {
                common.closePopup();
                toast.success(toastMessage.saveSuccess);
                var modal={
                    filePath:process.env.REACT_APP_API_URL+res.data?.filePath
                }
                if(fileType==='stitched'){
                setStitchedfile('');
                setStitchedFileModel({...modal});
                }
                else{
                setUnstitchedfile('');
                setUnstitchedFileModel({...modal});
                }
            }
        }).catch(err => {
            if (err?.response?.data?.errors?.File[0] !== undefined) {
                toast.error(err?.response?.data?.errors?.File[0]);
                return;
            }
            toast.error(toastMessage.saveError);
        });
    }
    return (
        <>
            <div className="modal fade" id="kandoora-photo-popup-model" tabIndex="-1" aria-labelledby="kandoora-photo-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="kandoora-photo-popup-model-label">Update Kandoora Image</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div><h5>Kandoora No. : {orderDetail?.orderNo}</h5></div>
                            <br />
                            <div className='row'>
                                <div className='col-6'>
                                    <div className="card">
                                        <img
                                            style={{
                                                width: '100%',
                                                border: '1px solid #8080806e',
                                                height: '350px'
                                            }}
                                            src={unstitchedfileModel?.filePath === undefined ? "/assets/images/default-image.jpg" : unstitchedfileModel?.filePath}
                                            className="card-img-top"
                                            alt="default" />
                                        <div className="card-body">
                                            <h5 className="card-title">Unstitched Image</h5>
                                            <p className="card-text">Upload unstitched cloth image</p>
                                            <div className="input-group">
                                                <input type="file" name='unstitchFile' onChange={e => setFiles(e.target.files,"unstitched")} className='form-control form-control-sm' />
                                              <ButtonBox type="upload" className="btn-sm" onClickHandler={handleSave} onClickHandlerData="unstitched" disabled={unstitchedfile === "" ? "disabled" : ""}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <div className="card" >
                                        <img style={{
                                            width: '100%',
                                            border: '1px solid #8080806e',
                                            height: '350px'
                                        }}
                                            src={stitchedfileModel?.filePath === undefined ? "/assets/images/default-image.jpg" : stitchedfileModel?.filePath}
                                            className="card-img-top"
                                            alt="default" />
                                        <div className="card-body">
                                            <h5 className="card-title">Stitched Image</h5>
                                            <p className="card-text">Upload stitched cloth image</p>
                                            <div className="input-group">
                                                <input type="file" name='stitchFile' onChange={e => setFiles(e.target.files,"stitched")} className='form-control form-control-sm' />
                                                    <ButtonBox type="upload" 
                                                    className="btn-sm" 
                                                    onClickHandler={handleSave} 
                                                    onClickHandlerData="stitched" 
                                                    disabled={stitchedfile === "" ? "disabled" : ""}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="cancel" className="btn-sm" text="Close" modelDismiss={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
