import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import ButtonBox from '../common/ButtonBox';
import ErrorLabel from '../common/ErrorLabel';

export default function UpdateDesignModelPopup({ workSheetData,returnModelNoHandler, showModel = true }) {
    const [designCategoryList, setDesignCategoryList] = useState([]);
    const [imagePath, setImagePath] = useState('')
    const [designSample, setDesignSample] = useState([]);
    const [errors, setErrors] = useState({});
    const [model, setModel] = useState({ categoryId: 0, designSampleId: 0, modelNo: '' });
    const [selectedDesignSample, setSelectedDesignSample] = useState([])
    const [selectedModelAvailableQty, setSelectedModelAvailableQty] = useState()
    useEffect(() => {
        let apisList = [];
        apisList.push(Api.Get(apiUrls.dropdownController.designCategory));
        apisList.push(Api.Get(apiUrls.masterController.designSample.getAll + "?pageNo=1&PageSize=1000000"));

        Api.MultiCall(apisList)
            .then(res => {
                setDesignCategoryList(res[0].data);
                setDesignSample(res[1].data.data);
            });
    }, []);

    const handleCategorySelection = (categoryid) => {
        setModel({ ...model, categoryId: categoryid });
        getDesignSample(categoryid);
    }

    const getDesignSample = (categoryId) => {
        const sampleList = designSample?.filter(x => x.categoryId === categoryId);
        setSelectedDesignSample(sampleList);
    }
    const updateDesignModel = () => {
        if (workSheetData.orderDetailId === 0 || workSheetData.orderDetailId === undefined) {
            toast.warn('Please select Kandoora in worker sheet!');
            return;
        }
        let formError = {}
        if (model.designSampleId === 0)
            formError.categoryId = validationMessage.categoryRequired;
        if (model.designSampleId === 0)
            formError.designSampleId = validationMessage.modelRequired;

        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return;
        }
        setErrors({});

        Api.Post(apiUrls.orderController.updateDesignModel + `${workSheetData.orderDetailId}/${model.designSampleId}?modelName=${model.modelNo}`, {})
            .then(res => {
                if (res.data > 0) {
                    common.closePopup('update-design-popup-model');
                    toast.success(toastMessage.updateSuccess);
                }
                else
                    toast.warn(toastMessage.updateError);
            })
    }

    const modelSelectHandler = (ele) => {
        var newModel = model;
        newModel.designSampleId = ele.id;
        newModel.modelNo = ele.model;
        setModel({ ...newModel });
        setSelectedModelAvailableQty(ele.quantity);
        setImagePath(ele.picturePath);
        returnModelNoHandler(ele.model);
    }
    return (
        <>
            <div className={showModel ? "modal fade" : ""} id="update-design-popup-model" tabIndex="-1" aria-labelledby="update-design-popup-model-label" aria-hidden="true">
                <div className={showModel ? "modal-dialog modal-xl" : ""}>
                    <div className={showModel ? "modal-content" : ""}>
                        {showModel && <div className="modal-header">
                            <h5 className="modal-title" id="update-design-popup-model-label">Update Model For Kandoora No : {workSheetData.kandooraNo}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        }
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">

                                    <div className='row'>
                                        <div className='col-4'>
                                            <div className='text-center fw-bold'>Model category</div>
                                            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                                <ul className="list-group">
                                                    {
                                                        designCategoryList?.map((ele, index) => {
                                                            return <li key={ele.id} onClick={e => handleCategorySelection(ele.id)} className={"list-group-item d-flex justify-content-between align-items-center" + (model.categoryId === ele.id ? " activeSample" : "")}>
                                                                {ele.value}
                                                                <span className="badge badge-danger badge-pill text-dark">
                                                                    {designSample?.filter(x => x.categoryId === ele.id).length} Models
                                                                </span>
                                                            </li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className='col-4'>
                                            <div className='text-center fw-bold'>Model design</div>
                                            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                                {selectedDesignSample?.length > 0 && <ul className="list-group">
                                                    {
                                                        selectedDesignSample?.map((ele, index) => {
                                                            return <li style={{ padding: '0 15px' }} key={index} onClick={e => modelSelectHandler(ele)} className={"list-group-item d-flex justify-content-between align-items-center" + (model.designSampleId === ele.id ? (ele.quantity < 1 ? " activeZeroSample" : " activeSample") : "")}>
                                                                {ele.model}
                                                                <span className="badge badge-danger badge-pill">
                                                                    <img onError={(e) => { e.target.src = "/assets/images/default-image.jpg" }} title="Click on image to zoom" src={ele.thumbPath === "" ? "/assets/images/default-image.jpg" : process.env.REACT_APP_API_URL + ele.thumbPath} style={{ width: '30px', height: '30px', cursor: "zoom-in", border: "2px solid black" }} />
                                                                </span>
                                                            </li>
                                                        })
                                                    }
                                                </ul>
                                                }
                                                <ErrorLabel message={errors.designSampleId}></ErrorLabel>
                                                {selectedDesignSample?.length === 0 &&
                                                    <div className="d-flex bd-highlight mb-3 example-parent sampleBox" style={{ justifyContent: 'space-around', fontSize: '1rem', color: '#ff00008f' }}>
                                                        <div>No models are available for selected category</div>
                                                    </div>}
                                            </div>
                                        </div>
                                        <div className='col-4'>
                                            {imagePath !== undefined &&
                                                <div className='card'>
                                                    <div className='card-body'>
                                                        <img onError={(e) => { e.target.src = "/assets/images/default-image.jpg" }} src={imagePath === "" ? "/assets/images/default-image.jpg" : process.env.REACT_APP_API_URL + imagePath} className='img-fluid' style={{ height: '300px', width: '100%' }}></img>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <ErrorLabel message={errors.categoryId}></ErrorLabel>
                                    {!showModel && <div className="modal-footer">
                                        <ButtonBox type="update" onClickHandler={updateDesignModel} className="btn-sm" />
                                        <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
                                    </div>
                                    }
                                </div>
                            </div>

                        </div>
                        {showModel && <div className="modal-footer">
                            <ButtonBox type="update" onClickHandler={updateDesignModel} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
                        </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
