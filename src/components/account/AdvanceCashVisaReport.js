import React, { useState, useRef, useEffect, useMemo } from 'react'
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
        title: `${filterData.paymentType} ${filterData.paymentMode} Report`,
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
        var { name, value, customerName } = e.target;
        var model = selectedOrder;
        if (name === 'customerId') {
            model.customerId = value;
            model.customerName = customerName;
            setSelectedOrder({ ...model });
        }
        else {
            setSelectedOrder({ ...selectedOrder, [name]: value });
        }
    }

    useEffect(() => {
        Api.Get(apiUrls.masterDataController.getByMasterDataType + `?masterdatatype=payment_mode`)
            .then(res => {
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

    const useBillingStats = (billingData) => {
        return useMemo(() => {
            const orderCountMap = {};
            let uniqueQty = 0;
            let uniqueBookingSum = 0;

            billingData.forEach(ele => {
                const orderNo = ele.order.orderNo;
                const bookingAmount = ele.order.totalAmount ?? 0;
                if (!orderCountMap[orderNo]) {
                    // first time seeing this order
                    orderCountMap[orderNo] = { count: 1, balance: ele.order.balanceAmount ?? 0 };
                    uniqueQty += ele.order.qty;
                    uniqueBookingSum += bookingAmount;
                } else {
                    orderCountMap[orderNo].count += 1;
                    if (ele.order.balanceAmount < orderCountMap[orderNo].balance)
                    {
                        orderCountMap[orderNo].balance = ele.order.balance;
                    }
                }
            });

            return {
                duplicateCounts: orderCountMap,   // {orderNo: count}
                uniqueQty,                        // number of unique orders
                uniqueBookingSum                  // sum of unique booking amounts
            };
        }, [billingData]);
    };


    const { duplicateCounts, uniqueQty, uniqueBookingSum } = useBillingStats(billingData);

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between">
                <h6 className="mb-0 text-uppercase"></h6>
                <div>
                    <div className='d-flex'>
                        <div className='pt-2 mx-2'>
                            {
                                paymentModeList.map((ele, index) => {

                                    return <div key={index} className='form-check form-check-inline'>
                                        <input className="form-check-input" onChange={e => textChangeHandler(e)} checked={filterData.paymentMode === ele.value ? "checked" : ""} type="radio" name="inlineRadioOptions" id={`inlineRadio${index}`} value={ele.value} />
                                        <label className="form-check-label" htmlFor={`inlineRadio${index}`}>{ele.value}</label>
                                    </div>
                                })
                            }
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
                                        const rowSpan = duplicateCounts[ele.order?.orderNo].count || 1;
                                        const balance = duplicateCounts[ele.order?.orderNo].balance || 0;
                                        const isFirstOccurrence =
                                            index === billingData.findIndex(o => o.order?.orderNo === ele.order?.orderNo);
                                        return <tr key={index}>
                                            <td className='text-center'><div style={{ cursor: "pointer" }} onClick={e => selectedOrderHandler(ele?.order)} title="Edit Order" className="text-warning" data-bs-toggle="modal" data-bs-target={"#editOrderPopup"}><i className="bi bi-pencil-fill"></i></div></td>
                                            <td className='text-center'>{index + 1}</td>

                                            {isFirstOccurrence && (
                                                <>
                                                    <td className='text-center' rowSpan={rowSpan}>{customOrderStatusColumn(ele?.order, { prop: "status" })}</td>
                                                    <td className='text-center' rowSpan={rowSpan}>{ele.order?.orderNo}</td>
                                                    <td className='text-center' rowSpan={rowSpan}>{ele?.order?.qty}</td>
                                                    <td className='text-start text-uppercase' rowSpan={rowSpan}>{ele?.order?.customerName}</td>
                                                    <td className='text-start text-uppercase' rowSpan={rowSpan}>{ele?.order?.contact1}</td>
                                                    <td className='text-center' rowSpan={rowSpan}>{common.getHtmlDate(ele?.order?.orderDate, 'ddmmyyyy')}</td>
                                                    <td className='text-center' rowSpan={rowSpan}>{common.printDecimal(ele?.order?.totalAmount)}</td>
                                                </>
                                            )}

                                            <td className='text-end' title={ele?.reason}>{common.printDecimal(ele?.credit)}</td>
                                            {isFirstOccurrence && (
                                                <>
                                                    <td className='text-end' rowSpan={rowSpan}>{balance}</td>
                                                </>
                                            )}

                                            <td className='text-end'>{common.getHtmlDate(ele?.order?.orderDeliveryDate, 'ddmmyyyy')}</td>
                                            <td className='text-uppercase text-start'>{ele?.paymentMode}</td>
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
                                    <span className="badge badge-primary" style={{ color: 'black', fontSize: '20px' }}>{uniqueQty}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total Booking Amount
                                    <span className="badge badge-primary" style={{ color: 'black' }}>{uniqueBookingSum}</span>
                                </li>
                                {
                                    filterData.paymentMode === "All" &&
                                    paymentModeList.map((payEle, index) => {
                                        const color = common.colors[index % common.colors.length];
                                        return <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className='text-end'>
                                                Total Advance {""}
                                                <span style={{ color }}> {payEle.value}</span>
                                            </div>

                                            <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(billingData?.reduce((sum, ele) => {
                                                if (ele?.paymentMode?.toLowerCase() === payEle.value?.toLowerCase())
                                                    return sum += ele?.credit;
                                                else
                                                    return sum;
                                            }, 0))}</span>
                                        </li>
                                    })

                                }
                                {
                                    filterData.paymentMode !== "All" &&
                                    (
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className='text-end'>
                                                Total Advance {""}
                                                <span style={{ color: 'black' }}> {filterData.paymentMode}</span>
                                            </div>

                                            <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(billingData?.reduce((sum, ele) => {
                                                if (ele?.paymentMode?.toLowerCase() === filterData.paymentMode?.toLowerCase())
                                                    return sum += ele?.credit;
                                                else
                                                    return sum;
                                            }, 0))}</span>
                                        </li>
                                    )

                                }
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
                <PrintAdvanceCashVisaReport paymentModeList={paymentModeList} data={billingData} filterData={filterData} printRef={printRef} duplicateCounts={duplicateCounts} uniqueQty={uniqueQty} uniqueBookingSum={uniqueBookingSum} />
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
                                    <ErrorLabel message={errors?.contact1} />
                                    {viewCustomer && <>
                                        <Label fontSize='13px' text="Select Customer Name" helpText="Select Customer name"></Label>
                                        <div className='kan-list'>{
                                            customerList?.map((ele, index) => {
                                                return <div key={index} className={selectedOrder.customerId === ele?.id ? "item active" : "item"} style={{ cursor: 'pointer' }} onClick={e => handleEditChange({ target: { value: ele?.id, name: 'customerId', customerName: `${ele?.firstname} ${ele?.lastname ?? ''}` } })} >
                                                    {ele?.firstname} {ele?.lastname ?? ''}
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
