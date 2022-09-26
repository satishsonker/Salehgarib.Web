import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';

export default function MeasurementUpdatePopop({ orderDetail, setViewSampleImagePath,searchHandler }) {
    const measurementUpdateModelTemplate = {
       ...orderDetail,
        designSampleId: 0,
        orderDetailId: orderDetail.id
    }
    const [measurementUpdateModel, setMeasurementUpdateModel] = useState(measurementUpdateModelTemplate);
    const [designCategoryList, setDesignCategoryList] = useState();
    const [designSample, setDesignSample] = useState([]);
    const [selectedDesignSample, setSelectedDesignSample] = useState([]);
    const [selectedModelAvailableQty, setSelectedModelAvailableQty] = useState(100000);
    const [errors, setErrors] = useState({})
    const handleTextChange = (e) => {
        let {name, value } = e.target;
        setMeasurementUpdateModel({ ...measurementUpdateModel, [name]: value });
    }
    useEffect(() => {
        if (!orderDetail || orderDetail.id < 1) {
            return;
        }
        var apisList = [];
        apisList.push(Api.Get(apiUrls.dropdownController.designCategory));
        apisList.push(Api.Get(apiUrls.masterController.designSample.getAll + "?pageNo=1&PageSize=1000000"));
        Api.MultiCall(apisList).then(res => {
            setDesignCategoryList(res[0].data);
            setDesignSample(res[1].data.data);
            setMeasurementUpdateModel({
                ...orderDetail,
                 designSampleId: 0,
                 orderDetailId: orderDetail.id
             })
        });
    }, [orderDetail.id])
    const getDesignSample = (designCategoryId) => {
        const sampleList = designSample?.filter(x => x.categoryId === designCategoryId);
        setMeasurementUpdateModel({ ...measurementUpdateModel, ['categoryId']: designCategoryId });
        setSelectedDesignSample(sampleList);
    }

    const handleUpdate = () => {
        Api.Post(apiUrls.orderController.updateMeasurement, measurementUpdateModel)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.updateSuccess);
                    common.closePopup('measurement-update-popup-model');
                    searchHandler('');
                }
                else{
                    toast.warn(toastMessage.updateError);
                }
            })
    }
    return (
        <>
            <div className="modal fade" id="measurement-update-popup-model" tabIndex="-1" aria-labelledby="measurement-update-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="measurement-update-popup-model-label">Update Kandoora Measurement</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-start bd-highlight mb-3 example-parent sampleBox" style={{ flexWrap: "wrap" }}>
                                            {
                                                designCategoryList?.map((ele, index) => {
                                                    return <div key={index}
                                                        onClick={e => { getDesignSample(ele.id); handleTextChange({ target: { name: "categoryId", type: "number", value: ele.id } }); setSelectedModelAvailableQty(100000) }}
                                                        className={"p-1 bd-highlight col-example btnbr" + (measurementUpdateModel.categoryId === ele.id ? " activeSample" : "")}>{ele.value}</div>
                                                })
                                            }
                                        </div>
                                        <ErrorLabel message={errors.designSampleId} />
                                        {
                                            selectedDesignSample?.length > 0 &&
                                            <div className="d-flex justify-content-start bd-highlight mb-3 example-parent sampleBox">
                                                {
                                                    selectedDesignSample?.map((ele, index) => {
                                                        return <>
                                                            <div key={index}
                                                                className={"btn-group btnbr position-relative" + (measurementUpdateModel.designSampleId === ele.id ? (ele.quantity < 1 ? " activeZeroSample" : " activeSample") : "")}
                                                                role="group"
                                                                aria-label="Basic example"
                                                                style={{ marginRight: "20px", marginBottom: '10px' }}
                                                                title={ele.quantity < 1 ? "You do not have enough quantity of butter paper." : `${ele.quantity} butter paper is available`}
                                                            >
                                                                <div
                                                                    onClick={e => { handleTextChange({ target: { name: "designSampleId", type: "number", value: ele.id } }); setMeasurementUpdateModel({ ...measurementUpdateModel, ['designSampleId']: ele.id }); setSelectedModelAvailableQty(ele.quantity) }}
                                                                    type="button"
                                                                    style={{ width: '83%' }}
                                                                    className=" p-2 bd-highlight col-example">
                                                                    {ele.model}
                                                                </div>
                                                                <div
                                                                    style={{ width: "26px" }}
                                                                    className="" title='View Image'
                                                                >
                                                                    <img
                                                                        src={process.env.REACT_APP_API_URL + ele.picturePath}
                                                                        style={{ height: '25px', width: '25px' }}
                                                                        className='img-fluid'
                                                                        data-bs-target="#table-image-viewer-sample-design" data-bs-toggle="modal" data-bs-dismiss="modal"
                                                                        onClick={e => setViewSampleImagePath(ele.picturePath)}></img>
                                                                </div>
                                                                {/* <img src={process.env.REACT_APP_API_URL + ele.picturePath} style={{ width: "150px" }}></img> */}
                                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                                    {ele.quantity}
                                                                    <span className="visually-hidden">unread messages</span>
                                                                </span>
                                                            </div>
                                                        </>
                                                    })
                                                }
                                                {selectedModelAvailableQty <= 0 && <div className='text-danger' style={{ width: '100%', textAlign: 'center' }}>You do not have enough quantity of butter paper</div>}

                                            </div>
                                        }
                                        {
                                            selectedDesignSample?.length === 0 &&
                                            <div className="d-flex bd-highlight mb-3 example-parent sampleBox" style={{ justifyContent: 'space-around', fontSize: '1.1rem', color: '#ff00008f' }}>
                                                <div className='fs-6'>No models are available for selected category</div>
                                            </div>
                                        }
                                        <div className='row'>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Length"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.length} name="length" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Chest"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.chest} name="chest" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Waist"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.waist} name="waist" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Hipps"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.hipps} name="hipps" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Bottom"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.bottom} name="bottom" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Sleeve"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.sleeve} name="sleeve" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Sleeve Loo."></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.sleeveLoose} name="sleeveLoose" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Shoulder"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.shoulder} name="shoulder" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Neck"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.neck} name="neck" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Back Down"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.backDown} name="backDown" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Extra"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.extra} name="extra" className="form-control form-control-sm" />
                                            </div>

                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Deep"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.deep} name="deep" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Cuff"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.cuff} name="cuff" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-1">
                                                <Label fontSize='11px' text="Size"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.size} name="size" className="form-control form-control-sm" />
                                            </div>
                                            <div className='clearfix'></div>
                                            <div className="col-12">
                                                <Label fontSize='11px' text="Description"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel.description} name="description" className="form-control form-control-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button type="button" onClick={e => handleUpdate()} className="btn btn-success" >update</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
