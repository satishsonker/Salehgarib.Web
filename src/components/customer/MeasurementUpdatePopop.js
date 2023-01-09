import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Dropdown from '../common/Dropdown';
import Label from '../common/Label';
import Pagination from '../tables/Pagination';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';
import PrintWorkDescription from '../print/PrintWorkDescription';
import PrintWorkerSheet from '../print/PrintWorkerSheet';

export default function MeasurementUpdatePopop({ orderData, searchHandler }) {

    const [pageNo, setPageNo] = useState(1);
    const [selectedModelNo, setSelectedModelNo] = useState(orderData?.orderDetails[pageNo-1].designModel);
    const [measuments, setMeasuments] = useState([]);
    const [measurementName, setMeasurementName] = useState("");
    const [unstitchedImageList, setUnstitchedImageList] = useState([]);
    const [workDescriptionList, setWorkDescriptionList] = useState([]);
    const [workTypeList, setWorkTypeList] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const measurementUpdateModelTemplate = {
        workType: '',
        chest: '',
        sleeveLoose: '',
        deep: '',
        backDown: '',
        bottom: '',
        length: '',
        hipps: '',
        sleeve: '',
        shoulder: '',
        neck: '',
        extra: '',
        size: '',
        waist: '',
        measurementCustomerName: '',
        description: '',
        orderDataId: 0
    }
    const [measurementUpdateModel, setMeasurementUpdateModel] = useState({ orderDetails: [measurementUpdateModelTemplate] });
    const paginationOption = {
        pageNo: pageNo,
        setPageNo: setPageNo,
        totalRecords: orderData?.orderDetails?.length,
        pageSize: 1
    }
    const [kandooraNoList, setKandooraNoList] = useState([]);
    const [isDataModified, setIsDataModified] = useState(false);
    const [selectedWorkDescription, setSelectedWorkDescription] = useState([])
    const imageStyle = {
        margin: '6px 0 0 0',
        width: '100%',
        height: '100%',
        border: '3px solid gray',
        borderRadius: '7px',
        maxHeight: '190px',
        cursor: "zoom-in"
    }
    const handleTextChange = (e) => {
        let { name, value } = e.target;
        let mainData = measurementUpdateModel;
        mainData.orderDetails[pageNo - 1][name] = value;
        setMeasurementUpdateModel({ ...mainData });
        setIsDataModified(true);
    }
    useEffect(() => {
        let apiList = [];
        if (orderData.orderDetails === undefined)
            return;
        var orderDetailId = orderData.orderDetails[pageNo - 1]?.id ?? 0;
        setSelectedModelNo( orderData.orderDetails[pageNo - 1]?.designModel)
        apiList.push(Api.Get(apiUrls.workDescriptionController.getByWorkTypes + orderData?.orderDetails[pageNo - 1]?.workType));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataType + "?masterdatatype=work_type"));
        if (orderDetailId !== undefined || orderDetailId > 0) {
            apiList.push(Api.Get(apiUrls.workDescriptionController.getOrderWorkDescription + orderDetailId))
        }
        Api.MultiCall(apiList)
            .then(res => {
                setWorkDescriptionList(res[0].data);
                setWorkTypeList(res[1].data);
                if (orderDetailId !== undefined) {
                    setSelectedWorkDescription([...res[2].data]);
                }
            });
    }, [pageNo, orderData]);

    const isWDSelected = (id) => {
        return selectedWorkDescription.find(x => x.workDescriptionId === id) !== undefined;
    }

    useEffect(() => {
        if (orderData === undefined || orderData.orderDetails === undefined || orderData.orderDetails.length === 0 || !Array.isArray(orderData.orderDetails))
            return;
        let list = [];
        var moduleIds = "";
        orderData.orderDetails.forEach((ele, index) => {
            ele.measurementCustomerName = ele.measurementCustomerName === null ? '' : ele.measurementCustomerName;
            ele.orderDetailId = ele.id;
            ele.customerId = orderData.customerId;
            list.push({ id: index, value: ele.orderNo });
            moduleIds += `moduleIds=${ele.id.toString()}&`;
        })
        setKandooraNoList(list);
        setMeasurementUpdateModel(common.cloneObject(orderData));
        let apiList = [];
        apiList.push(Api.Get(apiUrls.orderController.getCustomerMeasurements + `?contactNo=${orderData.contact1.replace('+', '%2B')}`))
        apiList.push(Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `1?${moduleIds}`))
        Api.MultiCall(apiList)
            .then(res => {
                if (res[0].data.length > 0) {
                    res[0].data.forEach(ele => {
                        ele.measurementCustomerName = common.defaultIfEmpty(ele.measurementCustomerName, orderData.customerName);
                    });
                }
                setMeasuments(res[0].data);
                setUnstitchedImageList(res[1].data.filter(x => x.remark === 'unstitched'));
            });
        setMeasurementName('');
    }, [orderData]);

    const handleUpdate = () => {
        var data = common.cloneObject(measurementUpdateModel.orderDetails);
        data.forEach(ele => {
            if (ele.measurementCustomerName === '') {
                ele.measurementCustomerName = orderData.customerName.split('-')[0].trim();
            }
        });
        Api.Post(apiUrls.orderController.updateMeasurement, data)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.updateSuccess);
                    setIsDataModified(false);
                }
            });
        Api.Post(apiUrls.workDescriptionController.saveOrderWorkDescription, selectedWorkDescription).then(res => {
            if (res.data > 0) {
                toast.success(toastMessage.updateSuccess);
                setIsDataModified(false);
            }
            else {
                toast.warn(toastMessage.updateError);
            }
        })

    }

    const kandooraNoListClickHandler = (e) => {
        let mainData = measurementUpdateModel;
        mainData.orderDetails[pageNo - 1].chest = mainData.orderDetails[parseInt(e.target.value)].chest;
        mainData.orderDetails[pageNo - 1].sleeveLoose = mainData.orderDetails[parseInt(e.target.value)].sleeveLoose
        mainData.orderDetails[pageNo - 1].deep = mainData.orderDetails[parseInt(e.target.value)].deep;
        mainData.orderDetails[pageNo - 1].backDown = mainData.orderDetails[parseInt(e.target.value)].backDown;
        mainData.orderDetails[pageNo - 1].bottom = mainData.orderDetails[parseInt(e.target.value)].bottom;
        mainData.orderDetails[pageNo - 1].length = mainData.orderDetails[parseInt(e.target.value)].length;
        mainData.orderDetails[pageNo - 1].hipps = mainData.orderDetails[parseInt(e.target.value)].hipps;
        mainData.orderDetails[pageNo - 1].sleeve = mainData.orderDetails[parseInt(e.target.value)].sleeve;
        mainData.orderDetails[pageNo - 1].shoulder = mainData.orderDetails[parseInt(e.target.value)].shoulder;
        mainData.orderDetails[pageNo - 1].neck = mainData.orderDetails[parseInt(e.target.value)].neck;
        mainData.orderDetails[pageNo - 1].extra = mainData.orderDetails[parseInt(e.target.value)].extra;
        mainData.orderDetails[pageNo - 1].size = mainData.orderDetails[parseInt(e.target.value)].size;
        mainData.orderDetails[pageNo - 1].waist = mainData.orderDetails[parseInt(e.target.value)].waist;
        mainData.orderDetails[pageNo - 1].measurementCustomerName = mainData.orderDetails[parseInt(e.target.value)].measurementCustomerName;
        mainData.orderDetails[pageNo - 1].description = mainData.orderDetails[parseInt(e.target.value)].description;
        mainData.orderDetails[pageNo - 1].workType = mainData.orderDetails[parseInt(e.target.value)].workType;
        setMeasurementUpdateModel({ ...mainData });
        setIsDataModified(true);
    }

    const preMeasurementClickHandler = (data) => {
        setMeasurementName(data.measurementCustomerName);
        let mainData = measurementUpdateModel;
        mainData.orderDetails[pageNo - 1].chest = data.chest;
        mainData.orderDetails[pageNo - 1].sleeveLoose = data.sleeveLoose
        mainData.orderDetails[pageNo - 1].deep = data.deep;
        mainData.orderDetails[pageNo - 1].backDown = data.backDown;
        mainData.orderDetails[pageNo - 1].bottom = data.bottom;
        mainData.orderDetails[pageNo - 1].length = data.length;
        mainData.orderDetails[pageNo - 1].hipps = data.hipps;
        mainData.orderDetails[pageNo - 1].sleeve = data.sleeve;
        mainData.orderDetails[pageNo - 1].shoulder = data.shoulder;
        mainData.orderDetails[pageNo - 1].neck = data.neck;
        mainData.orderDetails[pageNo - 1].extra = data.extra;
        mainData.orderDetails[pageNo - 1].size = data.size;
        mainData.orderDetails[pageNo - 1].waist = data.waist;
        mainData.orderDetails[pageNo - 1].measurementCustomerName = data.measurementCustomerName;
        mainData.orderDetails[pageNo - 1].description = data.description;
        setMeasurementUpdateModel({ ...mainData });
        setIsDataModified(true);
    }

    const getUnstitchedImage = () => {
        let defaultImage
        if (unstitchedImageList.length === 0)
            return common.defaultImageUrl;
        var imgUnstiched = unstitchedImageList.find(x => x.moduleId === measurementUpdateModel.orderDetails[pageNo - 1].id);
        if (imgUnstiched === undefined)
            return common.defaultImageUrl;
        return process.env.REACT_APP_API_URL + imgUnstiched.thumbPath;
    }

    const selectWorkDescription = (data) => {
        var modal = selectedWorkDescription;
        var orderDetailId = measurementUpdateModel?.orderDetails[pageNo - 1]?.id;
        if (orderDetailId !== undefined) {
            if (modal.find(x => x.workDescriptionId === data.id) === undefined) {
                modal.push({
                    workDescriptionId: data.id,
                    orderDetailId: orderDetailId
                });
            }
            else {
                modal = common.removeByAttr(modal, "workDescriptionId", data.id);
            }
            setSelectedWorkDescription([...modal]);
            setIsDataModified(true);
        }
    }
    const saveModelNo=(e)=>{
        e.preventDefault();
        Api.Post(apiUrls.orderController.updateModelNo+ `${orderData?.orderDetails[pageNo-1].id}&modelNo=${selectedModelNo}`, {})
        .then(res => {
            if (res.data > 0) {
                toast.success(toastMessage.updateSuccess);
            }
        });
    }
    if (orderData === undefined || orderData.orderDetails === undefined || orderData.orderDetails.length === 0 || measurementUpdateModel === undefined || measurementUpdateModel === 0 || measurementUpdateModel.orderDetails === undefined || measurementUpdateModel.orderDetails.length === 0)
        return <>Data not Generate please try again.</>
    return (
        <>
            <div className="modal fade" id="measurement-update-popup-model" tabIndex="-1" aria-labelledby="measurement-update-popup-model-label" aria-hidden="true">
                <div className={pageIndex < 2 ? "modal-dialog modal-xl" : "modal-dialog modal-lg"}>
                    <div className="modal-content">
                        <div className="modal-header" style={{ padding: '5px !important' }}>
                            <h5 className="modal-title" id="measurement-update-popup-model-label">Update Kandoora Measurement</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" style={{ padding: '5px !important' }}>
                            {pageIndex === 0 && <>
                                <form className="form-horizontal form-material">
                                    <div className="d-flex flex-row justify-content-between" style={{ fontSize: 'var(--app-font-size)' }}>
                                        <div className="p-2">Order No: {orderData?.orderNo}</div>
                                        <div className="p-2">Kandoora No : {orderData?.orderDetails[pageNo - 1]?.orderNo}</div>
                                        <div className="p-2">Quantity : {paginationOption.totalRecords}</div>
                                        <div className="p-2">
                                            <Dropdown data={measuments} value={measurementName} searchable={true} text="measurementCustomerName" elementKey="measurementCustomerName" className='form-control-sm' defaultText='Pre Measurement' name='measurementName' itemOnClick={preMeasurementClickHandler} />
                                        </div>
                                        <div className="p-2">
                                            <Dropdown data={kandooraNoList} className='form-control-sm' defaultText='Get Measurement' onChange={kandooraNoListClickHandler} itemOnClick={kandooraNoListClickHandler} />
                                        </div>
                                    </div>
                                    <hr className='my-0' />
                                    <div className="card">
                                        <div className="card-body" style={{ padding: '5px !important' }}>
                                            <div className='row'>
                                                <div className={workDescriptionList.length > 0 ? 'col-4' : 'col-8'}>
                                                    <div className='row'>
                                                        <div className="col-12 col-md-3">
                                                            <Inputbox labelText="Length" labelFontSize='11px' onChangeHandler={handleTextChange} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.length} name="length" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Chest"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.chest} name="chest" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Waist"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.waist} name="waist" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Hipps"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.hipps} name="hipps" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Bottom"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.bottom} name="bottom" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Sleeve"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.sleeve} name="sleeve" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Sleeve Loo."></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.sleeveLoose} name="sleeveLoose" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Shoulder"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.shoulder} name="shoulder" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Neck"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.neck} name="neck" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Deep"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.deep} name="deep" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Back Down"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.backDown} name="backDown" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Extra"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.extra} name="extra" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12 col-md-3">
                                                            <Label fontSize='11px' text="Size"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.size} name="size" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-3">
                                                            <Label fontSize='11px' text="Work Type"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.workType} name="workType" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-6">
                                                            <Label fontSize='11px' text="C. Name"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.measurementCustomerName} name="measurementCustomerName" className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="col-12">
                                                            <Label fontSize='11px' text="Description"></Label>
                                                            <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.description} name="description" className="form-control form-control-sm" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={workDescriptionList.length > 0 ? 'col-3' : 'col-4'}>
                                                    <div className='row'>
                                                        <div className="col-12">
                                                            <div className='text-center text-danger' style={{ fontSize: '10px' }}>
                                                                Click on image to zoom
                                                            </div>
                                                            <img style={imageStyle} onClick={e => setPageIndex(1)} src={getUnstitchedImage()}></img>

                                                        </div>
                                                        <Label fontSize='11px' text="C. Name"></Label>
                                                        <div className="input-group mb-3">    
                                                        <input type="text" name='modelNo' onChange={e=>setSelectedModelNo(e.target.value.toUpperCase())} value={selectedModelNo} className="form-control form-control-sm" placeholder="" aria-label="" aria-describedby="basic-addon1" />
                                                            <div className="input-group-apend">
                                                            {/* <ButtonBox className="btn-sm" type="view">Button</ButtonBox> */}
                                                                <button type='button' className="btn-sm btn btn-info" onClick={saveModelNo}><i className='bi bi-save'></i> Save</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {workDescriptionList.length > 0 &&
                                                    <div className='col-5'>
                                                        <div className='row'>
                                                            <div className="col-12">
                                                                <div style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'row',
                                                                    flexWrap: 'wrap',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                }}>
                                                                    {workTypeList?.map((ele, index) => {
                                                                        return <>
                                                                            {workDescriptionList.find(x => x.code === ele.code) !== undefined && <>
                                                                                <div style={{ width: '100%', borderBottom: '1px solid', marginBottom: '3px' }}>{ele.value}</div>
                                                                                {workDescriptionList.filter(x => x.code === ele.code).map(wd => {
                                                                                    return <div onClick={e => selectWorkDescription(wd)} className={isWDSelected(wd.id) ? 'work-description-badge bg-info' : "work-description-badge"} style={{ fontSize: '10px' }}>
                                                                                        {wd.value}</div>
                                                                                })}
                                                                            </>}
                                                                        </>
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </form>
                                <Pagination option={paginationOption} />
                            </>}
                            {pageIndex === 1 && <>
                                <div className='row'>
                                    <div className='col-12'>
                                        <ButtonBox text="Back" className="btn btn-secondary btn-sm" icon="bi bi-arrow-left" onClickHandler={() => { setPageIndex(0); }} />
                                    </div>
                                    <div className='col-12 mt-2'>
                                        <img style={{ maxHeight: '80vh', width: '86vw', border: '3px solid', borderRadius: '10px' }} src={getUnstitchedImage()?.replace("thumb_", "")} />
                                    </div>
                                </div>
                            </>}
                            {pageIndex === 2 && <>
                                <PrintWorkDescription isWDSelected={isWDSelected} workDescriptionList={workDescriptionList} workTypeList={workTypeList} orderIndex={pageNo} orderData={orderData} pageIndex={pageIndex} setPageIndex={setPageIndex} />
                            </>}
                            {pageIndex === 3 && <>
                                <PrintWorkerSheet orderIndex={pageNo} orderData={orderData} pageIndex={pageIndex} setPageIndex={setPageIndex} />
                            </>}
                        </div>

                        <div className="modal-footer" style={{ padding: '3px' }}>
                            {pageIndex === 0 && <>
                                <ButtonBox type="print" text="Print Work Type" onClickHandler={() => { setPageIndex(2) }} className="btn-sm" />
                                <ButtonBox type="print" onClickHandler={() => { setPageIndex(3) }} className="btn-sm" text="Print Worker Sheet" />
                                <ButtonBox type="update" onClickHandler={handleUpdate} disabled={!isDataModified} className="btn-sm" />
                            </>}
                            <ButtonBox type="cancel" text="Close" modelDismiss={true} className="btn-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
