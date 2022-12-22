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
        workTypeStatus: []
    };
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
    const vat = parseFloat(process.env.REACT_APP_VAT);
    const imageStyle = {
        border: '3px solid gray',
        borderRadius: '7px',
        maxHeight: '150px',
        width: '100%'
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
        Api.MultiCall(apiList)
            .then(
                res => {
                    debugger;
                    var workTypeStatusData = res[0].data;
                    var crystalData;
                    var newWorkTypeStatusData = [];
                    workTypeStatusData.forEach(ele => {
                        if (ele.workType.toLowerCase() !== "crystal used") {
                            newWorkTypeStatusData.push(ele);
                        }
                        else {
                            crystalData = ele;
                        }
                    });
                    newWorkTypeStatusData.push(crystalData);
                    setworkTypeStatusList(newWorkTypeStatusData);
                    let mainData = workSheetModel;
                    let workPrice = 0;
                    mainData.workTypeStatus = res[0].data;
                    mainData.workTypeStatus.forEach(ele => {
                        if (ele.price !== null && typeof ele.price === 'number') {
                            workPrice += ele.price;
                        }
                    });
                    mainData.profit = mainData.totalAmount - fixedExpense - workPrice;
                    setUnstitchedImageList(res[1].data.filter(x => x.remark === 'unstitched'));
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
        debugger;
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
                debugger;
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
        mainData.fixedExpense = fixedExpense;
        mainData.profit = mainData.totalAmount - fixedExpense;
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
        if (data?.completedOn === null || data?.completedOn === '0001-01-01T00:00:00' || data?.completedOn === '') {
            toast.warn(`Please select completion date for ${data.workType} work`);
            return;
        }
        if (data.price === null || data.price <= 0) {
            toast.warn(`Please enter the price for ${data.workType} work`);
            return;
        }

        Api.Post(apiUrls.workTypeStatusController.update, data)
            .then(res => {
                toast.success(toastMessage.saveSuccess);
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
    }

    const getUnstitchedImage = () => {

        if (unstitchedImageList.length === 0)
            return common.defaultImageUrl;
        debugger;
        return process.env.REACT_APP_API_URL + unstitchedImageList[unstitchedImageList.length - 1].thumbPath;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <hr />
            <div className="row">
                <div className="col col-lg-12 mx-auto">
                    <h6 className="mb-0 text-uppercase">Worker Sheet</h6>
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <div className="tab-content py-3">
                                <div className="tab-pane fade active show" id="primaryhome" role="tabpanel">
                                    <div className="col-12 col-lg-12">
                                        <div className="card shadow-none bg-light border">
                                            <div className="card-body">
                                                <form className="row g-3">
                                                    <div className="col-12 col-lg-2">
                                                        <Label fontSize='11px' text="Profit" />
                                                        <input type="text" disabled value={workSheetModel.profit} className="form-control form-control-sm" placeholder="0.00" />
                                                    </div>
                                                    <div className="col-12 col-lg-2">
                                                        <Label text="Grade" />
                                                        <input type="text" className="form-control form-control-sm" value={common.getGrade(workSheetModel.totalAmount)} placeholder="" disabled />
                                                    </div>
                                                    <div className="col-12 col-lg-3">
                                                        <Label text="Order No" />
                                                        <Dropdown defaultValue='0' className='form-control-sm' itemOnClick={selectOrderNoHandler} data={orderNumberList} name="orderNo" elementKey="id" searchable={true} onChange={handleTextChange} value={workSheetModel.orderNo} defaultText="Select order number"></Dropdown>
                                                    </div>
                                                    <div className="col-12 col-lg-3">
                                                        <Label text="Kandoora No" />
                                                        <Dropdown defaultValue='' className='form-control-sm' itemOnClick={selectOrderDetailNoHandler} data={orderDetailNumberList} name="orderDetailNo" elementKey="value" searchable={true} value={workSheetModel.orderDetailNo} defaultText="Select order detail number"></Dropdown>
                                                    </div>
                                                    <div className="col-12 col-lg-2">
                                                        <Label text="Amount" />
                                                        <input type="number" disabled value={common.calculatePercent(workSheetModel.totalAmount, 100 - vat)} className="form-control form-control-sm" placeholder="0.00" />
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
                                                                                                    <input type="text" disabled value={("0000" + workSheetModel?.workTypeStatus[0]?.voucherNo).slice(-7) ?? 'xxxxxxx'} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Customer" />
                                                                                                    <input type="text" disabled value={workSheetModel.customerName} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Del. Date" />
                                                                                                    <input type="text" disabled value={workSheetModel.deliveryDate} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Model No" />
                                                                                                    <div className="input-group mb-1">
                                                                                                        <input type="text" disabled value={workSheetModel.modelNo} className="form-control form-control-sm" placeholder="" />
                                                                                                        <button disabled={workSheetModel.orderDetailId > 0 ? "" : "disabled"} className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#update-design-popup-model" type="button" id="button-addon2"><i className="bi bi-eye"></i></button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Quantity" />
                                                                                                    <input type="text" disabled value={orderDetailNumberList.length} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Kandoora No." />
                                                                                                    <input type="text" disabled value={workSheetModel.orderDetailNo} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Crystal Used" />
                                                                                                    <input type="text" disabled value={workSheetModel.crystalUsed} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Saleman" />
                                                                                                    <input type="text" disabled value={workSheetModel.salesman} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Fixed Expense" />
                                                                                                    <div className="input-group mb-3">
                                                                                                        <input type="text" disabled value={workSheetModel.fixedExpense} className="form-control form-control-sm" placeholder="0.00" />
                                                                                                        <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#fixed-expense-popup-model" type="button" id="button-addon2"><i className="bi bi-eye"></i></button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>                        </tbody>
                                                                                </table>
                                                                            </td>
                                                                            <td>
                                                                                <table className="table table-striped table-bordered">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Worker</th>
                                                                                            <th>Date</th>
                                                                                            <th>Price</th>
                                                                                            <th>Extra</th>
                                                                                            <th>Note</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            workTypeStatusList.length > 0 && workTypeStatusList?.map((ele, index) => {
                                                                                                return <>
                                                                                                    <tr key={ele.id + 1000000000}>
                                                                                                        <td colSpan={6}> {ele.workType}</td>
                                                                                                    </tr>
                                                                                                    <tr key={ele.id}>
                                                                                                        <td>
                                                                                                            <Dropdown
                                                                                                                defaultValue='0'
                                                                                                                className='form-control-sm'
                                                                                                                itemOnClick={selectComplyedByHandler}
                                                                                                                data={filterEmployeeByWorkType(ele.workType)}
                                                                                                                name="completedBy"
                                                                                                                elementKey="id"
                                                                                                                searchable={true}
                                                                                                                text="firstName"
                                                                                                                onChange={handleTextChange}
                                                                                                                currentIndex={index}
                                                                                                                value={workSheetModel?.workTypeStatus[index]?.completedBy === null ? '' : workSheetModel?.workTypeStatus[index]?.completedBy}
                                                                                                                defaultText="Select employee">
                                                                                                            </Dropdown>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input type="Date"
                                                                                                                onChange={e => handleTextChange(e, index)}
                                                                                                                className="form-control form-control-sm"
                                                                                                                value={workSheetModel.workTypeStatus[index]?.completedOn === '0001-01-01T00:00:00' ? common.getHtmlDate(new Date()) : common.getHtmlDate(workSheetModel.workTypeStatus[index]?.completedOn)}
                                                                                                                placeholder="Completed On"
                                                                                                                max={common.getHtmlDate(new Date())}
                                                                                                                name='completedOn' />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input type="number" onChange={e => handleTextChange(e, index)} min={0} value={workSheetModel.workTypeStatus[index]?.price === null ? 0 : workSheetModel.workTypeStatus[index]?.price} className="form-control form-control-sm" placeholder="Price" name='price' />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input type="number" onChange={e => handleTextChange(e, index)} min={0} value={workSheetModel.workTypeStatus[index]?.extra === null ? 0 : workSheetModel.workTypeStatus[index]?.extra} className="form-control form-control-sm" placeholder="Extra" name='extra' />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input type="text" onChange={e => handleTextChange(e, index)} min={0} value={workSheetModel.workTypeStatus[index]?.note === null ? "" : workSheetModel.workTypeStatus[index]?.note} className="form-control form-control-sm" placeholder="Note" name='note' />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <button onClick={e => saveWorkTypeStatus(e, index)} className={workSheetModel.workTypeStatus[index]?.completedOn === '0001-01-01T00:00:00' ? 'btn btn-sm btn-warning' : 'btn btn-sm btn-success'}>{workSheetModel.workTypeStatus[index]?.completedOn === '0001-01-01T00:00:00' ? "Save" : "Saved"}</button>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            })
                                                                                        }
                                                                                        <tr>
                                                                                            <td></td>
                                                                                            <td colSpan={4} className="text-center">
                                                                                                <ButtonBox text="Select Crystal" className="btn-sm btn-warning" />
                                                                                            </td>
                                                                                            <td></td>
                                                                                        </tr>
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
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Sleeve Looing"></Label>
                                                                                                    <input type="text" disabled value={workSheetModel.sleeveLoose} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Neck" />
                                                                                                    <input type="text" disabled value={workSheetModel.neck} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td colSpan={2}>
                                                                                                <div className="col-md-12">
                                                                                                    <img style={imageStyle} src={getUnstitchedImage()}></img>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td colSpan={2}>
                                                                                                <div className="col-md-12">
                                                                                                    <Label fontSize='11px' text="Customer Name"></Label>
                                                                                                    <input type="text" disabled value={workSheetModel.measurementCustomerName} className="form-control form-control-sm" placeholder="" />
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
        </>
    )
}
