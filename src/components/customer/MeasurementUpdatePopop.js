import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import { PrintWorkerSheet } from '../print/PrintWorkerSheet';
import Pagination from '../tables/Pagination';
import { useReactToPrint } from 'react-to-print';

export default function MeasurementUpdatePopop({ orderData, searchHandler }) {

    const printWorkerSheetRef = useRef();
    const [pageNo, setPageNo] = useState(1);
    const [workerSheetDataToPrint, setWorkerSheetDataToPrint] = useState({});
    const [measuments, setMeasuments] = useState([]);
    const [measurementName, setMeasurementName] = useState("");
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
    const handleTextChange = (e) => {
        let { name, value } = e.target;
        let mainData = measurementUpdateModel;
        mainData.orderDetails[pageNo - 1][name] = value;
        setMeasurementUpdateModel({ ...mainData });
        setIsDataModified(true);
    }

    useEffect(() => {
        if (orderData === undefined || orderData.orderDetails === undefined || orderData.orderDetails.length === 0 || !Array.isArray(orderData.orderDetails))
            return;
        let list = [];
        orderData.orderDetails.forEach((ele, index) => {
            ele.measurementCustomerName = ele.measurementCustomerName === null ? '' : ele.measurementCustomerName;
            ele.orderDetailId = ele.id;
            ele.customerId = orderData.customerId;
            list.push({ id: index, value: ele.orderNo });
        })
        setKandooraNoList(list);
        setMeasurementUpdateModel(common.cloneObject(orderData));
        Api.Get(apiUrls.orderController.getCustomerMeasurements + `?contactNo=${orderData.contact1.replace('+', '%2B')}`)
            .then(res => {
                if (res.data.length > 0) {
                    res.data.forEach(ele => {
                        ele.measurementCustomerName = common.defaultIfEmpty(ele.measurementCustomerName, orderData.customerName);
                    });
                }
                setMeasuments(res.data);
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
                    // common.closePopup('measurement-update-popup-model');
                    //searchHandler('');
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

    const printWorkerSheetHandler = useReactToPrint({
        content: () => printWorkerSheetRef.current
    });

    const printWorkerSheetHandlerMain = (id, data) => {
        setWorkerSheetDataToPrint(data);
        printWorkerSheetHandler();
    }

    if (orderData === undefined || orderData.orderDetails === undefined || orderData.orderDetails.length === 0 || measurementUpdateModel === undefined || measurementUpdateModel === 0 || measurementUpdateModel.orderDetails === undefined || measurementUpdateModel.orderDetails.length === 0)
        return <>Data not Generate please try again.</>
    return (
        <>
            <div className="modal fade" id="measurement-update-popup-model" tabIndex="-1" aria-labelledby="measurement-update-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="measurement-update-popup-model-label">Update Kandoora Measurement</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'none' }}>
                                <PrintWorkerSheet props={workerSheetDataToPrint} ref={printWorkerSheetRef}></PrintWorkerSheet>
                            </div>
                            <form className="form-horizontal form-material">
                                <div className="d-flex flex-row justify-content-between" style={{ fontSize: 'var(--app-font-size)' }}>
                                    <div className="p-2">Order No: {orderData?.orderNo}</div>
                                    <div className="p-2">Kandoora No : {orderData?.orderDetails[pageNo - 1]?.orderNo}</div>
                                    <div className="p-2">Quantity : {paginationOption.totalRecords}</div>
                                    <div className="p-2">
                                        <Dropdown data={measuments} value={measurementName} searchable={true} text="measurementCustomerName" elemenyKey="measurementCustomerName" className='form-control-sm' defaultText='Pre Measurement' name='measurementName' itemOnClick={preMeasurementClickHandler} />
                                    </div>
                                    <div className="p-2">
                                        <Dropdown data={kandooraNoList} className='form-control-sm' defaultText='Get Measurement' onChange={kandooraNoListClickHandler} itemOnClick={kandooraNoListClickHandler} />
                                    </div>
                                </div>
                                <hr className='my-0' />
                                <div className="card">
                                    <div className="card-body">
                                        <div className='row'>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Length"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.length} name="length" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Chest"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.chest} name="chest" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Waist"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.waist} name="waist" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Hipps"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.hipps} name="hipps" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Bottom"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.bottom} name="bottom" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Sleeve"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.sleeve} name="sleeve" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Sleeve Loo."></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.sleeveLoose} name="sleeveLoose" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Shoulder"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.shoulder} name="shoulder" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Neck"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.neck} name="neck" className="form-control form-control-sm" />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Deep"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.deep} name="deep" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Back Down"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.backDown} name="backDown" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Extra"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.extra} name="extra" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Size"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.size} name="size" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='11px' text="Customer Name"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.measurementCustomerName} name="measurementCustomerName" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-4">
                                                <Label fontSize='11px' text="Description"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.description} name="description" className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-4">
                                                <Label fontSize='11px' text="Work Type"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={measurementUpdateModel?.orderDetails[pageNo - 1]?.workType} name="workType" className="form-control form-control-sm" />
                                            </div>
                                            <div className='clearfix'></div>

                                        </div>
                                    </div>
                                </div>
                            </form>
                            <Pagination option={paginationOption} />

                        </div>

                        <div className="modal-footer">
                            <button type="button" onClick={e => printWorkerSheetHandlerMain(0, orderData)} className="btn btn-warning" >Print Worker Sheet</button>
                            <button type="button" onClick={e => handleUpdate()} className="btn btn-info" disabled={isDataModified ? '' : 'disabled'} >Update</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
