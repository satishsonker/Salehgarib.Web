import React, { useState, useRef, useEffect } from 'react'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { common } from '../../utils/common'
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox'
import Dropdown from '../common/Dropdown'
import Inputbox from '../common/Inputbox'
import ReactToPrint from 'react-to-print';
import PrintAdvanceCashVisaReport from '../print/admin/account/PrintAdvanceCashVisaReport'
import Label from '../common/Label'
import { validationMessage } from '../../constants/validationMessage'
import { toast } from 'react-toastify'
import { toastMessage } from '../../constants/ConstantValues'
import ErrorLabel from '../common/ErrorLabel'
import { headerFormat, customOrderStatusColumn } from '../../utils/tableHeaderFormat'

export default function AdvanceCashVisaReport() {
    const printRef = useRef();

    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const [errors, setErrors] = useState({})
    const CURR_DATE = new Date();
    const [billingData, setBillingData] = useState([]);
    const [viewCustomer, setViewCustomer] = useState(false);
    const [filterData, setFilterData] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(CURR_DATE.getMonth(), CURR_DATE.getFullYear())),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear())),
        paymentType: "Advance",
        paymentMode: "Cash"
    });
    const [customerList, setCustomerList] = useState([]);
    const [paymentModeList, setPaymentModeList] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState({})
    const textChangeHandler = (e) => {
        var { name, type, value } = e.target;
        if (type === 'radio') {
            setFilterData({ ...filterData, ['paymentMode']: value });
        } else {
            setFilterData({ ...filterData, [name]: value });
        }
        setBillingData([])
    }
    const breadcrumbOption = {
        title: `Report`,
        items: [
            {
                title: "Report",
                icon: "bi bi-journal-bookmark-fill",
                isActive: false,
            },
            {
                title: `${filterData.paymentType} ${filterData.paymentMode} Report`,
                icon: "bi bi-file-bar-graph",
                isActive: false,
            }
        ]
    }

    const getBillingData = () => {
        Api.Get(apiUrls.reportController.getPaymentSummaryReport + `?fromDate=${filterData.fromDate}&toDate=${filterData.toDate}&paymentType=${filterData.paymentType}&paymentMode=${filterData.paymentMode}`)
            .then(res => {
                setBillingData(res.data);
            });
    }

    const selectedOrderHandler = (ele) => {
        var model = {};
        model.orderId = ele?.id;
        model.orderNo = ele?.orderNo;
        model.deliveryDate = common.getHtmlDate(ele?.orderDeliveryDate);
        model.contact1 = ele?.contact1;
        model.paymentMode = ele?.paymentMode;
        model.customerId = ele?.customerId;
        setSelectedOrder({ ...model });
    }

    const handleOrderEdit = () => {
        const formError = validateEditData();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        Api.Post(apiUrls.orderController.editOrder, selectedOrder)
            .then(res => {
                if (res.data > 0) {
                    common.closePopup('editOrderPopup');
                    toast.success(toastMessage.updateSuccess);
                }
                else {
                    toast.warn(toastMessage.updateError);
                }
            });
    }
    const handleEditChange = (e) => {
        var { name, value,customerName } = e.target;
        var model=selectedOrder;
        if(name==='customerId')
        {
            model.customerId=value;
            model.customerName=customerName;
            setSelectedOrder({...model});
        }
        else{
        setSelectedOrder({ ...selectedOrder, [name]: value });
        }
    }

    useEffect(() => {
        Api.Get(apiUrls.masterDataController.getByMasterDataType + `?masterdatatype=payment_mode`)
            .then(res => {
                res.data.push( {
                    "masterDataTypeCode": "payment_mode",
                    "masterDataTypeValue": "Payment Mode",
                    "remark": null,
                    "id": 16,
                    "code": "no_payment",
                    "value": "No Payment"
                })
                setPaymentModeList(res.data);
            });
    }, []);

    useEffect(() => {
        if (selectedOrder?.contact1 !== undefined) {
            var apiList = [];

            apiList.push(Api.Get(apiUrls.customerController.getByContactNo + `?contactNo=${common.contactNoEncoder(selectedOrder.contact1)}`));
            Api.MultiCall(apiList)
                .then(res => {
                    setCustomerList(res[0].data);
                });
        }
    }, [selectedOrder.contact1]);

    const validateCustomer = (e) => {
        var model = selectedOrder;
        Api.Get(apiUrls.customerController.getByContactNo + '?contactNo=' + common.contactNoEncoder(e.target.value))
            .then(res => {
                if (res.data.length > 0 && res.data[0].id > 0) {
                    model.customerId = res.data.id;
                } else {
                    model.customerId = 0;
                    toast.warn("No customer found with this contact no.");
                }
                setSelectedOrder({ ...model });
            });
    }
    const validateEditData = () => {
        const { deliveryDate, contact1, customerId, paymentMode } = selectedOrder;
        const newError = {};
        if (!deliveryDate || deliveryDate === "") newError.deliveryDate = validationMessage.deliveryDateRequired;
        if (!paymentMode || paymentMode === "" || paymentMode === "0") newError.paymentMode = validationMessage.paymentModeRequired;
        if (contact1?.length === 0 || common.validateContactNo(contact1)) newError.contact1 = validationMessage.invalidContact;
        if (customerId < 1) newError.contact1 = "Contact no does not belongs to any customer"
        return newError;
    }

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between">
                <h6 className="mb-0 text-uppercase">{`${filterData.paymentType} ${filterData.paymentMode} Report`}</h6>
                <div>
                    <div className='d-flex'>
                        <div className='pt-2 mx-2'>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" onChange={e => textChangeHandler(e)} defaultChecked={filterData.paymentMode === "Cash" ? true : false} type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Cash" />
                                <label className="form-check-label" htmlFor="inlineRadio1">Cash</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" onChange={e => textChangeHandler(e)} name="inlineRadioOptions" id="inlineRadio2" value="Visa" checked={filterData.paymentMode === "Visa" ? "checked" : ""} />
                                <label className="form-check-label" htmlFor="inlineRadio2">Visa</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" onChange={e => textChangeHandler(e)} checked={filterData.paymentMode === "All" ? "checked" : ""} type="radio" name="inlineRadioOptions" id="inlineRadio1" value="All" />
                                <label className="form-check-label" htmlFor="inlineRadio1">All</label>
                            </div>
                        </div>
                        <div className='mx-2'>
                            <Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={textChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                        </div>
                        <div>
                            <Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear()))} onChangeHandler={textChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                        </div>

                        <div className='mx-2'>
                            <ButtonBox type="go" className="btn-sm" onClickHandler={getBillingData} />
                            <ReactToPrint
                                trigger={() => {
                                    return <button className='btn btn-sm btn-warning mx-2'><i className='bi bi-printer'></i> Print</button>
                                }}
                                content={(el) => (printRef.current)}
                            />
                        </div>
                    </div>
                    <div className='sub-heading text-danger'>
                        *From and To Date filter will apply on Payment Date only
                    </div>
                </div>
            </div>
            <hr />
            <div className='card'>
                <div className='card-body'>
                    <div className="table-responsive">
                        <table className='table table-bordered fixTableHead' style={{ fontSize: '12px' }}>
                            <thead>
                                <tr>
                                    {headerFormat.AdvanceCashVisaReport.map((ele, index) => {
                                        return <th className='text-center' key={index}>{ele}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    billingData?.map((ele, index) => {
                                        return <tr key={index}>
                                            <td className='text-center'><div style={{ cursor: "pointer" }} onClick={e => selectedOrderHandler(ele?.order)} title="Edit Order" className="text-warning" data-bs-toggle="modal" data-bs-target={"#editOrderPopup"}><i className="bi bi-pencil-fill"></i></div></td>
                                            <td className='text-center'>{index + 1}</td>
                                            <td className='text-center'>{customOrderStatusColumn(ele?.order, { prop: "status" })}</td>
                                            <td className='text-center'>{ele?.order?.orderNo}</td>
                                            <td className='text-center'>{ele?.order?.qty}</td>
                                            <td className='text-start text-uppercase'>{ele?.order?.customerName}</td>
                                            <td className='text-start text-uppercase'>{ele?.order?.contact1}</td>
                                            <td className='text-center'>{common.getHtmlDate(ele?.order?.orderDate, 'ddmmyyyy')}</td>
                                            <td className='text-center'>{common.printDecimal(ele?.order?.totalAmount)}</td>
                                            <td className='text-end' title={ele?.reason}>{common.printDecimal(ele?.credit)}</td>
                                            <td className='text-end'>{common.printDecimal(ele?.order?.totalAmount - ele?.credit)}</td>
                                            <td className='text-end'>{common.getHtmlDate(ele?.order?.orderDeliveryDate, 'ddmmyyyy')}</td>
                                            <td className='text-uppercase text-center'>{ele?.paymentMode}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className='row'>
                        <div className="d-flex justify-content-end col-12 mt-2">
                            <ul className="list-group" style={{ width: '300px' }}>
                                <li className="list-group-item d-flex justify-content-between align-items-center pr-0">
                                    Total Booking Qty
                                    <span className="badge badge-primary" style={{ color: 'black' }}>{billingData?.reduce((sum, ele) => {
                                        return sum += ele?.order?.qty;
                                    }, 0)}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total Booking Amount
                                    <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(billingData?.reduce((sum, ele) => {
                                        return sum += ele?.order?.totalAmount;
                                    }, 0))}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total Advance Cash
                                    <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(billingData?.reduce((sum, ele) => {
                                        if (ele?.paymentMode?.toLowerCase() === 'cash')
                                            return sum += ele?.credit;
                                        else
                                            return sum;
                                    }, 0))}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total Advance VISA
                                    <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(billingData?.reduce((sum, ele) => {
                                        if (ele?.paymentMode?.toLowerCase() === 'visa')
                                            return sum += ele?.credit;
                                        else
                                            return sum;
                                    }, 0))}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Grand Total
                                    <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(billingData?.reduce((sum, ele) => {
                                        return sum += ele?.credit;
                                    }, 0))}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-none'>
                <PrintAdvanceCashVisaReport data={billingData} filterData={filterData} printRef={printRef} />
            </div>
            <div className="modal fade" id="editOrderPopup" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editOrderPopupLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editOrderPopupLabel">Edit Order No. {selectedOrder?.orderNo}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-12'>
                                    <Label text="Contact No." isRequired={true} />
                                    <div className="input-group mb-1">
                                        <input type="text" className="form-control form-control-sm" name='contact1' onChange={e => handleEditChange(e)} value={selectedOrder.contact1} onBlur={validateCustomer} placeholder="Contact No." aria-label="Contact No." aria-describedby="basic-addon2" />
                                        <div className="input-group-append">
                                            <button className="btn btn-info" onClick={e => setViewCustomer(!viewCustomer)} type="button"><i className={viewCustomer ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                                        </div>
                                    </div>
                                        <ErrorLabel message={errors?.contact1}/>
                                    {viewCustomer && <>
                                        <Label fontSize='13px' text="Select Customer Name" helpText="Select Customer name"></Label>
                                        <div className='kan-list'>{
                                            customerList?.map((ele, index) => {
                                                return <div key={index} className={selectedOrder.customerId===ele?.id? "item active":"item"} style={{cursor:'pointer'}} onClick={e => handleEditChange({ target: { value: ele?.id, name: 'customerId',customerName:`${ele?.firstname} ${ele?.lastname??''}` } })} >
                                                    {ele?.firstname} {ele?.lastname??''}
                                                </div>
                                            })
                                        }
                                        </div>
                                    </>
                                    }
                                </div>
                                <div className='col-12'>
                                    <Inputbox errorMessage={errors?.deliveryDate} isRequired={true} type="date" labelText="Delivery Date" onChangeHandler={handleEditChange} value={common.getHtmlDate(selectedOrder.deliveryDate)} name="deliveryDate" className="form-control-sm"></Inputbox>
                                </div>
                                <div className='col-12'>
                                    <Label text="Payment Mode" fontSize='12px' isRequired={true} />
                                    <Dropdown data={paymentModeList} elementKey="value" name="paymentMode" value={selectedOrder.paymentMode} onChange={handleEditChange} />
                                    <ErrorLabel message={errors?.paymentMode} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="save" onClickHandler={handleOrderEdit} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
