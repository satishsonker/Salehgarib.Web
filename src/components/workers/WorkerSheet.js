import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { toastMessage } from '../../constants/ConstantValues'
import { common } from '../../utils/common'
import Breadcrumb from '../common/Breadcrumb'
import FixedExpensePopup from '../Popups/FixedExpensePopup'
import Label from '../common/Label'
import UpdateDesignModelPopup from '../Popups/UpdateDesignModelPopup'
import ButtonBox from '../common/ButtonBox'
import Inputbox from '../common/Inputbox'
import ImageZoomInPopup from '../Popups/ImageZoomInPopup'
import CrystalTrackingPopup from '../crystal/CrystalTrackingPopup'
import UpdateCompletedOnAndEmpInCrystalTracking from '../Popups/UpdateCompletedOnAndEmpInCrystalTracking'
import SearchableDropdown from '../common/SearchableDropdown/SearchableDropdown'
import AddCrystalAlterRecord from '../Popups/AddCrystalAlterRecord'
export default function WorkerSheet() {
    const workSheetModelTemplete = {
        orderNo: '',
        orderNoText: 0,
        orderDetailNo: '',
        voucherNo: 'xxxxxxxxx',
        customerName: "",
        deliveryDate: "",
        modelNo: '',
        kandooraNo: '',
        quantity: 0,
        crystalUsed: 0,
        salesman: "",
        chest: 0.0,
        sleeveLoose: 0.0,
        deep: 0.0,
        backDown: 0.0,
        bottom: 0.0,
        length: 0.0,
        hipps: 0.0,
        sleeve: 0.0,
        shoulder: 0.0,
        neck: 0.0,
        extra: 0.0,
        cuff: 0,
        size: 0,
        waist: 0,
        status: '',
        description: "",
        totalAmount: 0,
        fixedExpense: 0,
        profit: 0,
        orderDetailId: 0,
        designSampleId: 0,
        isSaved: false,
        subTotalAmount: 0,
        workTypeStatus: [],
        designModel: ""
    };
    const MIN_DATE_TIME = "0001-01-01T00:00:00";
    const [workSheetModel, setWorkSheetModel] = useState(workSheetModelTemplete)
    const [orderNumberList, setOrderNumberList] = useState([]);
    const [workTypeStatusList, setworkTypeStatusList] = useState([])
    const [orderDetailNumberList, setOrderDetailNumberList] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [errors, setErrors] = useState({});
    const [fixedExpense, setFixedExpense] = useState(0);
    const [employeeList, setEmployeeList] = useState([]);
    const [orderDetailsId, setOrderDetailsId] = useState(0);
    const [unstitchedImageList, setUnstitchedImageList] = useState([]);
    const [usedCrystalData, setUsedCrystalData] = useState([]);
    const [isCrystalTrackingSaved, setIsCrystalTrackingSaved] = useState(0);
    const [refreshData, setRefreshData] = useState(0);
    const imageStyle = {
        border: '3px solid gray',
        borderRadius: '7px',
        maxHeight: '250px',
        width: '100%',
        cursor: "zoom-in"
    }
    const breadcrumbOption = {
        title: 'Worker Sheet',
        items: [
            {
                isActive: false,
                title: "Worker Sheet",
                icon: "bi bi-file-spreadsheet"
            }
        ]
    }
    // use Effects Start
    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.orderController.getByOrderNumber));
        apiList.push(Api.Get(apiUrls.masterController.kandooraExpense.getAllExpenseSum));
        apiList.push(Api.Get(apiUrls.employeeController.getAll + `?pageno=1&pageSize=100000`));
        Api.MultiCall(apiList)
            .then(res => {
                let orderList = [];
                res[0].data.forEach(element => {
                    orderList.push({ id: element.orderId, value: element.orderNo });
                });
                setOrderNumberList(orderList);
                setFixedExpense(res[1].data);
                setEmployeeList(res[2].data.data);
            });
    }, []);

    useEffect(() => {
        if (orderDetailsId === 0)
            return;
        setUsedCrystalData([]);
        let apiList = [];
        apiList.push(Api.Get(apiUrls.workTypeStatusController.get + `?orderDetailId=${workSheetModel.orderDetailId}`));
        apiList.push(Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `1?moduleIds=${orderDetailsId}`))
        apiList.push(Api.Get(apiUrls.crytalTrackingController.getTrackingOutByOrderDetailId + workSheetModel.orderDetailId))
        Api.MultiCall(apiList)
            .then(
                res => {
                    setworkTypeStatusList(res[0].data);
                    let mainData = workSheetModel;
                    let workPrice = 0;
                    mainData.workTypeStatus = res[0].data;
                    mainData.workTypeStatus.forEach(ele => {
                        ele.completedOn = ele.completedOn === MIN_DATE_TIME ? common.getHtmlDate(new Date()) : ele.completedOn;
                        if (ele?.workType?.toLowerCase() === "crystal used" && res[2].data?.length > 0) {
                            ele.completedOn = res[2].data[0]?.releaseDate === MIN_DATE_TIME ? common.getHtmlDate(new Date()) : res[2].data[0]?.releaseDate;
                            ele.completedBy = res[2].data[0]?.employeeId ?? null;
                            ele.note = res[2].data[0]?.note ?? "";
                            ele.completedByName = res[2].data[0]?.employeeName ?? null;
                            ele.price = res[2].data[0]?.crystalTrackingOutDetails?.reduce((sum, sumEle) => {
                                if (!sumEle?.isAlterWork) {
                                    return sum += sumEle.articalLabourCharge + sumEle.crystalLabourCharge;
                                }
                                return sum;
                            }, 0);
                            ele.extra = res[2].data[0]?.crystalTrackingOutDetails?.reduce((sum, sumEle) => {
                                if (sumEle?.isAlterWork) {
                                    return sum += sumEle.articalLabourCharge + sumEle.crystalLabourCharge;
                                }
                                return sum;
                            }, 0);
                        }
                        if (ele.price !== null && typeof ele.price === 'number') {
                            workPrice += ele.price;
                        }
                    });
                    mainData.profit = mainData.subTotalAmount - fixedExpense - workPrice;
                    setUnstitchedImageList(res[1].data.filter(x => x.remark === 'unstitched'));
                    var crystalData = res[2].data;
                    setUsedCrystalData([...crystalData]);
                }
            )
    }, [orderDetailsId, isCrystalTrackingSaved,refreshData])

    // end Effects Start

    const handleTextChange = (e, index) => {

        var { value, type, name } = e.target;
        let data = workSheetModel;
        if (type === 'select-one' && name !== "orderDetailNo" && name !== "orderNo") {
            value = parseInt(value);
        }
        else if (type === 'number') {
            value = parseFloat(value);
        }

        data[name] = value;

        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null })
        }
        if (index !== undefined && index > -1) {
            data.workTypeStatus[index][name] = value;
            if (name === 'price') {
                value = isNaN(value) ? 0 : value;
                data.profit = data.subTotalAmount - fixedExpense - value;
            }
        }
        if (name === 'completedBy') {
            var selectedEmp = employeeList.find(x => x.id === value);
            if (selectedEmp !== undefined) {
                data.workTypeStatus[index].completedByName = selectedEmp.firstName + ' ' + selectedEmp.lastName;
            }
        }

        setWorkSheetModel({ ...data });
    }
    const selectOrderNoHandler = (data) => {
        setOrderDetailNumberList([]);
        workSheetModelTemplete.orderNo = workSheetModel.orderNo;
        setWorkSheetModel(workSheetModelTemplete);
        Api.Get(apiUrls.orderController.get + data.id)
            .then(res => {
                setOrderData(res.data);
                let orderDetailNos = [];
                res.data.orderDetails.forEach(element => {
                    orderDetailNos.push({ id: element.id, value: element.orderNo });
                });
                setOrderDetailNumberList(orderDetailNos);
            });
    }

    const selectComplyedByHandler = (data, index) => {
        let mainData = workSheetModel;
        mainData.workTypeStatus[index]["completedBy"] = data.id;
        setWorkSheetModel({ ...mainData });
    }

    const selectOrderDetailNoHandler = (data) => {
        let mainData = workSheetModel;
        if (mainData !== undefined && mainData?.orderDetailId === data?.id)
            return;
        let orderDetail = orderData.orderDetails.find(x => x.orderNo === data.value);
        mainData.customerName = orderData.customerName;
        mainData.salesman = orderData.salesman;
        mainData.orderNoText = orderData.orderNo;
        mainData.kandooraNo = data.value;
        mainData.price = orderDetail.subTotalAmount;
        mainData.crystal = orderDetail.crystal;
        mainData.orderDetailNo = data.value;
        mainData.deliveryDate = common.getHtmlDate(new Date(orderDetail.orderDeliveryDate));
        mainData.quantity = 1;
        mainData.description = orderDetail.description;
        mainData.crystalUsed = orderDetail.crystal === "" ? 0 : parseFloat(orderDetail.crystal).toFixed(2);
        mainData.modelNo = orderDetail?.designModel ?? "";
        mainData.chest = orderDetail.chest;
        mainData.sleeveLoose = orderDetail.sleeveLoose;
        mainData.deep = orderDetail.deep;
        mainData.backDown = orderDetail.backDown;
        mainData.bottom = orderDetail.bottom;
        mainData.length = orderDetail.length;
        mainData.hipps = orderDetail.hipps;
        mainData.sleeve = orderDetail.sleeve;
        mainData.shoulder = orderDetail.shoulder;
        mainData.neck = orderDetail.neck;
        mainData.extra = orderDetail.extra;
        mainData.cuff = orderDetail.cuff;
        mainData.size = orderDetail.size;
        mainData.waist = orderDetail.waist;
        mainData.status = orderDetail.status;
        mainData.totalAmount = orderDetail.totalAmount;
        mainData.subTotalAmount = orderDetail.subTotalAmount;
        mainData.designModel = orderDetail?.designModel ?? "";
        mainData.fixedExpense = fixedExpense;
        mainData.profit = mainData.subTotalAmount - fixedExpense;
        mainData.orderDetailId = data.id;
        mainData.measurementCustomerName = orderDetail.measurementCustomerName;
        setOrderDetailsId(data.id);
        setWorkSheetModel({ ...mainData });
    }

    const filterEmployeeByWorkType = (workType) => {
        switch (workType.toLowerCase()) {
            case 'apliq':
                return employeeList.filter(x => x.jobTitle.toLowerCase() === "aplik cutworker" || x.jobTitle.toLowerCase() === "apliq cutworker" || x.jobTitle.toLowerCase() === "aplik cutter");
            case 'cutting':
                return employeeList.filter(x => x.jobTitle.toLowerCase() === "cutting master" || x.jobTitle.toLowerCase() === "cutter master");
            case 'designing':
                return employeeList.filter(x => x.jobTitle.toLowerCase() === "designer");
            case 'hand embroidery':
                return employeeList.filter(x => x.jobTitle.toLowerCase() === "h. embroidery" || x.jobTitle.toLowerCase() === "hand emb");
            case 'machine embroidery':
                return employeeList.filter(x => x.jobTitle.toLowerCase() === "m. embroidery" || x.jobTitle.toLowerCase() === "machine emb");
            case 'stitching':
                return employeeList.filter(x => x.jobTitle.toLowerCase() === "sticher");
            case 'crystal used':
                return employeeList.filter(x => x.jobTitle.toLowerCase() === "hot fixer");
            default:
                return [];
        }
    }

    const saveWorkTypeStatus = (e, index) => {

        e.preventDefault();
        let data = workSheetModel.workTypeStatus[index];

        if (data.completedBy === null || data.completedBy === 0 || data.completedBy === '') {
            toast.warn(`Please select employee for ${data.workType} work`);
            return;
        }
        if (data?.completedOn === null || data?.completedOn === MIN_DATE_TIME || data?.completedOn === '') {
            toast.warn(`Please select completion date for ${data.workType} work`);
            return;
        }
        if (data.extra == 0 && (data.price === null || data.price <= 0)) {
            toast.warn(`Please enter the price for ${data.workType} work`);
            return;
        }
        data.isSaved = true;
        data.extra = data?.extra ?? 0;
        Api.Post(apiUrls.workTypeStatusController.update, data)
            .then(res => {
                toast.success(toastMessage.saveSuccess);
                var model = workSheetModel;
                model.workTypeStatus[index].isSaved = true;
                setWorkSheetModel({ ...model })
            });
    }

    const getUnstitchedImage = () => {

        if (unstitchedImageList.length === 0)
            return common.defaultImageUrl;
        return process.env.REACT_APP_API_URL + unstitchedImageList[unstitchedImageList.length - 1].thumbPath;
    }

    const setVoucherNo = () => {
        var curr_workStatus = workSheetModel?.workTypeStatus;
        if (curr_workStatus === undefined || curr_workStatus.length < 1)
            return 'xxxxxxx';
        else {
            return ("0000" + curr_workStatus[0]?.voucherNo).slice(-7);
        }
    }

    const isMeasurementAvaialble = () => {
        return workSheetModel.sleeveLoose !== "0" && workSheetModel.sleeveLoose !== "" && workSheetModel.neck !== "0" && workSheetModel.neck !== ""
    }
    const saveModelNo = () => {
        var modelNo = workSheetModel.designModel;
        if (modelNo.length > 2) {
            Api.Post(apiUrls.orderController.updateModelNo + `${workSheetModel.orderDetailId}&modelNo=${modelNo}`, {})
                .then(res => {
                    if (res.data > 0) {
                        toast.success(toastMessage.updateSuccess);
                    }
                });
        }
    }
    const disableModelNoPopup = (kandooraStatus) => {
        var machineWorkType = workTypeStatusList?.find(x => x.workType?.toLowerCase().indexOf('machine') > -1);
        if (machineWorkType === undefined)
            return "disabled";
        if (!machineWorkType?.isSaved || kandooraStatus === 'active' || kandooraStatus === 'processing') {
            return "";
        }
        return "disabled";
    }

    const getValueByWork = (prop, index, workType) => {
        let data = workSheetModel?.workTypeStatus;
        if (!Array.isArray(data)) {
            data = [];
        }
        if (data[index] === undefined)
            return;
        if (prop === "completedBy") {
            return data[index][prop] === null || data[index][prop] === undefined ? '0' : data[index][prop];
        }
        else if (prop === "completedOn") {
            return data[index][prop] === MIN_DATE_TIME ? common.getHtmlDate(new Date()) : common.getHtmlDate(data[index][prop])
        }
        else if (prop === "price") {
            return common.printDecimal(data[index][prop] === null ? 0 : data[index][prop]);
        }
        else if (prop === "extra") {
            return data[index][prop] === null ? 0 : data[index][prop];
        }
        else if (prop === "note") {
            return data[index][prop] === null ? '' : data[index][prop];
        }
        return "";
    }

    const showAddCrystalAlterRecord=(index)=>
    {
        if(workSheetModel?.workTypeStatus[index]?.workType==="Crystal Used"){
        if(workSheetModel?.workTypeStatus.filter(x=>x.workType==="Crystal Used").length>1)
        {
            if(workSheetModel?.workTypeStatus[index]?.extra>0)
            return true;     
        return false   
        }
        if(workSheetModel?.workTypeStatus[index]?.extra===0)
        return true;
        }
        return false;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <hr />
            <div className="row">
                <div className="col col-lg-12 mx-auto">
                    <div className="card">
                        <div className="card-body" style={{ padding: '0' }}>
                            <div className="tab-content py-3">
                                <div className="tab-pane fade active show" id="primaryhome" role="tabpanel">
                                    <div className="col-12 col-lg-12">
                                        <div className="card shadow-none bg-light border">
                                            <div className="card-body">
                                                <div className='row'>
                                                    <div className="col-12 col-lg-2">
                                                        <Inputbox labelFontSize="11px" labelText="Profit" disabled={true} value={common.printDecimal(workSheetModel.profit)} className="form-control-sm" placeholder="0.00" />
                                                    </div>
                                                    <div className="col-12 col-lg-2">
                                                        <Inputbox labelFontSize="11px" labelText="Grade" disabled={true} value={common.getGrade(workSheetModel.subTotalAmount)} className="form-control-sm" />
                                                    </div>
                                                    <div className="col-12 col-lg-3">
                                                        <Label fontSize='11px' text="Order No" />
                                                        <SearchableDropdown optionWidth="100%" defaultValue='0' className='form-control-sm' itemOnClick={selectOrderNoHandler} data={orderNumberList} name="orderNo" elementKey="id" searchable={true} onChange={handleTextChange} value={workSheetModel?.orderNo} defaultText="Select order number"></SearchableDropdown>
                                                    </div>
                                                    <div className="col-12 col-lg-3">
                                                        <Label fontSize='11px' text="Kandoora No" />
                                                        <SearchableDropdown optionWidth="100%" defaultValue='' className='form-control-sm' itemOnClick={selectOrderDetailNoHandler} data={orderDetailNumberList} name="orderDetailNo" elementKey="value" searchable={true} value={workSheetModel?.orderDetailNo} defaultText="Select order detail number"></SearchableDropdown>
                                                    </div>
                                                    <div className="col-12 col-lg-2">
                                                        <Inputbox labelFontSize="11px" labelText="Amount" disabled={true} value={common.printDecimal(workSheetModel?.subTotalAmount)} className="form-control-sm" />
                                                    </div>
                                                </div>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="table-responsive">
                                                            <table className="table table-striped table-bordered" style={{ width: '100%' }}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{ width: "18%" }}>
                                                                            <table className="table table-bordered">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Voucher No." />
                                                                                                <input type="text" disabled value={setVoucherNo()} className="form-control form-control-sm" placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Customer" />
                                                                                                <input type="text" disabled value={workSheetModel?.customerName} className="form-control form-control-sm" placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Del. Date" />
                                                                                                <input type="text" disabled value={common.getHtmlDate(workSheetModel?.deliveryDate, "ddmmyyyy")} className="form-control form-control-sm" placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Model No" />
                                                                                                <div className="input-group mb-1">
                                                                                                    <input type="text" disabled={disableModelNoPopup(workSheetModel?.status?.toLowerCase())} onChange={e => setWorkSheetModel({ ...workSheetModel, ["designModel"]: e.target.value.toUpperCase() })} value={workSheetModel?.designModel} className="form-control form-control-sm" placeholder="" />
                                                                                                    {disableModelNoPopup(workSheetModel?.status?.toLowerCase()) === '' && <>
                                                                                                        <ButtonBox className="btn-sm" text=" " disabled={workSheetModel?.orderDetailId > 0 ? "" : "disabled"} onClickHandler={saveModelNo} type="save" />
                                                                                                        <ButtonBox text=" " disabled={workSheetModel?.orderDetailId > 0 ? "" : "disabled"} className="btn-sm" modalId="#update-design-popup-model" type="view" />
                                                                                                    </>}
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Quantity" />
                                                                                                <input type="text" disabled value={orderDetailNumberList?.length} className="form-control form-control-sm" placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Kandoora No." />
                                                                                                <input type="text" disabled value={workSheetModel?.orderDetailNo} className="form-control form-control-sm" placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Crystal Used" />
                                                                                                <input type="text" disabled value={workSheetModel?.crystalUsed} className="form-control form-control-sm" placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Saleman" />
                                                                                                <input type="text" disabled value={workSheetModel?.salesman} className="form-control form-control-sm" placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Fixed Expense" />
                                                                                                <div className="input-group mb-3">
                                                                                                    <input type="text" disabled value={workSheetModel?.fixedExpense} className="form-control form-control-sm" placeholder="0.00" />
                                                                                                    <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#fixed-expense-popup-model" type="button" id="button-addon2"><i className="bi bi-eye"></i></button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td>
                                                                            <table className="table table-striped table-bordered">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th style={{ padding: '2px 5px', fontSize: '11px' }}>Worker</th>
                                                                                        <th style={{ padding: '2px 5px', fontSize: '11px' }}>Date</th>
                                                                                        <th style={{ padding: '2px 5px', fontSize: '11px' }}>Price</th>
                                                                                        <th style={{ padding: '2px 5px', fontSize: '11px' }}>Extra</th>
                                                                                        <th style={{ padding: '2px 5px', fontSize: '11px' }}>Note</th>
                                                                                        <th style={{ padding: '2px 5px', fontSize: '11px' }}>Action</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {!isMeasurementAvaialble() &&
                                                                                        <tr><td colSpan={6} style={{ fontSize: '12px' }} className="text-danger text-center" >Measurement is not available. Please update atleast Neck and sleeve Loose</td></tr>
                                                                                    }
                                                                                    {
                                                                                        isMeasurementAvaialble() && workTypeStatusList.length > 0 && workTypeStatusList?.map((ele, index) => {
                                                                                            return <>
                                                                                                <tr key={ele.id + 1000000000} style={{ padding: '2px 9px', fontSize: '11px' }}>
                                                                                                    <td colSpan={6}> {ele.workType} {ele.extra > 0 ? "- For Extra/Alter Amount" : ""}</td>
                                                                                                </tr>
                                                                                                <tr key={index + 9999}>
                                                                                                    <td>
                                                                                                        <SearchableDropdown
                                                                                                            defaultValue="0"
                                                                                                            className='form-control-sm'
                                                                                                            itemOnClick={selectComplyedByHandler}
                                                                                                            data={filterEmployeeByWorkType(ele.workType)}
                                                                                                            name="completedBy"
                                                                                                            elementKey="id"
                                                                                                            searchable={true}
                                                                                                            text="firstName"
                                                                                                            searchPattern="_%"
                                                                                                            disabled={(ele.workType === "Crystal Used" && usedCrystalData[0]?.id > 0)}
                                                                                                            onChange={e => handleTextChange(e, index)}
                                                                                                            currentIndex={index}
                                                                                                            // value={Array.isArray(workSheetModel?.workTypeStatus) ? workSheetModel?.workTypeStatus[index]?.completedBy === null ? '' : workSheetModel?.workTypeStatus[index]?.completedBy : "0"}
                                                                                                            value={getValueByWork("completedBy", index, ele.workType)}
                                                                                                            defaultText="Select employee">
                                                                                                        </SearchableDropdown>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input type="Date"
                                                                                                            onChange={e => handleTextChange(e, index)}
                                                                                                            className="form-control form-control-sm"
                                                                                                            // value={workSheetModel?.workTypeStatus[index]?.completedOn === MIN_DATE_TIME ? common.getHtmlDate(new Date()) : common.getHtmlDate(workSheetModel?.workTypeStatus[index]?.completedOn)}
                                                                                                            value={getValueByWork("completedOn", index, ele.workType)}
                                                                                                            placeholder="Completed On"
                                                                                                            max={common.getHtmlDate(new Date())}
                                                                                                            disabled={(ele.workType === "Crystal Used" && usedCrystalData[0]?.id > 0)}
                                                                                                            name='completedOn' />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <Inputbox
                                                                                                            type="number"
                                                                                                            style={{ padding: '.25rem .1rem', minWidth: '40px' }}
                                                                                                            disabled={ele.extra > 0 || ele.workType === "Crystal Used" ? "disabled" : ""}
                                                                                                            onChangeHandler={handleTextChange}
                                                                                                            min={0}
                                                                                                            showLabel={false}
                                                                                                            onChangeHandlerData={index}
                                                                                                            value={getValueByWork("price", index, ele.workType)}
                                                                                                            className="form-control-sm"
                                                                                                            placeholder="Price"
                                                                                                            name='price' />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <Inputbox
                                                                                                            type="number"
                                                                                                            style={{ padding: '.25rem .1rem' }}
                                                                                                            onChangeHandler={handleTextChange}
                                                                                                            onChangeHandlerData={index}
                                                                                                            min={0}
                                                                                                            showLabel={false}
                                                                                                            value={getValueByWork("extra", index, ele.workType)}
                                                                                                            className="form-control-sm"
                                                                                                            placeholder="Extra"
                                                                                                            name='extra'
                                                                                                            disabled={ele.workType === "Crystal Used" ? "disabled" : ""} />
                                                                                                    </td>
                                                                                                    <td colSpan={ele.workType === "Crystal Used" ? 2 : 1}>
                                                                                                        <input type="text"
                                                                                                            autoComplete='off' title={workSheetModel?.workTypeStatus[index]?.note} disabled={ele.workType === "Crystal Used"} onChange={e => handleTextChange(e, index)} min={0} value={workSheetModel?.workTypeStatus[index]?.note === null ? "" : workSheetModel?.workTypeStatus[index]?.note} className="form-control form-control-sm" placeholder="Note" name='note' />
                                                                                                    </td>
                                                                                                    {ele.workType !== "Crystal Used" && <td>
                                                                                                        <ButtonBox type="save" onClickHandler={saveWorkTypeStatus} onClickHandlerData={index} className={workSheetModel?.workTypeStatus[index]?.isSaved ? 'btn btn-sm btn-success' : 'btn btn-sm btn-warning'} text={workSheetModel?.workTypeStatus[index]?.isSaved ? "Saved" : "Save"} />

                                                                                                        {/* <button onClick={e => saveWorkTypeStatus(e, index)} className={workSheetModel?.workTypeStatus[index]?.completedOn === MIN_DATE_TIME ? 'btn btn-sm btn-warning' : 'btn btn-sm btn-success'}>{workSheetModel?.workTypeStatus[index]?.completedOn === MIN_DATE_TIME ? "Save" : "Saved"}</button> */}
                                                                                                    </td>
                                                                                                    }
                                                                                                </tr>
                                                                                                {ele.workType === "Crystal Used" && workSheetModel?.workTypeStatus[index]?.completedBy > 0 &&
                                                                                                    <tr>
                                                                                                        <td colSpan={6} style={{ background: 'wheat' }}>
                                                                                                          {(workSheetModel?.workTypeStatus[index]?.extra===0 || workSheetModel?.workTypeStatus[index]?.extra==='') &&  <ButtonBox text="Add Crystal Tracking" modalId="#add-crysal-tracking" icon="bi bi-gem" className="btn-sm btn-info" />}
                                                                                                            {usedCrystalData[0]?.id > 0  && <>
                                                                                                                <ButtonBox text="Update Record" style={{ marginLeft: "15px" }} modalId="#updateCompletedOnAndEmpInCrystalTrackingModel" icon="bi bi-user" className="btn-sm btn-info" />
                                                                                                                <UpdateCompletedOnAndEmpInCrystalTracking
                                                                                                                    empData={filterEmployeeByWorkType("crystal used")}
                                                                                                                    workSheetModel={workSheetModel?.workTypeStatus[index]}
                                                                                                                    usedCrystalData={usedCrystalData}
                                                                                                                    onUpdateCallback={()=>{setRefreshData(pre=>pre+1)}} />
                                                                                                            </>}
                                                                                                            { showAddCrystalAlterRecord(index) &&<>
                                                                                                                <ButtonBox text={(workSheetModel?.workTypeStatus[index]?.extra === 0 ? "Add" : "Update") + " crystal alteration"} style={{ marginLeft: "15px" }} modalId="#addCrystalAlterationModel" type="update" icon="bi bi-user" className="btn-sm" />
                                                                                                                <AddCrystalAlterRecord data={workSheetModel?.workTypeStatus?.find(x=>x.workType==="Crystal Used" && x.extra>0)} empData={filterEmployeeByWorkType("crystal used")} orderDetailId={orderDetailsId} onUpdateCallback={()=>{setRefreshData(pre=>pre+1)}}></AddCrystalAlterRecord>
                                                                                                            </>
                                                                                                            }
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                }
                                                                                            </>
                                                                                        })
                                                                                    }
                                                                                    <tr>
                                                                                        <td colSpan={6}>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Note" />
                                                                                                <textarea disabled value={workSheetModel.description} className="form-control form-control-sm" placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td style={{ width: "10%" }}>
                                                                            <table className="table table-striped table-bordered">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td colSpan={2}>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Sleeve Looing"></Label>
                                                                                                <input type="text" disabled value={workSheetModel?.sleeveLoose} className="form-control form-control-sm" placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td colSpan={2}>
                                                                                            <div className="col-md-12">
                                                                                                <Label fontSize='11px' text="Neck" />
                                                                                                <input type="text" disabled value={workSheetModel?.neck} className="form-control form-control-sm" placeholder="" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td colSpan={2}>
                                                                                            <div className="col-md-12" >
                                                                                                <img data-bs-toggle="modal" onError={(e) => { e.target.src = "/assets/images/default-image.jpg" }} data-bs-target="#image-zoom-in-model" style={imageStyle} src={getUnstitchedImage()}></img>
                                                                                                <div className='text-center' style={{ fontSize: '12px', color: '#ed4242' }}>Click on image to zoom</div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td colSpan={2}>
                                                                                            <div className="col-md-12">
                                                                                                <Inputbox labelText="Customer Name" labelFontSize="11px" value={workSheetModel?.measurementCustomerName} disabled={true} className="form-control form-control-sm" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FixedExpensePopup></FixedExpensePopup>
            <UpdateDesignModelPopup workSheetData={workSheetModel}></UpdateDesignModelPopup>
            {/* <div className="modal fade" id="image-zoom-in-model" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Unstitched Image</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {getUnstitchedImage().indexOf('assets/images/default-image.jpg') > -1 && <div className='text-center text-danger'>You did not uploaded any image for this Kandoora</div>}
                            {getUnstitchedImage().indexOf('assets/images/default-image.jpg') === -1 && <img style={{ width: '100%', height: '100%', borderRadius: '4px', border: '2px solid' }} src={getUnstitchedImage().replace('thumb_', '')}></img>}
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="cancel" text="Close" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div> */}
            <ImageZoomInPopup imagePath={getUnstitchedImage()} kandooraNo={workSheetModel?.orderDetailNo} />
            <CrystalTrackingPopup
                workSheetModel={workSheetModel}
                usedCrystalData={usedCrystalData}
                selectedOrderDetail={orderData}
                setIsCrystalTrackingSaved={setIsCrystalTrackingSaved}
            ></CrystalTrackingPopup>
            {/* <SelectCrystalModal kandooraNo={workSheetModel.kandooraNo} orderDetailId={workSheetModel.orderDetailId}></SelectCrystalModal> */}

        </>
    )
}
