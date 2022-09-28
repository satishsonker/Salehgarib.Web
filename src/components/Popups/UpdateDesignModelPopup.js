import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import ErrorLabel from '../common/ErrorLabel';

export default function UpdateDesignModelPopup({ workSheetData }) {
    const [designCategoryList, setDesignCategoryList] = useState([])
    const [designSample, setDesignSample] = useState([]);
    const [errors, setErrors] = useState({});
    const [model, setModel] = useState({ categoryId: 0, designSampleId: 0 });
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
            })
            .catch(err => {

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
        if (workSheetData.orderDetailId === 0 || workSheetData.orderDetailId===undefined)
        {
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

        Api.Post(apiUrls.orderController.updateDesignModel + `${workSheetData.orderDetailId}/${model.designSampleId}`,{})
            .then(res => {
                if (res.data > 0) {
                    common.closePopup('update-design-popup-model');
                    toast.success(toastMessage.updateSuccess);
                }
                else
                    toast.warn(toastMessage.updateError);
            })
    }
    return (
        <>
            <div className="modal fade" id="update-design-popup-model" tabIndex="-1" aria-labelledby="update-design-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="update-design-popup-model-label">Update Design Model</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Kandoora No : {workSheetData.kandooraNo}</h6>
                                    <h6 className="card-title">Design Category</h6>
                                    <div className="d-flex justify-content-start bd-highlight mb-3 example-parent sampleBox" style={{ flexWrap: "wrap" }}>
                                        {
                                            designCategoryList?.map((ele, index) => {
                                                return <div key={ele.id}
                                                    onClick={e => handleCategorySelection(ele.id)}
                                                    className={"p-2 bd-highlight col-example btnbr" + (model.categoryId === ele.id ? " activeSample" : "")}>{ele.value}</div>
                                            })
                                        }
                                    </div>
                                    <ErrorLabel message={errors.categoryId}></ErrorLabel>
                                    <h6 className="card-title">Design Sample/Model</h6>
                                    {
                                        selectedDesignSample?.length > 0 &&
                                        <div className="d-flex justify-content-start bd-highlight mb-3 example-parent sampleBox">
                                            {
                                                selectedDesignSample?.map((ele, index) => {
                                                    return <div key={ele.id}>
                                                        <div 
                                                            className={"btn-group btnbr position-relative" + (model.designSampleId === ele.id ? (ele.quantity < 1 ? " activeZeroSample" : " activeSample") : "")}
                                                            role="group"
                                                            aria-label="Basic example"
                                                            style={{ marginRight: "20px", marginBottom: '10px' }}
                                                            title={ele.quantity < 1 ? "You do not have enough quantity of butter paper." : `${ele.quantity} butter paper is available`}
                                                        >
                                                            <div
                                                                onClick={e => { setModel({ ...model, designSampleId: ele.id }); setSelectedModelAvailableQty(ele.quantity) }}
                                                                type="button"
                                                                style={{ width: '83%' }}
                                                                className=" p-2 bd-highlight col-example">
                                                                {ele.model}
                                                            </div>
                                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                                {ele.quantity}
                                                                <span className="visually-hidden">unread messages</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                })
                                            }
                                            {selectedModelAvailableQty <= 0 && <div className='text-danger' style={{ width: '100%', textAlign: 'center' }}>You do not have enough quantity of butter paper</div>}
                                            <ErrorLabel message={errors.designSampleId}></ErrorLabel>
                                        </div>
                                    }
                                    {selectedDesignSample?.length === 0 &&
                                        <div className="d-flex bd-highlight mb-3 example-parent sampleBox" style={{ justifyContent: 'space-around', fontSize: '1.1rem', color: '#ff00008f' }}>
                                            <div>No models are available for selected category</div>
                                        </div>}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={e => updateDesignModel()} type="button" className="btn btn-info">Update</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
