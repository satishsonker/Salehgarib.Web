import React from 'react'
import { common } from '../../../utils/common';
import Barcode from 'react-barcode/lib/react-barcode';
import Label from '../../common/Label';
import InvoiceHead from '../../common/InvoiceHead';
import ReceiptFooter from '../ReceiptFooter';

export const PrintOrderReceipt = React.forwardRef((props, ref) => {

    let mainData = common.cloneObject(props.props);
    if (props === undefined || props.props === undefined || props.props.orderNo === undefined)
        return <></>

    let cancelledOrDeletedSubTotal = 0;
    let cancelledOrDeletedVatTotal = 0;
    let cancelledOrDeletedTotal = 0;
    let advanceVat = ((props.props.advanceAmount / 100) * 5);
    let balanceVat = ((props.props.balanceAmount / 100) * 5);
    let cancelledOrDeletedOrderDetails = mainData.orderDetails.filter(x => x.isCancelled || x.isDeleted);
    if (cancelledOrDeletedOrderDetails.length > 0) {
        cancelledOrDeletedSubTotal = 0;
        cancelledOrDeletedVatTotal = 0;
        cancelledOrDeletedTotal = 0;
        cancelledOrDeletedOrderDetails.forEach(element => {
            cancelledOrDeletedSubTotal += element.subTotalAmount;
            cancelledOrDeletedVatTotal += (element.totalAmount - element.subTotalAmount);
            cancelledOrDeletedTotal += element.totalAmount;
        });
    }
    //Filter cancelled and deleted order details
    let activeOrderDetails = props.props.orderDetails.filter(x => !x.isCancelled && !x.isDeleted);
    return (
        <>
            <div ref={ref} style={{ padding: '10px' }} className="row">

                <div className="col col-lg-12 mx-auto">
                    <div className="card border shadow-none">
                        <div className="card-header py-3">
                            <div className="row align-items-center g-3">
                                <InvoiceHead></InvoiceHead>
                                {/* <div className="col-5">
                                    <Barcode value={props.props.orderNo} width={3} height={30}></Barcode>
                                </div> */}
                                {/* <div className="col-12 col-lg-6 text-md-end">
                                    <a href="javascript:;" className="btn btn-sm btn-danger me-2"><i className="bi bi-file-earmark-pdf-fill"></i> Export as PDF</a>
                                    <a href="javascript:;" onclick="window.print()" className="btn btn-sm btn-secondary"><i className="bi bi-printer-fill"></i> Print</a>
                                </div> */}
                            </div>
                        </div>
                        <div className="card-header py-2 bg-light">
                            <div className="row row-cols-12 row-cols-lg-12">
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Order No"></Label>
                                    <div>{props.props.orderNo}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Customer Name"></Label>
                                    <div>{props.props.customerName.split('-')[0]}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Contact No"></Label>
                                    <div>{props.props.customerName.split('-').length > 1 ? props.props.customerName.split('-')[1] : ""}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Order Date"></Label>
                                    <div>{common.getHtmlDate(props.props.orderDate)}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Salesman"></Label>
                                    <div>{props.props.salesman}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Delivery Date"></Label>
                                    <div>{common.getHtmlDate(props.props.orderDeliveryDate)}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Reference Name"></Label>
                                    <div>{props.props.customerRefName}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Order Placed By"></Label>
                                    <div>{props.props.createdBy}</div>
                                </div>
                                {/* <div className="col" style={{ float: "right" }}>
                                    <div className="">
                                        <small>Invoice / July period</small>
                                        <div className=""><b>August 3,2012</b></div>
                                        <div className="invoice-detail">
                                            #0000123DSS<br />
                                            Services Product
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-invoice" style={{ fontSize: '12px' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-center invoice-col left-border upper-border' style={{ width: 'max-content !important;' }}>رقم</th>
                                            <th className="text-center invoice-col upper-border" width="10%">وصف</th>
                                            <th className="text-center invoice-col upper-border" width="10%">نموذج رقم:</th>
                                            <th className="text-center invoice-col upper-border" width="10%">كمية</th>
                                            <th className="text-center invoice-col upper-border" width="10%">معدل</th>
                                            <th className="text-center invoice-col upper-border to-border" width="10%">Amount مقدار</th>
                                        </tr>
                                        <tr>
                                            <th className='text-center invoice-col left-border' style={{ width: 'max-content !important' }}>S.No.</th>
                                            <th className="text-center invoice-col" width="55%">DESCRIPTION</th>
                                            <th className="text-center invoice-col" width="10%">Model No.</th>
                                            <th className="text-center invoice-col" width="10%">Qty.</th>
                                            <th className="text-center invoice-col" width="10%">Rate</th>
                                            <th className="text-center invoice-col right-border" width="10%">Dhs.</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            activeOrderDetails?.map((ele, index) => {
                                                return <tr key={ele.id}>
                                                    <td className="text-center border border-secondary" style={{ width: 'max-content !important' }}>{index + 1}.</td>
                                                    <td className="text-center border border-secondary" width="55%">{ele.orderNo}</td>
                                                    <td className="text-center border border-secondary" width="10%">{`${ele.designCategory} - ${ele.designModel}`}</td>
                                                    <td className="text-center border border-secondary" width="10%">1.00</td>
                                                    <td className="text-center border border-secondary" width="10%">{parseFloat(ele?.subTotalAmount).toFixed(2)}</td>
                                                    <td className="text-center border border-secondary" width="10%">{ele?.subTotalAmount?.toFixed(2)}</td>
                                                </tr>
                                            })
                                        }
                                        <tr>
                                            <td colSpan={4} className="left-border no-border"></td>
                                            <td className="text-center border border-secondary" width="10%">Sub Total</td>
                                            <td className="text-center border border-secondary" width="10%">{(props.props?.subTotalAmount - cancelledOrDeletedSubTotal).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4} rowSpan={3} className="left-border no-border text-wrap">Total Dhs. ___<strong>{common.inWords(props.props.balanceAmount)}</strong> ______________________________</td>
                                            <td className="text-center border border-secondary" width="10%">VAT {props.props.vat}%</td>
                                            <td className="text-center border border-secondary" width="10%">{(props.props.vatAmount - cancelledOrDeletedVatTotal)?.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-center border border-secondary" width="10%">G. Total</td>
                                            <td className="text-center border border-secondary" width="10%">{(props.props.totalAmount - cancelledOrDeletedTotal)?.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-center border border-secondary" width="10%">Advance</td>
                                            <td className="text-center border border-secondary" width="10%">{(props.props.advanceAmount).toFixed(2)}</td>
                                        </tr>
                                        {advanceVat > 0 &&
                                            <tr>
                                                <td colSpan={4} className="left-border no-border"></td>
                                                <td className="text-center border border-secondary" width="10%">Advance VAT</td>
                                                <td className="text-center border border-secondary" width="10%">{advanceVat.toFixed(2)}</td>
                                            </tr>
                                        }
                                        <tr>
                                                <td colSpan={2} className="left-border no-border"></td>
                                                <td colSpan={2} className="text-center all-border">Payment Mode</td>
                                                <td className="text-center border border-secondary" width="10%">Balance VAT</td>
                                                <td className="text-center border border-secondary" width="10%">{balanceVat.toFixed(2)}</td>
                                            </tr>
                                        <tr>
                                            <td colSpan={2} className="left-border bottom-border">This invoice printed on : {common.getHtmlDate(new Date())}</td>
                                            <td colSpan={2} className='text-center bottom-border border border-secondary'>{props.props.paymentMode}</td>
                                            <td className="text-center border border-secondary" width="10%">Balance</td>
                                            <td className="text-center border border-secondary" width="10%">{props.props.balanceAmount?.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3}>Receiver's Sign----------------------------------علامة المتلقي</td>
                                            <td></td>
                                            <td colSpan={2}>Signature-----------------------------التوقيع</td>
                                        </tr>
                                        {/* <tr className='text-center text-muted'></tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                       <ReceiptFooter/>
                    </div>
                </div>
            </div>
        </>
    )
})
