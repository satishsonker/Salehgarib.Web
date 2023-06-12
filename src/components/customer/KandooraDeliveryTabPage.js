import React, { useState, useEffect, useRef } from 'react'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import Dropdown from '../common/Dropdown'
import ErrorLabel from '../common/ErrorLabel'
import Inputbox from '../common/Inputbox'
import TableView from '../tables/TableView';
import { useReactToPrint } from 'react-to-print';
import Label from '../common/Label'
import PrintOrderDelivery from '../print/orders/PrintOrderDelivery';
import { common } from '../../utils/common';
import { validationMessage } from '../../constants/validationMessage'
import { toast } from 'react-toastify'
import { toastMessage } from '../../constants/ConstantValues'
import ButtonBox from '../common/ButtonBox'
import { headerFormat } from '../../utils/tableHeaderFormat'

export default function KandooraDeliveryTabPage({ order, searchHandler, paymentModeData, tabIndex, setTabPageIndex, setSelectedImageToZoom }) {
    const vat = parseFloat(process.env.REACT_APP_VAT);
    const [orderData, setOrderData] = useState({});
    const [isSaved, setIsSaved] = useState(0);
    const [printOrderId, setPrintOrderId] = useState(0);
    const [stitchedImageList, setStitchedImageList] = useState([]);
    const [errors, setErrors] = useState({});
    const deliveryPaymentModelTemplete = {
        preBalance: 0,
        currentOrderAmount: 0,
        advanceAmount: 0,
        balanceAmount: 0,
        lastPaidAmount: 0,
        totalPaidAmount: 0,
        deliveredKandoorIds: [],
        paidAmount: '',
        paymentDate: common.getHtmlDate(new Date()),
        paymentMode: 'Cash',
        dueAfterPayment: 0,
        allDelivery: false,
        totalKandoorInOrder: order?.orderDetails?.length,
        orderBalanceAmount: order?.balanceAmount,
        deliveredOn: common.getHtmlDate(new Date())
    };
    const [deliveryPaymentModel, setDeliveryPaymentModel] = useState(deliveryPaymentModelTemplete);
    const tableOptionOrderDetailsTemplet = {
        headers: headerFormat.orderDeliveryFormat,
        changeRowClassHandler: (data, prop) => {
            return data?.status.toLowerCase() === 'delivered' && prop !== "status" ? "bg-success text-white" : "";
        },
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        showAction: false
    };
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    const [kandooraList, setKandooraList] = useState([]);
    const handleTextChange = (e) => {
        let { type, name, value, checked } = e.target;
        let mainData = deliveryPaymentModel;
        if (name === "orderDetailNo") {
            if (checked && mainData.deliveredKandoorIds.indexOf(value) === -1)
                mainData.deliveredKandoorIds.push(parseInt(value));
            if (!checked && mainData.deliveredKandoorIds.indexOf(parseInt(value)) !== -1)
                mainData.deliveredKandoorIds.pop(value);
        }
        if (type === 'select-one' && name !== 'paymentMode') {
            value = parseInt(value);
        }
        if (type === 'number') {
            value = parseFloat(value);
        }
        mainData.paymentDate = mainData.deliveredOn;
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
            mainData.dueAfterPayment = mainData.balanceAmount + mainData.preBalance - (isNaN(mainData.paidAmount) ? 0 : mainData.paidAmount);
            mainData.orderBalanceAmount= mainData.dueAfterPayment- mainData.preBalance;
        }
        setDeliveryPaymentModel({ ...mainData });
    }
    useEffect(() => {
        if (tabIndex > 0 || order === undefined || order?.orderDetails == undefined || order?.orderDetails?.length === 0)
            return;
        var moduleIds = "";
        order.orderDetails.forEach(ele => {
            moduleIds += `moduleIds=${ele.id}&`;
        });
        Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `1/?${moduleIds}`)
            .then(res => {
                setStitchedImageList(res.data.filter(x => x.remark === 'stitched'));
            });
    }, [order, tabIndex, isSaved]);

    useEffect(() => {
        setErrors({});
        if (order === undefined || Object.keys(order).length === 0) {
            return;
        }
        if (order?.id === undefined)
            return;
        let kandooraNos = [];

        order.orderDetails.forEach(element => {
            if (element.status.toLowerCase() !== 'delivered') {
                kandooraNos.push({ id: element.id, value: element.orderNo, status: element.status, isCancelled: element.isCancelled, isDeleted: element.isDeleted });
            }
        });

        setKandooraList(kandooraNos);
        let apiList = [];
        apiList.push(Api.Get(apiUrls.orderController.getPreviousAmount + `?customerId=${order.customerId}&excludeOrderId=${order.id}`));
        apiList.push(Api.Get(apiUrls.orderController.getCustomerPaymentForOrder + order.id));
        apiList.push(Api.Get(apiUrls.orderController.get + order?.id))
        Api.MultiCall(apiList)
            .then(res => {
                let mainData = deliveryPaymentModel;
                order = res[2].data;
                setOrderData({ ...order })
                mainData.orderId = order.id
                mainData.customerId = order.customerId;
                mainData.orderNo = order.orderNo;
                mainData.currentOrderAmount = order.totalAmount;
                mainData.advanceAmount = order.advanceAmount;
                mainData.preBalance = res[0].data;
                mainData.lastPaidAmount = res[1].data.lastPaidAmount === null ? 0 : res[1].data.lastPaidAmount;
                mainData.totalPaidAmount = res[1].data.totalPaidAmount === null ? 0 : res[1].data.totalPaidAmount;
                mainData.paidAmount = 0;
                mainData.deliveredKandoorIds = [];
                mainData.balanceAmount = order.balanceAmount;
                mainData.dueAfterPayment = mainData.balanceAmount - mainData.paidAmount + mainData.preBalance;
                order.orderDetails.forEach(element => {
                    element.vat = vat;
                    element.vatAmount = common.calculateVAT(element.subTotalAmount, vat).vatAmount;
                });
                tableOptionOrderDetailsTemplet.data = order.orderDetails;
                tableOptionOrderDetailsTemplet.totalRecords = order?.orderDetails?.length;
                setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
                setDeliveryPaymentModel({ ...mainData });
            })
    }, [order, tabIndex, isSaved]);

    const validateSavePayment = () => {
        var { paidAmount, dueAfterPayment, allDelivery, deliveredKandoorIds } = deliveryPaymentModel;
        const newError = {};
        if (!allDelivery && deliveredKandoorIds.length === 0) newError.deliveredKandoorIds = "Please select at least one kandoora"
        if (!paidAmount || paidAmount === '' || paidAmount <= 0) newError.paidAmount = validationMessage.paidAmountRequired;
        //if (dueAfterPayment <= -1) newError.dueAfterPayment = validationMessage.dueAmountError;
        return newError;
    }
    const getKandooraNo = (id) => {
        if (order === undefined || order?.orderDetails === undefined || order?.orderDetails?.length === 0)
            return "";
        var stitchImage = order?.orderDetails.find(x => x.id === id);
        return stitchImage === undefined ? "" : stitchImage.orderNo;
    }
    const savePayment = () => {
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
                    searchHandler('');
                    setIsSaved(pre => pre + 1);
                }
                else {
                    toast.warn(toastMessage.saveError);
                }
            })
    }
    const printDeliveryReceiptRef = useRef();
    const printDeliveryReceiptHandler = useReactToPrint({
        content: () => printDeliveryReceiptRef.current,
    });
    const printDeliveryReceiptHandlerMain = (id) => {
        setPrintOrderId(id, printDeliveryReceiptHandler());
    }
    return (
        <div className='tab-page'>
            <div className="card">
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>Order No. {order?.orderNo}</div>
                        <div className='col-4'>Customer Name : {order?.customerName}</div>
                        <div className='col-4'>Contact : {order?.contact1}</div>
                        <div className='col-4'>Delivery Date : {common.getHtmlDate(order?.orderDeliveryDate, "ddmmyyyy")}</div>
                        <div className='col-4'>Order Date : {common.getHtmlDate(order?.orderDate, "ddmmyyyy")}</div>
                    </div>
                </div>
            </div>
            <TableView option={tableOptionOrderDetails} />
            <div className="card">
                <div className="card-body">
                    <div className='row g-1'><div className='col-12'>
                        {
                            stitchedImageList.length > 0 && <div className='d-flex justify-content-center img-list'>
                                {
                                    stitchedImageList?.map((res, index) => {
                                        return <div key={index}>
                                            <div className='text-center text-danger' style={{ fontSize: '10px' }}>Click on image to zoom-in</div>
                                            <img className='img-list-item' style={{ cursor: 'zoom-in' }} onClick={e => { setTabPageIndex(2); setSelectedImageToZoom(process.env.REACT_APP_API_URL + res.thumbPath) }} src={process.env.REACT_APP_API_URL + res.thumbPath} />
                                            <div className='text-center' style={{ fontSize: '12px' }}>{getKandooraNo(res.moduleId)}</div>
                                        </div>
                                    })
                                }
                            </div>
                        }
                        {
                            stitchedImageList.length === 0 && <div className='text-center text-danger'>No Stitched Image Found</div>
                        }
                    </div>
                        <div className="col-md-12 mb-2">
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
                                    <Inputbox type="date" labelText="Delivered On" name="deliveredOn" onChangeHandler={handleTextChange} className="form-control-sm" value={deliveryPaymentModel.deliveredOn} max={common.getHtmlDate(new Date())} />
                                </div>
                            </div>

                            {!deliveryPaymentModel.allDelivery &&
                                <>
                                    <div className='kan-list' title='Only completed kandoora will be listed below'>{
                                        kandooraList?.map(ele => {
                                            if (ele.status?.toLowerCase() === "completed" && !ele.isCancelled && !ele.isDeleted)
                                                return <div key={ele.id} className={deliveryPaymentModel.deliveredKandoorIds.indexOf(ele.id) === -1 ? "item" : "item active"} >
                                                    <input className="form-check-input me-1" name='orderDetailNo' onChange={e => handleTextChange(e)} type="checkbox" value={ele.id} aria-label="..." />
                                                    {ele.value}
                                                </div>
                                        })
                                    }
                                    </div>
                                </>
                            }
                            <ErrorLabel message={errors.deliveredKandoorIds} />
                        </div>


                        <div className="col-md-3">
                            <Inputbox labelText="Total Amount" className="form-control-sm" value={common.printDecimal(deliveryPaymentModel.currentOrderAmount)} disabled={true} placeholder="0.00" />
                        </div>
                        <div className="col-md-3">
                            <Inputbox labelText="Total Advance Amount" className="form-control-sm" value={common.printDecimal(deliveryPaymentModel.advanceAmount)} disabled={true} placeholder="0.00" />
                        </div>
                       
                        <div className="col-md-3">
                            <Inputbox labelText="Total Paid Amount" className="form-control-sm" value={common.printDecimal(deliveryPaymentModel.totalPaidAmount)} disabled={true} placeholder="0.00" />
                        </div>
                         <div className="col-md-2">
                            <Inputbox labelText="Last Paid Amount" className="form-control-sm" value={common.printDecimal(deliveryPaymentModel.lastPaidAmount)} disabled={true} placeholder="0.00" />
                        </div>
                        <div className="col-md-3">
                            <Inputbox labelText="Previous Order(s) Balance" className="form-control-sm" value={common.printDecimal(deliveryPaymentModel.preBalance)} disabled={true} placeholder="0.00" />
                        </div>
                        <div className="col-md-2">
                            <Inputbox labelText="This Order Balance" className="form-control-sm" value={common.printDecimal((deliveryPaymentModel.balanceAmount < 0 ? 0 : deliveryPaymentModel.balanceAmount)-deliveryPaymentModel.paidAmount)} disabled={true} placeholder="0.00" />
                        </div>
                        <div className="col-md-2">
                            <Inputbox labelText="Paid Amount" name="paidAmount" onChangeHandler={handleTextChange} min={0} max={99999999} errorMessage={errors.paidAmount} className="form-control-sm" type="number" value={deliveryPaymentModel.paidAmount} placeholder="0.00" />
                        </div> <div className="col-md-3">
                            <Inputbox labelText="Total Balance Amount" labelTextHelp="Total Balance amount = Previous Amount + This Order Amount" errorMessage={errors.dueAfterPayment} className="form-control-sm" value={common.printDecimal(deliveryPaymentModel.dueAfterPayment < 0 ? 0 : deliveryPaymentModel.dueAfterPayment)} disabled={true} placeholder="0.00" />
                        </div>
                        {/* <div className="col-md-3">
                            <Inputbox labelText="Payment Date" className="form-control-sm" type="date" name="paymentDate" onChangeHandler={handleTextChange} value={deliveryPaymentModel.paymentDate} errorMessage={errors.paymentDate} />
                        </div> */}
                        <div className="col-md-3">
                            <Label fontSize='13px' text="Payment Mode"></Label>
                            <Dropdown data={paymentModeData} name="paymentMode" className="form-control-sm" value={deliveryPaymentModel.paymentMode} elementKey="value" onChange={handleTextChange} />
                            <ErrorLabel message={errors.paymentMode} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-12 text-end mb-2'>
                <ButtonBox className="btn-sm" type="save" style={{ marginRight: '10px' }} onClickHandler={savePayment} />
                <ButtonBox className="btn-sm" type="print" style={{ marginRight: '10px' }} onClickHandler={() => { setTabPageIndex(3) }} />
            </div>
        </div>
    )
}
