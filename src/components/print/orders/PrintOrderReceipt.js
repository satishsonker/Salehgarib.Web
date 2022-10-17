import React,{useState,useEffect} from 'react'
import { common } from '../../../utils/common';
import Label from '../../common/Label';
import InvoiceHead from '../../common/InvoiceHead';
import ReceiptFooter from '../ReceiptFooter';

export const PrintOrderReceipt = React.forwardRef((props, ref) => {
const [finalOrder, setFinalOrder] = useState([]);
    let mainData = common.cloneObject(props.props);
    const vat = parseFloat(process.env.REACT_APP_VAT);
        let cancelledOrDeletedSubTotal = 0;
        let cancelledOrDeletedVatTotal = 0;
        let cancelledOrDeletedTotal = 0;
        let advanceVat = ((props.props.advanceAmount / 100) * 5);
        let balanceVat = ((props.props.balanceAmount / 100) * 5);
        let cancelledOrDeletedOrderDetails = mainData?.orderDetails?.filter(x => x.isCancelled || x.isDeleted);
        if (cancelledOrDeletedOrderDetails?.length > 0) {
            cancelledOrDeletedSubTotal = 0;
            cancelledOrDeletedVatTotal = 0;
            cancelledOrDeletedTotal = 0;
            cancelledOrDeletedOrderDetails?.forEach(element => {
                cancelledOrDeletedSubTotal += element.subTotalAmount;
                cancelledOrDeletedVatTotal += (element.totalAmount - element.subTotalAmount);
                cancelledOrDeletedTotal += element.totalAmount;
            });
        }
        
    const activeOrderDetails = props.props?.orderDetails?.filter(x => !x.isCancelled && !x.isDeleted);
   useEffect(() => {
    if(activeOrderDetails===undefined)
    return;
    //Filter cancelled and deleted order details
    const orderChecker = [];
    const orders = [];
    activeOrderDetails?.forEach(res => {
        var orderindex = orderChecker.indexOf(res.workType + res.totalAmount);
        if (orderindex === -1) {
            res.qty = 1;
            debugger;
            res.vatAmount=0;
            res.vatAmount += common.calculateVAT(res.subTotalAmount, vat).vatAmount;
            orders.push(res);
            orderChecker.push(res.workType + res.totalAmount);
        }
        else {
            orders[orderindex].qty += 1;
            orders[orderindex].subTotalAmount += orders[orderindex].subTotalAmount;
            orders[orderindex].totalAmount += orders[orderindex].totalAmount;
            orders[orderindex].vatAmount += orders[orderindex].vatAmount;
        }
    });
    setFinalOrder(orders);
   }, [props.props])
   if (props === undefined || props.props === undefined || props.props.orderNo === undefined)
        return <></>
    const getWorkOrderTypes = (workType) => {
        if (workType === undefined || workType === null || workType === '') {
            return '';
        }
        let types = ['', 'Designing', 'Cutting', 'M. Emb', 'Hot Fix', 'H. Emb', 'Apliq', 'Stitching']
        let str = '';
        workType.split('').forEach(ele => {
            str += types[parseInt(ele)] + ', '
        });
        return str.substring(0, str.length - 1);
    }
    return (
        <>
            <div ref={ref} style={{ padding: '10px' }} className="row">

                <div className="col col-lg-12 mx-auto">
                    <div className="card border shadow-none">
                        <div className="card-header py-3">
                            <div className="row align-items-center g-3">
                                <InvoiceHead></InvoiceHead>
                            </div>
                        </div>
                        <div className="card-header py-2 bg-light">
                            <div className="row row-cols-12 row-cols-lg-12">
                                <div className="col-3">
                                    <Label fontSize='19px' bold={true} text="Order No"></Label>
                                    <div className='fs-2 fw-bold'>{props.props.orderNo}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Customer Name"></Label>
                                    <div>{props.props.customerName}</div>
                                    <Label fontSize='13px' bold={true} text="Order Date"></Label>
                                    <div>{common.getHtmlDate(props.props.orderDate)}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Contact No"></Label>
                                    <div>{props.props.contact1}</div>
                                    <Label fontSize='13px' bold={true} text="Delivery Date"></Label>
                                    <div>{common.getHtmlDate(props.props.orderDeliveryDate)}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Salesman"></Label>
                                    <div className='fs-6 fw-bold'>{props.props.salesman}</div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-invoice" style={{ fontSize: '12px' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-center all-border' style={{ width: 'max-content !important' }}>S.No.</th>
                                            <th className="text-center all-border" width="30%">DESCRIPTION</th>
                                            <th className="text-center all-border" width="10%">Model No.</th>
                                            <th className="text-center all-border" width="10%">Qty.</th>
                                            <th className="text-center all-border" width="10%">Item Price</th>
                                            <th className="text-center all-border" width="8%">Unit Price</th>
                                            <th className="text-center all-border" width="8%">Vat {vat}%</th>
                                            <th className="text-center all-border" width="8%">Total Dhs.</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            finalOrder?.map((ele, index) => {
                                                return <tr key={ele.id}>
                                                    <td className="text-center border border-secondary" style={{ width: 'max-content !important' }}>{index + 1}.</td>
                                                    <td className="text-center border border-secondary text-wrap" width="30%">{getWorkOrderTypes(ele.workType)}</td>
                                                    <td className="text-center border border-secondary" width="10%">{`${common.defaultIfEmpty(ele.designCategory,"")} - ${common.defaultIfEmpty(ele.designModel,'')}`}</td>
                                                    <td className="text-center border border-secondary" width="10%">{ele.qty?.toFixed(2)}</td>
                                                    <td className="text-center border border-secondary" width="10%">{(ele.subTotalAmount / ele.qty).toFixed(2)}</td>
                                                    <td className="text-center border border-secondary" width="8%">{ele?.subTotalAmount?.toFixed(2)}</td>
                                                    <td className="text-center border border-secondary" width="8%">{ele?.vatAmount?.toFixed(2)}</td>
                                                    <td className="text-center border border-secondary" width="8%">{ele?.totalAmount?.toFixed(2)}</td>
                                                </tr>
                                            })
                                        }
                                       
                                    </tbody>
                                </table>
                                <table className='table table-bordered'>
                                    <tbody>
                                    <tr>
                                        <td colSpan={3} className="text-start"><i className='bi bi-call'/>{process.env.REACT_APP_COMPANY_NUMBER} <i className='bi bi-whatsapp text-success'></i></td>
                                        <td colSpan={1} className="text-end" >Total Quantity</td>
                                        <td colSpan={2} className="text-center">VAT {vat}%</td>
                                        <td colSpan={2} className="fs-6 fw-bold text-center">Total Amount</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="text-start"><i className='bi bi-mail'/> {process.env.REACT_APP_COMPANY_EMAIL}<i className='bi bi-envelope text-success'></i></td>
                                        <td colSpan={1} className="text-end" >{mainData.qty?.toFixed(2)}</td>
                                        <td className="fs-6 fw-bold text-center">Total VAT</td>
                                        <td className="text-end">{common.calculatePercent((props.props.totalAmount - cancelledOrDeletedTotal),5).toFixed(2)}</td>
                                        <td className="fs-6 fw-bold text-center">Total Amount</td>
                                        <td className="text-end">{(props.props.totalAmount - cancelledOrDeletedTotal)?.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} className="text-start">Received by.................................</td>
                                        <td className="fs-6 fw-bold text-center">Adv VAT</td>
                                        <td className="text-end">{advanceVat.toFixed(2)}</td>
                                        <td className="fs-6 fw-bold text-center">Total Advance</td>
                                        <td className="text-end">{(props.props.advanceAmount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} className="text-start"></td>
                                        <td className="fs-6 fw-bold text-center">Bal VAT</td>
                                        <td className="text-end">{balanceVat.toFixed(2)}</td>
                                        <td className="fs-6 fw-bold text-center">Total Balance</td>
                                        <td className="text-end">{(props.props.totalAmount - cancelledOrDeletedTotal-props.props.advanceAmount )?.toFixed(2)}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <ReceiptFooter />
                    </div>
                </div>
            </div>
        </>
    )
})
