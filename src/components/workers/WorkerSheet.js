import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { toastMessage } from '../../constants/ConstantValues'
import { common } from '../../utils/common'
import Breadcrumb from '../common/Breadcrumb'
import Dropdown from '../common/Dropdown'
import FixedExpensePopup from '../Popups/FixedExpensePopup'
import Label from '../common/Label'
import UpdateDesignModelPopup from '../Popups/UpdateDesignModelPopup'
import ButtonBox from '../common/ButtonBox'
import Inputbox from '../common/Inputbox'
import SelectCrystalModal from './SelectCrystalModal'
import ImageZoomInPopup from '../Popups/ImageZoomInPopup'
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
        description: "",
        totalAmount: 0,
        fixedExpense: 0,
        profit: 0,
        orderDetailId: 0,
        designSampleId: 0,
        isSaved: false,
        subTotalAmount: 0,
        workTypeStatus: []
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
    const [selectCrystalData, setSelectCrystalData] = useState([])
    const vat = parseFloat(process.env.REACT_APP_VAT);
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
                icon: "bi bi-cart3"
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
        let apiList = [];
        apiList.push(Api.Get(apiUrls.workTypeStatusController.get + `?orderDetailId=${workSheetModel.orderDetailId}`));
        apiList.push(Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `1?moduleIds=${orderDetailsId}`))
        apiList.push(Api.Get(apiUrls.stockController.getUsedCrystal + orderDetailsId))
        Api.MultiCall(apiList)
            .then(
                res => {
                    setworkTypeStatusList(res[0].data);
                    let mainData = workSheetModel;
                    let workPrice = 0;
                    mainData.workTypeStatus = res[0].data;
                    mainData.workTypeStatus.forEach(ele => {
                        if (ele.price !== null && typeof ele.price === 'number') {
                            workPrice += ele.price;
                        }
                        ele.completedOn = ele.completedOn === MIN_DATE_TIME ? common.getHtmlDate(new Date()) : ele.completedOn;
                    });
                    mainData.profit = mainData.totalAmount - fixedExpense - workPrice;
                    setUnstitchedImageList(res[1].data.filter(x => x.remark === 'unstitched'));
                    var usedCrystalData = res[2].data;
                    usedCrystalData.forEach(ele => {
                        ele.enteredPieces = ele.usedQty;
                    });
                    setSelectCrystalData([...usedCrystalData]);
                }
            )
    }, [orderDetailsId])

    // end Effects Start

    const handleTextChange = (e, index) => {
        var { value, type, name } = e.target;
        let data = workSheetModel;
        if (type === 'select-one' && name !== "orderDetailNo" && name !== "orderNo") {
            value = parseInt(value);
        }
        else if (type === 'number')
            value = parseFloat(value);

        data[name] = value;

        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null })
        }
        if (index !== undefined && index > -1) {
            data.workTypeStatus[index][name] = value;
            if (name === 'price') {
                data.profit = data.totalAmount - fixedExpense - value;
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
            }).catch(err => {
            });
    }

    const selectComplyedByHandler = (data, index) => {
        let mainData = workSheetModel;
        mainData.workTypeStatus[index]["completedBy"] = data.id;
        setWorkSheetModel({ ...mainData });
    }

    const selectOrderDetailNoHandler = (data) => {
        let orderDetail = orderData.orderDetails.find(x => x.orderNo === data.value);
        let mainData = workSheetModel;
        mainData.customerName = orderData.customerName;
        mainData.salesman = orderData.salesman;
        mainData.orderNoText = orderData.orderNo;
        mainData.kandooraNo = data.value;
        mainData.orderDetailNo = data.value;
        mainData.deliveryDate = common.getHtmlDate(new Date(orderDetail.orderDeliveryDate));
        mainData.quantity = 1;
        mainData.description = orderDetail.description;
        mainData.crystalUsed = orderDetail.crystal === "" ? 0 : parseFloat(orderDetail.crystal).toFixed(2);
        mainData.modelNo = orderDetail.designModel;
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
        mainData.totalAmount = orderDetail.totalAmount;
        mainData.subTotalAmount = orderDetail.subTotalAmount;
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
        if (data.price === null || data.price <= 0) {
            toast.warn(`Please enter the price for ${data.workType} work`);
            return;
        }
        data.isSaved = true;
        Api.Post(apiUrls.workTypeStatusController.update, data)
            .then(res => {
                toast.success(toastMessage.saveSuccess);
                var model=workSheetModel;
                model.workTypeStatus[index].isSaved=true;
                setWorkSheetModel({ ...model })
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
    }

    const getUnstitchedImage = () => {

        if (unstitchedImageList.length === 0)
            return common.defaultImageUrl;
        return process.env.REACT_APP_API_URL + unstitchedImageList[unstitchedImageList.length - 1].thumbPath;
    }
    const saveUsedCrystal = () => {
        var model = selectCrystalData;
        var status = workSheetModel.workTypeStatus.find(x => x.workType?.toLowerCase() === 'crystal used');
        if (status === undefined || status.completedBy === null || status.completedBy === 0 || status.completedBy === undefined) {
            toast.warn("Please select employee for hot fix/crystal use");
            return;
        }
        if (model.find(x => x.enteredPieces < 1) !== undefined) {
            toast.warn("You have select any crystal with zero pieces!");
            return;
        }
        else {
            model.forEach(res => {
                res.employeeId = status.completedBy;
                res.orderDetailId = workSheetModel.orderDetailId;
                res.usedQty = res.enteredPieces;
            });
        }
        Api.Put(apiUrls.stockController.saveUsedCrystal, model)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.saveSuccess);
                }
                else
                    toast.warn(toastMessage.saveError);
            })
    }

    const setVoucherNo = () => {
        var curr_workStatus = workSheetModel?.workTypeStatus;
        if (curr_workStatus === undefined || curr_workStatus.length<1)
            return 'xxxxxxx';
        else {
            return ("0000" + curr_workStatus[0]?.voucherNo).slice(-7);
        }
    }

    const isMeasurementAvaialble = () => {
        console.log(workSheetModel.neck);
        console.log(workSheetModel.sleeveLoose);
        return workSheetModel.sleeveLoose !== "0" && workSheetModel.sleeveLoose !== "" && workSheetModel.neck !== "0" && workSheetModel.neck !== ""
    }
    const getWorkStatusDataByProp=(index,property)=>{}
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
                                                <form className="row g-3">
                                                    <div className="col-12 col-lg-2">
                                                        <Inputbox labelFontSize="11px" labelText="Profit" disabled={true} value={common.printDecimal(workSheetModel.profit)} className="form-control-sm" placeholder="0.00" />
                                                    </div>
                                                    <div className="col-12 col-lg-2">
                                                        <Inputbox labelFontSize="11px" labelText="Grade" disabled={true} value={common.getGrade(workSheetModel.subTotalAmount)} className="form-control-sm" />
                                                    </div>
                                                    <div className="col-12 col-lg-3">
                                                        <Label fontSize='11px' text="Order No" />
                                                        <Dropdown defaultValue='0' className='form-control-sm' itemOnClick={selectOrderNoHandler} data={orderNumberList} name="orderNo" elementKey="id" searchable={true} onChange={handleTextChange} value={workSheetModel?.orderNo} defaultText="Select order number"></Dropdown>
                                                    </div>
                                                    <div className="col-12 col-lg-3">
                                                        <Label fontSize='11px' text="Kandoora No" />
                                                        <Dropdown defaultValue='' className='form-control-sm' itemOnClick={selectOrderDetailNoHandler} data={orderDetailNumberList} name="orderDetailNo" elementKey="value" searchable={true} value={workSheetModel?.orderDetailNo} defaultText="Select order detail number"></Dropdown>
                                                    </div>
                                                    <div className="col-12 col-lg-2">
                                                        <Inputbox labelFontSize="11px" labelText="Amount" disabled={true} value={common.printDecimal(workSheetModel?.subTotalAmount)} className="form-control-sm" />
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
                                                                                                    <input type="text" disabled value={workSheetModel?.deliveryDate} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Model No" />
                                                                                                    <div className="input-group mb-1">
                                                                                                        <input type="text" disabled value={workSheetModel?.modelNo} className="form-control form-control-sm" placeholder="" />
                                                                                                        <button disabled={workSheetModel?.orderDetailId > 0 ? "" : "disabled"} className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#update-design-popup-model" type="button" id="button-addon2"><i className="bi bi-eye"></i></button>
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
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {!isMeasurementAvaialble() &&
                                                                                            <tr><td colSpan={5} className="text-danger" >Measurement is not available. Please update atleast Neck and sleeve Loose</td></tr>
                                                                                        }
                                                                                        {
                                                                                            isMeasurementAvaialble() && workTypeStatusList.length > 0 && workTypeStatusList?.map((ele, index) => {
                                                                                                return <>
                                                                                                    <tr key={ele.id + 1000000000} style={{ padding: '2px 9px', fontSize: '11px' }}>
                                                                                                        <td colSpan={6}> {ele.workType}</td>
                                                                                                    </tr>
                                                                                                    <tr key={ele.id + 9999}>
                                                                                                        <td>
                                                                                                            <Dropdown
                                                                                                                defaultValue="0"
                                                                                                                className='form-control-sm'
                                                                                                                itemOnClick={selectComplyedByHandler}
                                                                                                                data={filterEmployeeByWorkType(ele.workType)}
                                                                                                                name="completedBy"
                                                                                                                elementKey="id"
                                                                                                                searchable={true}
                                                                                                                text="firstName"
                                                                                                                onChange={handleTextChange}
                                                                                                                currentIndex={index}
                                                                                                                value={Array.isArray(workSheetModel?.workTypeStatus)? workSheetModel?.workTypeStatus[index]?.completedBy === null ? '' : workSheetModel?.workTypeStatus[index]?.completedBy:"0"}
                                                                                                                defaultText="Select employee">
                                                                                                            </Dropdown>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input type="Date"
                                                                                                                onChange={e => handleTextChange(e, index)}
                                                                                                                className="form-control form-control-sm"
                                                                                                                value={workSheetModel?.workTypeStatus[index]?.completedOn === MIN_DATE_TIME ? common.getHtmlDate(new Date()) : common.getHtmlDate(workSheetModel?.workTypeStatus[index]?.completedOn)}
                                                                                                                placeholder="Completed On"
                                                                                                                max={common.getHtmlDate(new Date())}
                                                                                                                name='completedOn' />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input type="number" onChange={e => handleTextChange(e, index)} min={0} value={workSheetModel?.workTypeStatus[index]?.price === null ? 0 : workSheetModel?.workTypeStatus[index]?.price} className="form-control form-control-sm" placeholder="Price" name='price' />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input type="number" onChange={e => handleTextChange(e, index)} min={0} value={workSheetModel?.workTypeStatus[index]?.extra === null ? 0 : workSheetModel?.workTypeStatus[index]?.extra} className="form-control form-control-sm" placeholder="Extra" name='extra' />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input type="text" onChange={e => handleTextChange(e, index)} min={0} value={workSheetModel?.workTypeStatus[index]?.note === null ? "" : workSheetModel?.workTypeStatus[index]?.note} className="form-control form-control-sm" placeholder="Note" name='note' />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <ButtonBox onClickHandler={saveWorkTypeStatus} onClickHandlerData={index} className={workSheetModel?.workTypeStatus[index]?.isSaved ? 'btn btn-sm btn-success' : 'btn btn-sm btn-warning'} text={workSheetModel?.workTypeStatus[index]?.isSaved ? "Saved" : "Save"} />
                                                                                                            {/* <button onClick={e => saveWorkTypeStatus(e, index)} className={workSheetModel?.workTypeStatus[index]?.completedOn === MIN_DATE_TIME ? 'btn btn-sm btn-warning' : 'btn btn-sm btn-success'}>{workSheetModel?.workTypeStatus[index]?.completedOn === MIN_DATE_TIME ? "Save" : "Saved"}</button> */}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    {ele.workType === "Crystal Used" &&
                                                                                                        <tr>
                                                                                                            <td colSpan={6} className="text-center" style={{ background: 'wheat' }}>
                                                                                                                <ButtonBox text="Select Crystal" modalId="#select-crystal-model" icon="bi bi-gem" className="btn-sm btn-info" />

                                                                                                                {selectCrystalData?.length > 0 && <>
                                                                                                                    <ButtonBox text="Use Crystal" onClickHandler={saveUsedCrystal} className="btn-sm btn-success" />
                                                                                                                    <table className='table table-bordered table-stripe' style={{ fontSize: 'var(--app-font-size)' }}>
                                                                                                                        <thead>
                                                                                                                            <tr>
                                                                                                                                <th className='text-center'>Sr.</th>
                                                                                                                                <th className='text-center'>Name</th>
                                                                                                                                <th className='text-center'>Shape</th>
                                                                                                                                <th className='text-center'>Used Pieces</th>
                                                                                                                            </tr>
                                                                                                                        </thead>
                                                                                                                        <tbody>
                                                                                                                            {selectCrystalData?.map((res, index) => {
                                                                                                                                return <tr key={res.productStocKId}>
                                                                                                                                    <td className='text-center'>{index + 1}</td>
                                                                                                                                    <td>{`${res.brand}-${res.product}-${res.size}`}</td>
                                                                                                                                    <td className='text-center'>{res.shape}</td>
                                                                                                                                    <td className='text-center'>{common.printDecimal(res.enteredPieces)}</td>
                                                                                                                                </tr>
                                                                                                                            })}
                                                                                                                            <tr>
                                                                                                                                <td colSpan={2}></td>
                                                                                                                                <td className='fw-bold text-center'>Total Pieces</td>
                                                                                                                                <td className='fw-bold text-center'>{common.printDecimal(selectCrystalData.reduce((sum, ele) => {
                                                                                                                                    return sum += ele.enteredPieces ?? 0;
                                                                                                                                }, 0))}</td>
                                                                                                                            </tr>
                                                                                                                        </tbody>
                                                                                                                    </table>
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
                                                                                                    <img data-bs-toggle="modal" data-bs-target="#image-zoom-in-model" style={imageStyle} src={getUnstitchedImage()}></img>
                                                                                                    <div className='text-center' style={{ fontSize: '12px', color: '#ed4242' }}>Click on image to zoom</div>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td colSpan={2}>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Customer Name"></Label>
                                                                                                    <input type="text" disabled value={workSheetModel?.measurementCustomerName} className="form-control form-control-sm" placeholder="" />
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
                                                </form>
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
            <ImageZoomInPopup imagePath={getUnstitchedImage()}/>
            <SelectCrystalModal setModelData={setSelectCrystalData}></SelectCrystalModal>
        </>
    )
}
