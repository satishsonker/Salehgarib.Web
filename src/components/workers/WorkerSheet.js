import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { toastMessage } from '../../constants/ConstantValues'
import { common } from '../../utils/common'
import Breadcrumb from '../common/Breadcrumb'
import Dropdown from '../common/Dropdown'
import ErrorLabel from '../common/ErrorLabel'
import FixedExpensePopup from '../common/FixedExpensePopup'
import Label from '../common/Label'

export default function WorkerSheet() {
    const workSheetModelTemplete = {
        orderNo: 0,
        orderNoText: 0,
        orderDetailNo: '',
        voucherNo: 100098,
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
        sleeves: 0.0,
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
                    });
                    mainData.profit=data.totalAmount-fixedExpense-workPrice;;
                }
            )
    }, [orderDetailsId])

    // end Effects Start

    const handleTextChange = (e, index) => {
        var { value, type, name } = e.target;
        let data = workSheetModel;
        if (type === 'select-one' && name !== "orderDetailNo") {
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
                data.profit = data.totalAmount-fixedExpense-value;
            }
        }

        setWorkSheetModel({ ...data });
    }
    const selectOrderNoHandler = (data) => {
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
        mainData.sleeves = orderDetail.sleeves;
        mainData.shoulder = orderDetail.shoulder;
        mainData.neck = orderDetail.neck;
        mainData.extra = orderDetail.extra;
        mainData.cuff = orderDetail.cuff;
        mainData.size = orderDetail.size;
        mainData.waist = orderDetail.waist;
        mainData.totalAmount = orderDetail.totalAmount;
        mainData.fixedExpense = fixedExpense;
        mainData.profit=mainData.totalAmount-fixedExpense;
        mainData.orderDetailId = data.id;
        setOrderDetailsId(data.id);
        setWorkSheetModel({ ...mainData });
    }

    const filterEmployeeByWorkType = (workType) => {
        switch (workType.toLowerCase()) {
            case 'apliq':
                return employeeList.filter(x => x.jobTitle.toLowerCase() === "salesman");
            case 'cutting':
                return employeeList.filter(x => x.jobTitle.toLowerCase() === "cutting master");
            case 'designing':
                return employeeList.filter(x => x.jobTitle.toLowerCase() === "designer");
            default:
                return [];
                break;
        }
    }

    const saveWorkTypeStatus = (e, index) => {
        debugger;
        e.preventDefault();
        let data = workSheetModel.workTypeStatus[index];

        if (data.completedBy === null || data.completedBy === 0 || data.completedBy === '') {
            toast.warn(`Please select employee for ${data.workType} work`);
            return;
        }
        if (data.completedOn === null || data.completedOn === '0001-01-01T00:00:00' || data.completedOn === '') {
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
                                                    <div className="col-3">
                                                        <label className="form-label">Barcode
                                                        </label>
                                                        <input type="text" className="form-control form-control-sm" placeholder="x" disabled />
                                                    </div>
                                                    <div className="col-12 col-lg-3">
                                                        <label className="form-label">Work Order</label>
                                                        <Dropdown defaultValue='0' itemOnClick={selectOrderNoHandler} data={orderNumberList} name="orderNo" elemenyKey="id" searchable={true} onChange={handleTextChange} value={workSheetModel.orderNo} defaultText="Select order number"></Dropdown>
                                                    </div>
                                                    <div className="col-12 col-lg-3">
                                                        <label className="form-label">Alter Order</label>
                                                        <Dropdown defaultValue='' itemOnClick={selectOrderDetailNoHandler} data={orderDetailNumberList} name="orderDetailNo" elemenyKey="value" searchable={true} value={workSheetModel.orderDetailNo} defaultText="Select order detail number"></Dropdown>
                                                    </div>
                                                    <div className="col-12 col-lg-3">
                                                        <label className="form-label">Amount</label>
                                                        <input type="number" disabled value={workSheetModel.totalAmount} className="form-control form-control-sm" placeholder="0.00" />
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
                                                                                                    <Label text="Voucher No." />
                                                                                                    <input type="text" disabled value={workSheetModel.voucherNo} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Customer" />
                                                                                                    <input type="text" disabled value={workSheetModel.customerName} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Del. Date" />
                                                                                                    <input type="text" disabled value={workSheetModel.deliveryDate} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Model No" />
                                                                                                    <input type="text" disabled value={workSheetModel.modelNo} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Order No" />
                                                                                                    <input type="text" disabled value={workSheetModel.orderNoText} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Kandoora No." />
                                                                                                    <input type="text" disabled value={workSheetModel.orderDetailNo} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Quanity" />
                                                                                                    <input type="text" disabled value={workSheetModel.quantity} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Crystal Used" />
                                                                                                    <input type="text" disabled value={workSheetModel.crystalUsed} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Saleman" />
                                                                                                    <input type="text" disabled value={workSheetModel.salesman} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Fixed Expense" />
                                                                                                    <div className="input-group mb-3">
                                                                                                        <input type="text" disabled value={workSheetModel.fixedExpense} className="form-control form-control-sm" placeholder="0.00" />
                                                                                                        <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#fixed-expense-popup-model" type="button" id="button-addon2"><i className="bi bi-eye"></i></button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Profit" />
                                                                                                    <input type="text" disabled value={workSheetModel.profit} className="form-control form-control-sm" placeholder="0.00" />
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
                                                                                            <th>Worker</th>
                                                                                            <th>Date</th>
                                                                                            <th>Price</th>
                                                                                            <th>Extra</th>
                                                                                            <th>Note</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            workTypeStatusList?.map((ele, index) => {
                                                                                                return <>
                                                                                                    <tr key={ele.id + 1000000000}>
                                                                                                        <td colSpan={6}> {ele.workType}</td>
                                                                                                    </tr>
                                                                                                    <tr key={ele.id}>
                                                                                                        <td>
                                                                                                            <Dropdown
                                                                                                                defaultValue='0'
                                                                                                                itemOnClick={selectComplyedByHandler}
                                                                                                                data={filterEmployeeByWorkType(ele.workType)}
                                                                                                                name="completedBy"
                                                                                                                elemenyKey="id"
                                                                                                                searchable={true}
                                                                                                                text="firstName"
                                                                                                                onChange={handleTextChange}
                                                                                                                currentIndex={index}
                                                                                                                value={workSheetModel.workTypeStatus[index].completedBy === null ? '' : workSheetModel.workTypeStatus[index].completedBy}
                                                                                                                defaultText="Select employee">
                                                                                                            </Dropdown>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input type="Date"
                                                                                                                onChange={e => handleTextChange(e, index)}
                                                                                                                className="form-control form-control-sm"
                                                                                                                value={workSheetModel.workTypeStatus[index].completedOn === '0001-01-01T00:00:00' ? '' : common.getHtmlDate(workSheetModel.workTypeStatus[index].completedOn)}
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
                                                                                                            <button onClick={e => saveWorkTypeStatus(e, index)} className='btn btn-sm btn-success'>Save</button>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            })
                                                                                        }
                                                                                        <tr>
                                                                                            <td colSpan={6}>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Note" />
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
                                                                                                    <Label text="Length"></Label>
                                                                                                    <input type="text" disabled value={workSheetModel.length} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Chest"></Label>
                                                                                                    <input type="text" disabled value={workSheetModel.chest} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Waist"></Label>
                                                                                                    <input type="text" disabled value={workSheetModel.waist} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Hipps"></Label>
                                                                                                    <input type="text" disabled value={workSheetModel.hipps} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Bottom"></Label>
                                                                                                    <input type="text" disabled value={workSheetModel.bottom} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Sleeves"></Label>
                                                                                                    <input type="text" disabled value={workSheetModel.sleeves} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Cuff"></Label>
                                                                                                    <input type="text" disabled value={workSheetModel.cuff} className="form-control form-control-sm" placeholder="" />
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
                                                                                                    <Label text="Shoulder" />
                                                                                                    <input type="text" disabled value={workSheetModel.shoulder} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Deep" />
                                                                                                    <input type="text" disabled value={workSheetModel.deep} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Neck" />
                                                                                                    <input type="text" disabled value={workSheetModel.neck} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Back Down" />
                                                                                                    <input type="text" disabled value={workSheetModel.backDown} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Extra" />
                                                                                                    <input type="text" disabled value={workSheetModel.extra} className="form-control form-control-sm" placeholder="" />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="col-md-12">
                                                                                                    <Label text="Size" />
                                                                                                    <input type="text" disabled value={workSheetModel.size} className="form-control form-control-sm" placeholder="" />
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
                                                    <div className="col-12">
                                                        <button type="button" className="btn btn-info text-white waves-effect"
                                                            data-bs-dismiss="modal">Save</button>
                                                        <button type="button" className="btn btn-danger waves-effect"
                                                            data-bs-dismiss="modal">Cancel</button>
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
        </>
    )
}
