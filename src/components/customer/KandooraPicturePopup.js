import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import ButtonBox from '../common/ButtonBox';
import Webcam from 'react-webcam';

export default function KandooraPicturePopup({ orderDetail }) {
    const DEFAULT_IMAGE_PATH = { filePath: "/assets/images/default-image.jpg" };
    const [unstitchedfileModel, setUnstitchedFileModel] = useState({});
    const [stitchedfileModel, setStitchedFileModel] = useState({});
    const [unstitchedfile, setUnstitchedfile] = useState("");
    const [stitchedfile, setStitchedfile] = useState("");
    const [isCapturing, setIsCapturing] = useState(false);
    const [currentCaptureType, setCurrentCaptureType] = useState("");
    const [cameraFacing, setCameraFacing] = useState("environment"); // "environment" for back camera, "user" for front
    const webcamRef = useRef(null);
    const modalRef = useRef(null);

    // Handle modal close
    useEffect(() => {
        const handleModalClose = () => {
            if (isCapturing) {
                setIsCapturing(false);
                if (webcamRef.current && webcamRef.current.stream) {
                    const tracks = webcamRef.current.stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };

        const modalElement = document.getElementById('kandoora-photo-popup-model');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', handleModalClose);
        }

        return () => {
            if (modalElement) {
                modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
            }
        };
    }, [isCapturing]);

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
                    setStitchedFileModel({ ...DEFAULT_IMAGE_PATH });
                    setUnstitchedFileModel({ ...DEFAULT_IMAGE_PATH });
                }
                return () => {
                    setStitchedFileModel({ ...DEFAULT_IMAGE_PATH });
                    setUnstitchedFileModel({ ...DEFAULT_IMAGE_PATH });
                }
            })
    }, [orderDetail?.id]);

    const setFiles = (file, type) => {
        if (type === 'stitched') {
            setStitchedfile(file);
        }
        else {
            setUnstitchedfile(file);
        }
    }

    const startCapture = (type) => {
        setIsCapturing(true);
        setCurrentCaptureType(type);
    };

    const switchCamera = () => {
        setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
    };

    const capturePhoto = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            
            // Convert base64 to file
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    const fileList = {
                        0: file,
                        length: 1
                    };
                    setFiles(fileList, currentCaptureType);
                });
            
            setIsCapturing(false);
        }
    };

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
                var modal = {
                    filePath: process.env.REACT_APP_API_URL + res.data?.filePath
                }
                if (fileType === 'stitched') {
                    setStitchedfile('');
                    setStitchedFileModel({ ...modal });
                }
                else {
                    setUnstitchedfile('');
                    setUnstitchedFileModel({ ...modal });
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
            <div className="modal fade" id="kandoora-photo-popup-model" ref={modalRef} tabIndex="-1" aria-labelledby="kandoora-photo-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="kandoora-photo-popup-model-label">Update Kandoora Image</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div><h5>Kandoora No. : {orderDetail?.orderNo}</h5></div>
                            <br />
                            {isCapturing ? (
                                <div className="camera-container position-relative">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{
                                            facingMode: cameraFacing,
                                            aspectRatio: 3/4
                                        }}
                                        style={{ 
                                            width: '100%', 
                                            maxHeight: 'calc(100vh - 300px)',
                                            objectFit: 'contain'
                                        }}
                                    />
                                    <div className="d-flex gap-2 justify-content-center mt-3">
                                        <button className="btn btn-secondary btn-sm" onClick={() => setIsCapturing(false)}>
                                            <i className="bi bi-x-circle"></i> Cancel
                                        </button>
                                        <button className="btn btn-info btn-sm" onClick={switchCamera}>
                                            <i className="bi bi-arrow-repeat"></i> Switch Camera
                                        </button>
                                        <button className="btn btn-primary btn-sm" onClick={capturePhoto}>
                                            <i className="bi bi-camera"></i> Capture
                                        </button>
                                    </div>
                                </div>
                            ) : (
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
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="input-group">
                                                        <input type="file" name='unstitchFile' onChange={e => setFiles(e.target.files, "unstitched")} className='form-control form-control-sm' accept=".jpg,.jpeg,.png"/>
                                                        <ButtonBox type="upload" className="btn-sm" onClickHandler={handleSave} onClickHandlerData="unstitched" disabled={unstitchedfile === "" ? "disabled" : ""} />
                                                    </div>
                                                    <button className="btn btn-info btn-sm" onClick={() => startCapture("unstitched")}>
                                                        <i className="bi bi-camera"></i> Use Camera
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-6'>
                                        <div className="card">
                                            <img 
                                                style={{
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
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="input-group">
                                                        <input type="file" name='stitchFile' onChange={e => setFiles(e.target.files, "stitched")} className='form-control form-control-sm' accept=".jpg,.jpeg,.png"/>
                                                        <ButtonBox type="upload"
                                                            className="btn-sm"
                                                            onClickHandler={handleSave}
                                                            onClickHandlerData="stitched"
                                                            disabled={stitchedfile === "" ? "disabled" : ""} />
                                                    </div>
                                                    <button className="btn btn-info btn-sm" onClick={() => startCapture("stitched")}>
                                                        <i className="bi bi-camera"></i> Use Camera
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="cancel" className="btn-sm" text="Close" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
