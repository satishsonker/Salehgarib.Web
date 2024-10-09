import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { orderStatus, toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Label from '../common/Label';
import Pagination from '../tables/Pagination';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';
import PrintWorkDescription from '../print/PrintWorkDescription';
import PrintWorkerSheet from '../print/PrintWorkerSheet';
import UpdateDesignModelPopup from '../Popups/UpdateDesignModelPopup';
import ImageUploadWithPreview from '../common/ImageUploadWithPreview';
import SearchableDropdown from '../common/SearchableDropdown/SearchableDropdown';
import ImagePreview from '../common/ImagePreview';

export default function MeasurementUpdatePopop({ orderData, searchHandler }) {
    let sortedOrderDetails = undefined;
    if (orderData !== undefined && orderData?.orderDetails !== undefined && orderData?.orderDetails?.length > 0) {
        orderData.orderDetails = orderData.orderDetails.filter(x => !x.isCancelled && !x.isDeleted);
        sortedOrderDetails = orderData?.orderDetails?.sort((a, b) => {
            return parseInt(a?.orderNo?.split("-")[1]) - parseInt(b?.orderNo?.split("-")[1]);
        })
    }
    const [pageNo, setPageNo] = useState(1);
    const [selectedModelNo, setSelectedModelNo] = useState((sortedOrderDetails || [])[pageNo - 1]?.designModel || "");
    const [measuments, setMeasuments] = useState([]);
    const [measurementName, setMeasurementName] = useState("");
    const [unstitchedImageList, setUnstitchedImageList] = useState([]);
    const [workDescriptionList, setWorkDescriptionList] = useState([]);
    const [workTypeList, setWorkTypeList] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [isWorkTypeUpdated, setIsWorkTypeUpdated] = useState(false);
    const [selectImagePathForPreview, setSelectImagePathForPreview] = useState({ moduleId: 0, path: "" })
    const [usedModalNo, setUsedModalNo] = useState([]);
    const [selectedUsedModel, setSelectedUsedModel] = useState("0");
    const [usedModelSearchQuery, setUsedModelSearchQuery] = useState("");
    useEffect(() => {
    }, []);

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
        totalRecords: sortedOrderDetails?.length,
        pageSize: 1
    }

    const [printModel, setPrintModel] = useState({
        samePrint: '',
        newModel: '',
        likeModel: ''
    });

    const [kandooraNoList, setKandooraNoList] = useState([]);
    const [refreshData, setRefreshData] = useState(0);
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
        if (name === 'workType') {
            setIsWorkTypeUpdated(true);
        }
    }
    useEffect(() => {
        let apiList = [];
        if (orderData.orderDetails === undefined)
            return;
        var orderDetailId = orderData.orderDetails[pageNo - 1]?.id ?? 0;
        setSelectedModelNo(orderData.orderDetails[pageNo - 1]?.designModel ?? "")
        apiList.push(Api.Get(apiUrls.workDescriptionController.getByWorkTypes + sortedOrderDetails[pageNo - 1]?.workType));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataType + "?masterdatatype=work_type"));
        if (orderDetailId !== undefined || orderDetailId > 0) {
            apiList.push(Api.Get(apiUrls.workDescriptionController.getOrderWorkDescription + orderDetailId))
        }
        Api.MultiCall(apiList)
            .then(res => {
                setWorkDescriptionList(res[0].data);
                arrangeWorkTypeList(res[1].data);
                if (orderDetailId !== undefined) {
                    var workData = res[2].data;
                    setSelectedWorkDescription([...workData]);
                    if (workData.length > 0) {
                        var pModel = printModel;
                        pModel.likeModel = workData.find(x => x.likeModel !== null) === undefined ? "" : workData.find(x => x.likeModel !== null).likeModel;
                        pModel.samePrint = workData.find(x => x.samePrint !== null) === undefined ? "" : workData.find(x => x.samePrint !== null).samePrint;
                        pModel.newModel = workData.find(x => x.newModel !== null) === undefined ? "" : workData.find(x => x.newModel !== null).newModel;
                        setPrintModel({ ...pModel });
                    }
                }
                debugger;
                if(pageNo>sortedOrderDetails?.length)
                {
                    setPageNo(1);
                }
            });
        setPageIndex(0);
        setIsDataModified(false);
        setIsWorkTypeUpdated(false);
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
            moduleIds += `moduleIds=${ele?.id?.toString()}&`;
        })
        setKandooraNoList(list);
        setMeasurementUpdateModel(common.cloneObject(orderData));
        let apiList = [];
        apiList.push(Api.Get(apiUrls.orderController.getCustomerMeasurements + `?contactNo=${orderData?.contact1?.replace('+', '%2B')}`))
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
                    toast.success("Measurement " + toastMessage.updateSuccess);
                    setIsDataModified(false);
                    setRefreshData(pre => pre + 1);
                }
            });
        if (selectedWorkDescription.filter(x => x.isNew)?.length > 0) {
            Api.Post(apiUrls.workDescriptionController.saveOrderWorkDescription, selectedWorkDescription).then(res => {
                if (res.data > 0) {
                    toast.success("Work Desciptions " + toastMessage.updateSuccess);
                    setIsDataModified(false);
                    setRefreshData(pre => pre + 1);
                }
                else {
                    toast.warn(toastMessage.updateError);
                }
            })
        }

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

    const usedModalChangeHandle = (e) => {
        setSelectedUsedModel(e.target.value);
        setSelectedModelNo(usedModalNo.find(x => x.id === e.target.value).value);
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
        if (unstitchedImageList.length === 0)
            return common.defaultImageUrl;
        var imgUnstiched = unstitchedImageList.find(x => x.moduleId === measurementUpdateModel?.orderDetails[pageNo - 1]?.id);
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
                    orderDetailId: orderDetailId,
                    samePrint: printModel.samePrint,
                    newModel: printModel.newModel,
                    likeModel: printModel.likeModel,
                    isNew: true,
                });
            }
            else {
                modal = common.removeByAttr(modal, "workDescriptionId", data.id);
            }
            setSelectedWorkDescription([...modal]);
            setIsDataModified(true);
        }
    }

    const saveModelNo = (e) => {
        e.preventDefault();
        Api.Post(apiUrls.orderController.updateModelNo + `${sortedOrderDetails[pageNo - 1].id}&modelNo=${selectedModelNo}`, {})
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.updateSuccess);
                    setRefreshData(pre => pre + 1);
                }
            });
    }

    const validateWorkType = (wType) => {
        var validWorkType = "1234567";
        var isValid = true;
        for (var x of wType) {
            if (validWorkType.indexOf(x) === -1) {
                isValid = false;
            }
        }
        return isValid;
    }

    const updateExistingWorkType = () => {
        if (!validateWorkType(measurementUpdateModel.orderDetails[pageNo - 1]?.workType)) {
            toast.warn('Please enter valid work type!');
            return;
        }
        let apiList = [];
        apiList.push(Api.Post(apiUrls.workTypeStatusController.updateExisting + `${sortedOrderDetails[pageNo - 1].id}&workType=${measurementUpdateModel.orderDetails[pageNo - 1]?.workType}`, {}))
        apiList.push(Api.Get(apiUrls.workDescriptionController.getOrderWorkDescription + measurementUpdateModel.orderDetails[pageNo - 1]?.id));
        Api.MultiCall(apiList)
            .then(res => {
                if (res[0].data > 0) {
                    toast.success(toastMessage.saveSuccess);
                    setIsWorkTypeUpdated(false);
                    setSelectedWorkDescription([...res[1].data]);
                }
                else
                    toast.warn(toastMessage.saveError);
            })
    }

    const changePrintModel = (e) => {
        var { name, value } = e.target;
        var model = selectedWorkDescription;
        var newPrintModel = printModel;
        newPrintModel[name] = value;
        model.forEach(res => {
            res.newModel = newPrintModel.newModel;
            res.likeModel = newPrintModel.likeModel;
            res.samePrint = newPrintModel.samePrint;
        });
        setPrintModel({ ...newPrintModel });
        setSelectedWorkDescription([...model]);
        setIsDataModified(true);
    }

    const arrangeWorkTypeList = (data) => {
        var newData = [];
        for (let index = 1; index < 9; index++) {
            var filteredWorkType = data?.find(x => x.code === index.toString());
            if (filteredWorkType !== undefined) {
                newData.push(filteredWorkType);
            }
        }
        setWorkTypeList(newData);
    }

    const canUpdateWorkType = () => {
        return isDataModified //&& (measurementUpdateModel?.orderDetails[pageNo - 1]?.status === "Active" || measurementUpdateModel?.orderDetails[pageNo - 1]?.status === "Processing")
    }

    const disableWorkType = () => {
        return false;//!(measurementUpdateModel?.orderDetails[pageNo - 1]?.status === "Active" || measurementUpdateModel?.orderDetails[pageNo - 1]?.status === "Processing")
    }

    const handleSetModelNo = (data) => {
        setSelectedModelNo(data);
    }

    const disableModelNoPopup = (data) => {
        var status = data?.status?.toLowerCase();
        var model = data?.designModel;
        if (status === orderStatus.active.code || status === orderStatus.processing.code || model === "" || model === null || model === undefined)
            return ""
        return "disabled"
    }

    useEffect(() => {
        var contactNo = orderData?.contact1;
        if (contactNo !== undefined)
            Api.Get(apiUrls.orderController.getUsedModalByContact + common.contactNoEncoder(contactNo))
                .then(res => {
                    setUsedModalNo(res.data);
                })
    }, [orderData?.contact1])

    if (orderData === undefined || orderData.orderDetails === undefined || orderData.orderDetails.length === 0 || measurementUpdateModel === undefined || measurementUpdateModel === 0 || measurementUpdateModel.orderDetails === undefined || measurementUpdateModel.orderDetails.length === 0)
        return <>Data not Generate please try again.</>

    return (
        <>
            <div className="modal fade" id="measurement-update-popup-model" tabIndex="-1" aria-labelledby="measurement-update-popup-model-label" aria-hidden="true">
                <div className={pageIndex < 2 || pageIndex === 4 || pageIndex === 7 || pageIndex === 8 ? "modal-dialog modal-xl" : "modal-dialog modal-lg"}>
                    <div className="modal-content">
                        <div className="modal-header" style={{ padding: '5px !important' }}>
                            <h5 className="modal-title" id="measurement-update-popup-model-label">Update Kandoora Measurement for Order No: {orderData?.orderNo}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" style={{ padding: '5px !important' }}>
                            {pageIndex === 0 && <>
                                <div className="d-flex flex-row justify-content-between" style={{ fontSize: 'var(--app-font-size)' }}>
                                    <div className="p-2 fw-bold">Kandoora No : {sortedOrderDetails[pageNo - 1]?.orderNo}</div>
                                    <div className="p-2 fw-bold">Quantity : {paginationOption.totalRecords}</div>
                                    <div className="p-2 fw-bold">Grade : {sortedOrderDetails[pageNo - 1]?.price}/{common.getGrade(sortedOrderDetails[pageNo - 1]?.price)}</div>
                                    <div className="p-2">
                                        <SearchableDropdown data={usedModalNo} value={selectedUsedModel} setSearchQuery={setSelectedModelNo} searchable={true} elementKey="id" className='form-control-sm w-100' defaultText='Already Used Modal' name='usedModal' onChange={usedModalChangeHandle} />
                                    </div>
                                    <div className="p-2">
                                        <SearchableDropdown data={measuments} value={measurementName} searchable={true} text="measurementCustomerName" elementKey="measurementCustomerName" className='form-control-sm  w-100' optionWidth="100%" defaultText='Pre Measurement' name='measurementName' itemOnClick={preMeasurementClickHandler} />
                                    </div>
                                    <div className="p-2">
                                        <SearchableDropdown data={kandooraNoList} className='form-control-sm' defaultText='Get Measurement' onChange={kandooraNoListClickHandler} itemOnClick={kandooraNoListClickHandler} />
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

                                                    <div className="col-9">
                                                        <Label fontSize='11px' text="Description"></Label>
                                                        <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.description} name="description" className="form-control form-control-sm" />
                                                    </div>
                                                    <div className="col-6">
                                                        <Label fontSize='11px' text="Work Type"></Label>
                                                        <div className="input-group mb-3">
                                                            <input disabled={disableWorkType() ? "disabled" : ""} type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.workType} name="workType" className="form-control form-control-sm" />
                                                            <div className="input-group-apend">
                                                                {canUpdateWorkType() && <button type='button' className="btn-sm btn btn-info" onClick={updateExistingWorkType}><i className='bi bi-save'></i> Save</button>}
                                                            </div>
                                                            {/* {isWorkTypeUpdated &&
                                                                <div className='text-danger' style={{ fontSize: '9px' }}>
                                                                    If Any Work type is in completed state. it will delete any work type which is completed
                                                                </div>} */}
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <Label fontSize='11px' text="C. Name"></Label>
                                                        <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.measurementCustomerName} name="measurementCustomerName" className="form-control form-control-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={workDescriptionList.length > 0 ? 'col-3' : 'col-4'}>
                                                <div className='row'>
                                                    <div className="col-12 mb-2">
                                                        <div className='text-center text-danger' style={{ fontSize: '10px' }}>
                                                            Click on image to zoom
                                                        </div>
                                                        <img alt='loading picture...' style={imageStyle} onClick={e => setPageIndex(1)} src={getUnstitchedImage()} onError={(e) => { e.target.src = "/assets/images/default-image.jpg" }}></img>

                                                    </div>

                                                    <Label fontSize='11px' text="Model No"></Label>
                                                    <div className="input-group mb-3">
                                                        <input type="text" name='modelNo' onChange={e => setSelectedModelNo(e.target.value.toUpperCase())} value={selectedModelNo} className="form-control form-control-sm" placeholder="" aria-label="" aria-describedby="basic-addon1" disabled={disableModelNoPopup(measurementUpdateModel?.orderDetails[pageNo - 1])} />
                                                        <div className="input-group-apend">
                                                            {disableModelNoPopup(measurementUpdateModel?.orderDetails[pageNo - 1]) === "" && <>
                                                                <ButtonBox className="btn-sm" text=" " onClickHandler={() => { setPageIndex(4) }} type="view"></ButtonBox>
                                                                <button type='button' className="btn-sm btn btn-info" onClick={saveModelNo}><i className='bi bi-save'></i></button>
                                                            </>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {workDescriptionList.length > 0 &&
                                                <div className='col-5'>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <Inputbox labelText="Same Print" disabled={selectedWorkDescription.length === 0} value={printModel.samePrint} name="samePrint" onChangeHandler={changePrintModel} className="form-control-sm" />
                                                        </div>
                                                        <div className='col-4'>
                                                            <Inputbox labelText="New Model" disabled={selectedWorkDescription.length === 0} value={printModel.newModel} name="newModel" onChangeHandler={changePrintModel} className="form-control-sm" />
                                                        </div>
                                                        <div className='col-4'>
                                                            <Inputbox labelText="Like Model" disabled={selectedWorkDescription.length === 0} value={printModel.likeModel} name="likeModel" onChangeHandler={changePrintModel} className="form-control-sm" />
                                                        </div>
                                                        <div className="col-12">
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                flexWrap: 'wrap',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                            }}>
                                                                {workTypeList?.map((ele, index) => {
                                                                    return <React.Fragment key={index}>
                                                                        {workDescriptionList.find(x => x.code === ele.code) !== undefined && <>
                                                                            <div key={index} style={{ width: '100%', borderBottom: '1px solid', marginBottom: '3px' }}>{ele.value}</div>
                                                                            {workDescriptionList.filter(x => x.code === ele.code).map((wd, ind) => {
                                                                                return <div key={ind} onClick={e => selectWorkDescription(wd)} className={isWDSelected(wd.id) ? 'work-description-badge bg-info' : "work-description-badge"} style={{ fontSize: '10px' }}>
                                                                                    {wd.value}</div>
                                                                            })}
                                                                        </>}
                                                                    </React.Fragment>
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>

                                    </div>
                                </div>
                                <Pagination option={paginationOption} />
                            </>}
                            {pageIndex === 1 && <>
                                <div className='row'>
                                    <div className='col-12'>
                                        <ButtonBox text="Back" className="btn btn-secondary btn-sm" icon="bi bi-arrow-left" onClickHandler={() => { setPageIndex(0); }} />
                                    </div>
                                    <div className='col-12 mt-2'>
                                        <img style={{ maxHeight: '80vh', minHeight: '70vh', width: '100%', border: '3px solid', borderRadius: '10px' }} src={getUnstitchedImage()?.replace("thumb_", "")} />
                                    </div>
                                </div>
                            </>}
                            {pageIndex === 2 && <>
                                <PrintWorkDescription printModel={printModel} isWDSelected={isWDSelected} workDescriptionList={workDescriptionList} workTypeList={workTypeList} orderIndex={pageNo} orderData={orderData} pageIndex={pageIndex} setPageIndex={setPageIndex} />
                            </>}
                            {pageIndex === 3 && <>
                                <PrintWorkerSheet orderIndex={pageNo} orderData={orderData} pageIndex={pageIndex} setPageIndex={setPageIndex} refreshData={refreshData} />
                            </>}
                            {pageIndex === 4 && <>
                                <div className='row'>
                                    <div className='col-12'>
                                        <ButtonBox text="Back" className="btn btn-secondary btn-sm" icon="bi bi-arrow-left" onClickHandler={() => { setPageIndex(0); }} />
                                    </div>
                                    <div className='col-12 mt-2'>
                                        <UpdateDesignModelPopup showModel={false} workSheetData={{ orderDetailId: measurementUpdateModel?.orderDetails[pageNo - 1]?.id, kandooraNo: measurementUpdateModel?.orderDetails[pageNo - 1]?.orderNo }} returnModelNoHandler={handleSetModelNo} />
                                    </div>
                                </div>
                            </>}
                            {pageIndex === 6 && <>
                                <div className='row'>
                                    <div className='col-12 text-center fw-bold'>
                                        Kandoora No : {sortedOrderDetails[pageNo - 1].orderNo}
                                    </div>
                                    <div className='col-12'>
                                        <ButtonBox text="Back" className="btn btn-secondary btn-sm" icon="bi bi-arrow-left" onClickHandler={() => { setPageIndex(0); }} />
                                    </div>
                                    <div className='col-12 mt-2'>
                                        <div className='row'>
                                            <div className='col-md-6 col-sm-12'>
                                                <ImageUploadWithPreview title="Unstitched Image" description="upload unstitched cloth's image" moduleId={sortedOrderDetails[pageNo - 1].id} remark="unstitched"></ImageUploadWithPreview>
                                            </div>
                                            <div className='col-md-6 col-sm-12'>
                                                <ImageUploadWithPreview title="Stitched Image" description="upload stitched cloth's image" moduleId={sortedOrderDetails[pageNo - 1].id} remark="stitched"></ImageUploadWithPreview>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>}
                            {pageIndex === 7 && <>
                                <div className='row'>
                                    <div className='col-12 d-flex justify-content-between'>
                                        <ButtonBox text="Back" className="btn btn-secondary btn-sm" icon="bi bi-arrow-left" onClickHandler={() => { setPageIndex(0); }} />
                                        <div className='text-success'>Click on Image to zoom</div>
                                    </div>
                                    <div className='col-12'>
                                        <div className='kandoora-grp-image'>
                                            {
                                                unstitchedImageList?.map((ele, index) => {
                                                    return <div style={{ position: 'relative' }}>
                                                        <div className='kan-no'>{measurementUpdateModel?.orderDetails?.find(x => x.id === ele.moduleId)?.orderNo}</div>
                                                     <ImagePreview onClick={e => { setPageIndex(8); setSelectImagePathForPreview({ moduleId: ele.moduleId, path: process.env.REACT_APP_API_URL + ele.filePath }) }} width="200px" alt={measurementUpdateModel?.orderDetails?.find(x => x.id === ele.moduleId)?.orderNo} key={index} src={process.env.REACT_APP_API_URL + ele.thumbPath} />
                                                    </div>
                                                })
                                            }
                                        </div>

                                    </div>
                                </div>
                            </>}
                            {pageIndex === 8 && <>
                                <div className='row'>
                                    <div className='col-12'>
                                        <ButtonBox text="Back" className="btn btn-secondary btn-sm" icon="bi bi-arrow-left" onClickHandler={() => { setPageIndex(7); }} />
                                    </div>
                                    <div className='col-12'>
                                        <div className='text-center text-danger'>
                                            Kandoora No. : {measurementUpdateModel?.orderDetails?.find(x => x.id === selectImagePathForPreview.moduleId)?.orderNo}
                                        </div>
                                        <ImagePreview
                                            alt={measurementUpdateModel?.orderDetails?.find(x => x.id === selectImagePathForPreview.moduleId)?.orderNo}
                                            src={selectImagePathForPreview.path} />
                                    </div>
                                </div>
                            </>}
                        </div>

                        <div className="modal-footer" style={{ padding: '3px' }}>
                            {pageIndex === 0 && <>
                                <ButtonBox type="print" text="Print Work Type" onClickHandler={() => { setPageIndex(2) }} className="btn-sm" />
                                <ButtonBox type="save" icon="bi bi-camera" text="Update Image" onClickHandler={() => { setPageIndex(6) }} className="btn-sm" />
                                <ButtonBox type="update" icon="bi bi-images" text="All Image" onClickHandler={() => { setPageIndex(7) }} className="btn-sm" />
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
