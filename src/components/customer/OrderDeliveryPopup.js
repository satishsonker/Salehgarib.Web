import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import { useReactToPrint } from 'react-to-print';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';
import { PrintOrderDelivery } from '../print/orders/PrintOrderDelivery';

export default function OrderDeliveryPopup({ order, searchHandler }) {
    const vat = parseFloat(process.env.REACT_APP_VAT);
    const [isSaved, setIsSaved] = useState(false);
    const [printOrderId, setPrintOrderId] = useState(0);
    const deliveryPaymentModelTemplete = {
        preBalance: 0,
        currentOrderAmount: 0,
        advanceAmount: 0,
        balanceAmount: 0,
        lastPaidAmount: 0,
        totalPaidAmount: 0,
        //deliveredKandoorId: 0,
        deliveredKandoorIds: [],
        paidAmount: '',
        dueAfterPayment: 0,
        allDelivery: false,
        deliveredOn: common.getHtmlDate(new Date())
    };
    const [addAdvancePaymentModelTemplate, setAddAdvancePaymentModelTemplate] = useState({
        orderId: 0,
        credit: 0,
        paymentMode: '',
        reason: '',
        remark: '',
        customerId: 0,
        index: -1
    });
    const [addAdvancePaymentModel, setAddAdvancePaymentModel] = useState([])
    const [paymentModeList, setPaymentModeList] = useState([])
    const [tabPageIndex, setTabPageIndex] = useState(0);
    const [deliveryPaymentModel, setDeliveryPaymentModel] = useState(deliveryPaymentModelTemplete);
    const tableOptionOrderDetailsTemplet = {
        headers: [
            { name: "Status", prop: "status" },
            { name: "Order No", prop: "orderNo" },
            { name: "Delivery Date", prop: "orderDeliveryDate" },
            { name: "Delivered On", prop: "deliveredDate" },
            { name: "Price", prop: "price", action: { decimal: true } },
            { name: `VAT ${vat}%`, prop: "vatAmount", action: { decimal: true } },
            { name: "Total Amount", prop: "totalAmount", action: { decimal: true } }
        ],
        changeRowClassHandler: (data) => {
            return data?.status.toLowerCase() === 'delivered' ? "bg-success text-white" : "";
        },
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        showAction: false
    }
    const [errors, setErrors] = useState({});
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    const [kandooraList, setKandooraList] = useState([]);
    const printDeliveryReceiptRef = useRef();

    const printDeliveryReceiptHandler = useReactToPrint({
        content: () => printDeliveryReceiptRef.current,
    });

    const printDeliveryReceiptHandlerMain = (id) => {
        printDeliveryReceiptHandler();
        setPrintOrderId(id);
    }

    const tableOptionAdvStatementTemplet = {
        headers: [
            { name: "Amount", prop: "credit", action: { decimal: true } },
            { name: "Date", prop: "createdAt" },
            { name: "Payment By", prop: "paymentMode" }
        ],
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        showAction: false
    }

    const deleteNewAdvPaymentHandler = (index) => {
        let filterData = addAdvancePaymentModel.filter(x => x.index !== index);
        setAddAdvancePaymentModel(common.cloneObject(filterData));
    }

    const tableOptionNewAdvStatementTemplet = {
        headers: [
            { name: "Amount", prop: "credit", action: { decimal: true } },
            { name: "Payment By", prop: "paymentMode" }
        ],
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        actions: {
            showView: false,
            showEdit: false,
            showDelete: false,
            buttons: [
                {
                    modelId: "",
                    icon: "bi bi-trash",
                    title: 'Delete',
                    handler: deleteNewAdvPaymentHandler,
                    showModel: false
                }
            ]
        }
    }

    const [tableOptionAdvStatement, setTableOptionAdvStatement] = useState(tableOptionAdvStatementTemplet);


    useEffect(() => {
        setErrors({});
        if (tabPageIndex !== 0 || order === undefined || Object.keys(order).length === 0) {
            return;
        }

        let kandooraNos = [];

        order.orderDetails.forEach(element => {
            if (element.status.toLowerCase() !== 'delivered') {
                kandooraNos.push({ id: element.id, value: element.orderNo });
            }
        });

        setKandooraList(kandooraNos);
        let apiList = [];
        apiList.push(Api.Get(apiUrls.orderController.getPreviousAmount + `?customerId=${order.customerId}&excludeOrderId=${order.id}`));
        apiList.push(Api.Get(apiUrls.orderController.getCustomerPaymentForOrder + order.id));
        Api.MultiCall(apiList)
            .then(res => {
                let mainData = deliveryPaymentModel;
                mainData.orderId = order.id
                mainData.customerId = order.customerId;
                mainData.orderNo = order.orderNo;
                mainData.currentOrderAmount = order.totalAmount;
                mainData.advanceAmount = order.advanceAmount;
                mainData.preBalance = res[0].data;
                mainData.lastPaidAmount = res[1].data.lastPaidAmount === null ? 0 : res[1].data.lastPaidAmount;
                mainData.totalPaidAmount = res[1].data.totalPaidAmount === null ? 0 : res[1].data.totalPaidAmount;
                mainData.paidAmount = '';
                mainData.deliveredKandoorIds = [];
                mainData.balanceAmount = order.balanceAmount - mainData.totalPaidAmount + mainData.preBalance;
                mainData.dueAfterPayment = mainData.balanceAmount - mainData.paidAmount;
                order.orderDetails.forEach(element => {
                    element.vat = vat;
                    element.vatAmount = common.calculateVAT(element.subTotalAmount, vat).vatAmount;
                });
                tableOptionOrderDetailsTemplet.data = order.orderDetails;
                tableOptionOrderDetailsTemplet.totalRecords = order?.orderDetails?.length;
                setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
                setDeliveryPaymentModel({ ...mainData });
            })
    }, [order, tabPageIndex, isSaved]);

    useEffect(() => {
        if (tabPageIndex === 0)
            return;
        let apiList = [];
        apiList.push(Api.Get(apiUrls.orderController.getAdvancePaymentStatement + order.id));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataType + "?masterDataType=payment_mode"))
        Api.MultiCall(apiList)
            .then(res => {
                tableOptionAdvStatementTemplet.data = res[0].data;
                tableOptionAdvStatementTemplet.totalRecords = res[0].data.length;
                setPaymentModeList(res[1].data)
                setTableOptionAdvStatement(tableOptionAdvStatementTemplet);
            })
    }, [tabPageIndex])


    const handleTextChange = (e) => {
        let { type, name, value, checked } = e.target;
        let mainData = deliveryPaymentModel;

        if (name === "orderDetailNo") {
            if (checked && mainData.deliveredKandoorIds.indexOf(value) === -1)
                mainData.deliveredKandoorIds.push(parseInt(value));
            if (!checked && mainData.deliveredKandoorIds.indexOf(parseInt(value)) !== -1)
                mainData.deliveredKandoorIds.pop(value);
        }
        if (type === 'select-one') {
            value = parseInt(value);
        }
        if (type === 'number') {
            value = parseFloat(value);
        }

        if (name === 'allDelivery') {
            mainData[name] = checked;
            if (checked) {
                let ids = [];
                kandooraList.forEach(res => {
                    ids.push(parseInt(res.id));
                });
                mainData.deliveredKandoorIds = ids;
            }
            else
                mainData.deliveredKandoorIds = [];

        }
        else
            mainData[name] = value;
        if (name === 'paidAmount') {
            mainData.dueAfterPayment = mainData.balanceAmount - (isNaN(mainData.paidAmount) ? 0 : mainData.paidAmount);
        }
        setDeliveryPaymentModel({ ...mainData });
    }

    const handleAdveTxtChange = (e) => {
        let { type, name, value } = e.target;
        if (type === 'number') {
            value = parseFloat(value);
        }
        let modelData = addAdvancePaymentModelTemplate;
        modelData[name] = value;
        setAddAdvancePaymentModelTemplate({ ...modelData });
    }
    const addAdvPaymentData = () => {
        let formError = {};
        if (addAdvancePaymentModelTemplate.credit === 0)
            formError.credit = validationMessage.advanceAmountRequired;
        if (addAdvancePaymentModelTemplate.paymentMode === '')
            formError.paymentMode = validationMessage.paymentModeRequired;
        if (Object.keys(formError).length > 0) {
            setErrors({ ...formError });
            return;
        }
        else {
            setErrors({});
        }
        let mainData = addAdvancePaymentModel;
        addAdvancePaymentModelTemplate.customerId = order.customerId;
        addAdvancePaymentModelTemplate.orderId = order.id;
        addAdvancePaymentModelTemplate.reason = "AdvancedPaid";
        addAdvancePaymentModelTemplate.remark = "updated from delivery page";
        addAdvancePaymentModelTemplate.index = mainData.length;
        mainData.push(addAdvancePaymentModelTemplate);
        setAddAdvancePaymentModel(mainData);
        setAddAdvancePaymentModelTemplate({
            ...{
                orderId: 0,
                credit: 0,
                paymentMode: '',
                reason: '',
                remark: '',
                customerId: 0,
                index: -1
            }
        });
    }

    const validateSavePayment = () => {
        var { paidAmount, dueAfterPayment, allDelivery, deliveredKandoorIds } = deliveryPaymentModel;
        const newError = {};
        if (!allDelivery && deliveredKandoorIds.length === 0) newError.deliveredKandoorIds = "Please select at least one kandoora"
        if (!paidAmount || paidAmount === '' || paidAmount <= 0) newError.paidAmount = validationMessage.paidAmountRequired;
        if (dueAfterPayment <= -1) newError.dueAfterPayment = validationMessage.dueAmountError;
        return newError;
    }
    const savePayment = () => {
        setIsSaved(false);
        let formError = validateSavePayment();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return;
        }
        else
            setErrors({});

        Api.Post(apiUrls.orderController.updateDeliveryPayment, deliveryPaymentModel)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.saveSuccess);
                    // common.closePopup('kandoora-delivery-popup-model');
                    searchHandler('');
                    setIsSaved(true);
                }
                else {
                    toast.warn(toastMessage.saveError);
                }
            })
    }
    const saveAdvancePayment = () => {
        Api.Post(apiUrls.customerController.addAdvancePayment, addAdvancePaymentModel)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.saveSuccess);
                    setAddAdvancePaymentModel([]);
                    setTabPageIndex(2)
                }
            })
    }
    return (
        <>
            <div className="modal fade" id="kandoora-delivery-popup-model" tabIndex="-1" aria-labelledby="kandoora-delivery-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="kandoora-delivery-popup-model-label">Kandoora Delivery Status</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='tab-header'>
                                <div className="d-flex flex-row justify-content-start" style={{ fontSize: 'var(--app-font-size)' }}>
                                    <div className={tabPageIndex === 0 ? "p-2 tab-header-button tab-header-button-active" : "p-2 tab-header-button"} onClick={e => setTabPageIndex(0)}>Kandoora Delivery</div>
                                    <div className={tabPageIndex === 1 || tabPageIndex === 2 ? "p-2 tab-header-button tab-header-button-active" : "p-2 tab-header-button"} onClick={e => setTabPageIndex(1)}>Advance Payment</div>
                                </div>
                            </div>
                            {
                                tabPageIndex === 0 && <>
                                    <div className='tab-page'>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className='row'>
                                                    <div className='col-4'>Order No. {order?.orderNo}</div>
                                                    <div className='col-4'>Customer Name : {order?.customerName}</div>
                                                    <div className='col-4'>Contact : {order?.contact1}</div>
                                                    <div className='col-4'>Delivery Date : {common.getHtmlDate(order?.orderDeliveryDate)}</div>
                                                    <div className='col-4'>Order Date : {common.getHtmlDate(order?.orderDate)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <TableView option={tableOptionOrderDetails} />
                                        <div className="card">
                                            <div className="card-body">
                                                <div className='row g-1'>
                                                    <div className="col-md-12">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="p-2 bd-highlight">
                                                                <Label fontSize='13px' text="Delivery Type"></Label>
                                                                <br />
                                                                <div className="form-check form-switch">
                                                                    <input className="form-check-input" name='allDelivery' onChange={e => handleTextChange(e)} type="checkbox" id="flexSwitchCheckChecked" />
                                                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">All</label>
                                                                </div>
                                                            </div>
                                                            <div className="p-2 bd-highlight">
                                                                <Label fontSize='13px' text="Delivered On"></Label>
                                                                <input type="date" name='deliveredOn' onChange={e => handleTextChange(e)} className="form-control form-control-sm" value={deliveryPaymentModel.deliveredOn} max={common.getHtmlDate(new Date())} />
                                                            </div>
                                                        </div>

                                                        {!deliveryPaymentModel.allDelivery &&
                                                            <div className='kan-list'>{
                                                                kandooraList?.map(ele => {
                                                                    return <div className={deliveryPaymentModel.deliveredKandoorIds.indexOf(ele.id) === -1 ? "item" : "item active"} >
                                                                        <input className="form-check-input me-1" name='orderDetailNo' onChange={e => handleTextChange(e)} type="checkbox" value={ele.id} aria-label="..." />
                                                                        {ele.value}
                                                                    </div>
                                                                })
                                                            }
                                                            </div>
                                                        }
                                                        <ErrorLabel message={errors.deliveredKandoorIds} />
                                                    </div>

                                                    <div className="col-md-3">
                                                        <Label fontSize='13px' text="Previouse Balance"></Label>
                                                        <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.preBalance?.toFixed(2)} placeholder="0" disabled />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Label fontSize='13px' text="Current Order Amount"></Label>
                                                        <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.currentOrderAmount?.toFixed(2)} placeholder="0" disabled />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Label fontSize='13px' text="Advance Amount"></Label>
                                                        <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.advanceAmount?.toFixed(2)} placeholder="0" disabled />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Label fontSize='13px' text="Last Paid Amount"></Label>
                                                        <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.lastPaidAmount?.toFixed(2)} placeholder="0" disabled />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Label fontSize='13px' text="Total Paid Amount"></Label>
                                                        <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.totalPaidAmount?.toFixed(2)} placeholder="0" disabled />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Label fontSize='13px' text="Total Due Amount"></Label>
                                                        <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel?.balanceAmount?.toFixed(2)} placeholder="0" disabled />
                                                    </div>

                                                    <div className="col-md-3">
                                                        <Label fontSize='13px' text="Paid Amount" helpText="Amount paying by customer"></Label>
                                                        <input type="number" onChange={e => handleTextChange(e)} min={0} className="form-control form-control-sm" value={deliveryPaymentModel?.paidAmount} name="paidAmount" placeholder="0" />
                                                        <ErrorLabel message={errors.paidAmount} />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Label fontSize='13px' text="Balance Amount"></Label>
                                                        <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.dueAfterPayment?.toFixed(2)} placeholder="0" disabled />
                                                        <ErrorLabel message={errors.dueAfterPayment} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            {
                                (tabPageIndex === 1 || tabPageIndex === 2) && <>
                                    <div className='tab-page'>
                                        <div className='row px-4'>
                                            <div className='col-12 my-3'>
                                                <div className='px-3 fs-5'>New Advance Payment</div>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <Label fontSize='12px' text="Amount"></Label>
                                                <input type="number" min={0} onChange={e => handleAdveTxtChange(e)} value={addAdvancePaymentModelTemplate.credit} className="form-control form-control-sm" name='credit' />
                                                <ErrorLabel message={errors.credit} />
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <Label fontSize='12px' text="Payment Mode"></Label>
                                                <Dropdown className='form-control-sm' onChange={handleAdveTxtChange} data={paymentModeList} value={addAdvancePaymentModelTemplate.paymentMode} defaultValue='Cash' elemenyKey="value" name="paymentMode" defaultText="Select payment mode" />
                                                <ErrorLabel message={errors.paymentMode} />
                                            </div>
                                            <div className="col-12 col-md-4 mt-3">
                                                <button type='button' onClick={e => addAdvPaymentData()} className='btn btn-sm btn-info'>Add</button>
                                            </div>
                                        </div>
                                        {addAdvancePaymentModel.length > 0 && <>

                                            <table className='table table-bordered my-3'>
                                                <thead>
                                                    <tr>
                                                        {
                                                            tableOptionNewAdvStatementTemplet.headers.map(ele => {
                                                                return <th key={ele.name}>{ele.name}</th>
                                                            })
                                                        }
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        addAdvancePaymentModel?.map((ele, index) => {
                                                            return <tr key={ele.index}>
                                                                {
                                                                    tableOptionNewAdvStatementTemplet.headers.map(header => {
                                                                        return <td key={header.prop}>{ele[header.prop]}</td>
                                                                    })
                                                                }
                                                                <td>
                                                                    <div style={{ cursor: "poiqnter !important" }}
                                                                        onClick={e => deleteNewAdvPaymentHandler(index)}
                                                                        className="text-danger"
                                                                        title="Delete">
                                                                        <i className="bi bi-trash"></i>
                                                                    </div></td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                            <div className="col-12 col-md-4 mt-3">
                                                <button type='button' onClick={e => saveAdvancePayment()} className='btn btn-sm btn-info'>Save Payment</button>
                                            </div>
                                            <div className='clearfix'></div>
                                        </>}
                                        <hr />
                                        <div className='col-12'>
                                            <div className='px-3 fs-5'>Advance Payment History</div>
                                        </div>
                                        <TableView option={tableOptionAdvStatement} />
                                    </div>
                                </>
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={e => savePayment()} >Save</button>
                            <button type="button" className="btn btn-warning" onClick={e => printDeliveryReceiptHandlerMain(order.id)} >Print</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                        <div className='d-none'>
                            <PrintOrderDelivery ref={printDeliveryReceiptRef} prebalance={deliveryPaymentModel.preBalance} props={printOrderId}></PrintOrderDelivery>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
