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
    const [capturedImages, setCapturedImages] = useState({ unstitched: null, stitched: null }); // Store captured image URLs
    const [cameraError, setCameraError] = useState(null);
    const [availableCameras, setAvailableCameras] = useState({ front: false, back: false });
    const [cameraList, setCameraList] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
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

    const checkCameraAvailability = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            if (videoDevices.length === 0) {
                setCameraError('No camera detected on this device');
                return false;
            }

            // Process each video device
            const cameras = videoDevices.map((device, index) => {
                const label = device.label || `Camera ${index + 1}`;
                const isBack = label.toLowerCase().includes('back') || label.toLowerCase().includes('environment');
                const isFront = label.toLowerCase().includes('front') || label.toLowerCase().includes('user');
                return {
                    id: device.deviceId,
                    label: label,
                    type: isBack ? 'back' : (isFront ? 'front' : 'unknown')
                };
            });

            setCameraList(cameras);
            
            const hasBackCamera = cameras.some(cam => cam.type === 'back');
            const hasFrontCamera = cameras.some(cam => cam.type === 'front');

            setAvailableCameras({
                front: hasFrontCamera,
                back: hasBackCamera
            });

            // Set initial selected camera
            if (cameras.length > 0) {
                // Prefer back camera if available
                const defaultCamera = cameras.find(cam => cam.type === 'back') || cameras[0];
                setSelectedCamera(defaultCamera);
                setCameraFacing(defaultCamera.type === 'back' ? 'environment' : 'user');
            }

            return true;
        } catch (err) {
            console.error('Error checking camera:', err);
            setCameraError('Unable to access camera. Please check camera permissions.');
            return false;
        }
    };

    const startCapture = async (type) => {
        setCameraError(null); // Reset any previous errors
        
        try {
            // Request camera permission and check availability
            await navigator.mediaDevices.getUserMedia({ video: true });
            const hasCamera = await checkCameraAvailability();
            
            if (!hasCamera) {
                return;
            }

            // If trying to use back camera but it's not available, switch to front
            if (cameraFacing === 'environment' && !availableCameras.back && availableCameras.front) {
                setCameraFacing('user');
                toast.info('Back camera not available, switching to front camera');
            }
            // If trying to use front camera but it's not available, switch to back
            else if (cameraFacing === 'user' && !availableCameras.front && availableCameras.back) {
                setCameraFacing('environment');
                toast.info('Front camera not available, switching to back camera');
            }

            setIsCapturing(true);
            setCurrentCaptureType(type);
        } catch (err) {
            console.error('Camera access error:', err);
            if (err.name === 'NotAllowedError') {
                setCameraError('Camera access denied. Please enable camera permissions in your browser settings.');
                toast.error('Camera access denied. Please enable camera permissions.');
            } else if (err.name === 'NotFoundError') {
                setCameraError('No camera found on this device.');
                toast.error('No camera found on this device.');
            } else {
                setCameraError('Error accessing camera: ' + err.message);
                toast.error('Error accessing camera. Please try again.');
            }
        }
    };

    const switchCamera = async () => {
        const newFacing = cameraFacing === 'environment' ? 'user' : 'environment';
        
        // Check if the camera we're switching to is available
        if (newFacing === 'environment' && !availableCameras.back) {
            toast.warning('Back camera not available on this device');
            return;
        } else if (newFacing === 'user' && !availableCameras.front) {
            toast.warning('Front camera not available on this device');
            return;
        }

        setCameraFacing(newFacing);
    };

    const capturePhoto = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            
            // Store the captured image URL for preview
            setCapturedImages(prev => ({
                ...prev,
                [currentCaptureType]: imageSrc
            }));
            
            // Convert base64 to file
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    const fileList = new DataTransfer();
                    fileList.items.add(file);
                    setFiles(fileList.files, currentCaptureType);
                })
                .catch(error => {
                    console.error('Error converting image:', error);
                    toast.error('Error processing captured image');
                });
            
            setIsCapturing(false);
        }
    };

    const handleSave = (e, fileType) => {
        e.preventDefault();
        const fileToUpload = fileType === 'stitched' ? stitchedfile : unstitchedfile;
        
        if (!fileToUpload || !fileToUpload[0]) {
            toast.error('Please select or capture an image first');
            return;
        }

        var formData = new FormData();
        let data = {
            file: fileToUpload,
            moduleId: orderDetail?.id,
            moduleName: 1,
            remark: fileType
        }
        
        for (var key in data) {
            if (key === 'file' && data?.file?.[0]) {
                formData.append(key, data[key][0], data[key][0].name || 'capture.jpg');
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
                    setCapturedImages(prev => ({ ...prev, stitched: null }));
                }
                else {
                    setUnstitchedfile('');
                    setUnstitchedFileModel({ ...modal });
                    setCapturedImages(prev => ({ ...prev, unstitched: null }));
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
                                    {cameraError ? (
                                        <div className="alert alert-danger">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            {cameraError}
                                        </div>
                                    ) : (
                                        <>
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                videoConstraints={{
                                                    deviceId: selectedCamera?.id,
                                                    facingMode: !selectedCamera?.id ? cameraFacing : undefined,
                                                    aspectRatio: 3/4
                                                }}
                                                style={{ 
                                                    width: '100%', 
                                                    maxHeight: 'calc(100vh - 300px)',
                                                    objectFit: 'contain'
                                                }}
                                                onUserMediaError={(err) => {
                                                    setCameraError('Error accessing camera: ' + err.message);
                                                }}
                                            />
                                            <div className="d-flex gap-2 justify-content-center mt-3">
                                                <button className="btn btn-secondary btn-sm" onClick={() => {
                                                    setIsCapturing(false);
                                                    setCameraError(null);
                                                }}>
                                                    <i className="bi bi-x-circle"></i> Cancel
                                                </button>
                                                {cameraList.length > 1 && (
                                                    <select 
                                                        className="form-select form-select-sm" 
                                                        style={{ width: 'auto' }}
                                                        value={selectedCamera?.id || ''}
                                                        onChange={(e) => {
                                                            const camera = cameraList.find(c => c.id === e.target.value);
                                                            setSelectedCamera(camera);
                                                            setCameraFacing(camera.type === 'back' ? 'environment' : 'user');
                                                        }}
                                                    >
                                                        {cameraList.map(camera => (
                                                            <option key={camera.id} value={camera.id}>
                                                                {camera.label} ({camera.type})
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                                <button className="btn btn-primary btn-sm" onClick={capturePhoto}>
                                                    <i className="bi bi-camera"></i> Capture
                                                </button>
                                            </div>
                                        </>
                                    )}
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
                                                src={capturedImages.unstitched || (unstitchedfileModel?.filePath === undefined ? "/assets/images/default-image.jpg" : unstitchedfileModel?.filePath)}
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
                                                src={capturedImages.stitched || (stitchedfileModel?.filePath === undefined ? "/assets/images/default-image.jpg" : stitchedfileModel?.filePath)}
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
