import React, { useState, useEffect } from 'react'
import ButtonBox from './ButtonBox'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';

export default function ImageUploadWithPreview({ moduleId, remark, title, description,moduleNameId=1,setImagePath }) {
    const imageSourceType = {
        webcam: "webcam",
        hdd: "hdd"
    }
    const [model, setModel] = useState({})
    const [files, setFiles] = useState({})
    const [imageSource, setImageSource] = useState(imageSourceType.hdd);
    const [isVideoOpen, setIsVideoOpen] = useState(true);
    const [webStream, setWebStream] = useState(null)
    const DEFAULT_IMAGE_PATH = { filePath: "/assets/images/default-image.jpg" };


    let width = 370, height = 0, streaming = false, video = null, canvas = null, photo = null, startbutton = null;

    useEffect(() => {
        if (imageSource === imageSourceType.webcam) {
            startup();
        }
    }, [imageSource]);

    const switchImageSource = (source) => {
        setFiles();
        setImageSource(source);
        if (source === imageSourceType.webcam) {
            photo = document.getElementById('photo');
        }
    }

    useEffect(() => {
        if (moduleId !== undefined && moduleId !== null && moduleId !== 0) {
            Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `${moduleNameId}?moduleIds=${moduleId}`)
                .then(res => {
                    if (res.data.length > 0) {
                        res.data.forEach(ele => {
                            ele.filePath = process.env.REACT_APP_API_URL + ele.filePath;
                            if (ele.remark === remark?.toLowerCase()) {
                                setModel({...ele});
                            }
                            else if(moduleNameId===2)
                            {
                                setModel({...ele});
                            }
                        });
                    }
                    else {
                        setModel({ ...DEFAULT_IMAGE_PATH });
                    }
                })
        }
    }, [moduleId]);

    const imageStyle = {
        width: '100%',
        border: '1px solid #8080806e',
        height: '350px'
    }
    const handleSave = (e) => {
        e.preventDefault();
        var formData = new FormData();
        let data = {
            file: files,
            moduleId: moduleId,
            moduleName: moduleNameId,
            remark: remark
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
                toast.success(toastMessage.saveSuccess);
                var modal = {
                    filePath: process.env.REACT_APP_API_URL + res.data?.filePath
                }
                setModel({ ...modal });                
                setImagePath(res.data?.filePath);
            }
        }).catch(err => {
            if (err?.response?.data?.errors?.File[0] !== undefined) {
                toast.error(err?.response?.data?.errors?.File[0]);
                return;
            }
            toast.error(toastMessage.saveError);
        });
    }

    const startup = () => {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');

        navigator?.mediaDevices?.getUserMedia({
            video: true,
            audio: false
        })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
                setWebStream(stream);
            })
            .catch(function (err) {
                console.log("An error occurred: " + err);
            });

        // video.addEventListener('canplay', , false);


        clearphoto();
    }

    const canPlayHandler = (ev) => {
        if (!streaming) {
            height = video?.videoHeight / (video?.videoWidth / width);

            if (isNaN(height)) {
                height = width / (4 / 3);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }
    const clearphoto = () => {
        setIsVideoOpen(true);
        photo = document.getElementById('photo');
        var context = canvas?.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);
        var data = canvas.toDataURL('image/png');
        photo?.setAttribute('src', data);
    }

    useEffect(() => {
        return () => {
            disposeWebCamObject();
        }
    }, []);

    const retakePicture = () => {
        setIsVideoOpen(true);
        startup();
    }
    const takePicture = () => {
        setIsVideoOpen(false);
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        photo = document.getElementById('photo');
        if (!streaming) {
            height = video?.videoHeight / (video?.videoWidth / width);

            if (isNaN(height)) {
                height = width / (4 / 3);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas?.toDataURL('image/png');
            photo.setAttribute('src', data);

            canvas?.toBlob(function (blob) {
                setFiles([new File([blob], 'test.jpg', { type: 'image/jpeg' })]);
            }, 'image/jpeg');

            disposeWebCamObject();
        } else {
            clearphoto();
        }
    }
    const disposeWebCamObject = () => {
        webStream?.getTracks()?.forEach((track) => {
            if (track.readyState == 'live') {
                track.stop();
            }
        });
    }
    const disableImageUploadButton=()=>{
      return  (isVideoOpen && imageSource===imageSourceType.webcam)|| files?.length===0 ||files?.length===undefined
    }
    return (
        <>
            <div className="card">
            {model?.filePath}
                {imageSource === imageSourceType.hdd && <img
                    style={imageStyle}
                    src={model?.filePath === undefined || model?.filePath === null || model?.filePath === ""? "/assets/images/default-image.jpg" : model?.filePath}
                    className="card-img-top"
                    loading='lazy'
                    alt="default" />
                }
                {imageSource === imageSourceType.webcam && <>
                    <div className="camera" style={{ display: (isVideoOpen ? 'block' : 'none') }}>
                        <video id="video" onCanPlay={canPlayHandler}>Video stream not available.</video>
                    </div>
                    <div className="output" style={{ display: (!isVideoOpen ? 'block' : 'none') }}>
                        <img id="photo" alt="The screen capture will appear in this box." />
                    </div>
                    <div className='my-2'>
                        <ButtonBox style={{ display: (isVideoOpen ? 'block' : 'none') }} type="save" className="btn-sm w-100" icon="bi bi-camera" onClickHandler={takePicture} text="Take photo" />
                        <ButtonBox style={{ display: (!isVideoOpen ? 'block' : 'none') }} type="save" className="btn-sm w-100" icon="bi bi-camera" onClickHandler={retakePicture} text="Re-Take photo" />
                    </div>

                    <canvas id="canvas" style={{ display: 'none' }}></canvas>

                </>
                }
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                    <div className='img-upload-source'>
                        <span style={{ marginRight: '10px' }}>Image Source</span>
                        <i title='Webcam' className={"bi bi-camera-video-fill" + (imageSource === imageSourceType.webcam ? " selected" : "")} onClick={e => switchImageSource(imageSourceType.webcam)}></i>
                        <i title='Compter' className={"bi bi-hdd-fill" + (imageSource === imageSourceType.hdd ? " selected" : "")} onClick={e => switchImageSource(imageSourceType.hdd)}></i>
                    </div>
                    <div className="input-group">
                        {imageSource === imageSourceType.hdd && <input type="file" onChange={e => setFiles(e.target.files)} className='form-control form-control-sm' accept=".jpg,.jpeg,.png,capture=camera"/>}
                        <ButtonBox type="upload" disabled={disableImageUploadButton()} className={"btn-sm" + (imageSource === imageSourceType.webcam ? " w-100" : "")} onClickHandler={handleSave} onClickHandlerData={remark} />
                    </div>
                </div>
            </div>
        </>
    )
}

