import React from 'react'
import { common } from '../../../utils/common';
import Barcode from 'react-barcode/lib/react-barcode';
import Label from '../../common/Label';

export const PrintOrderReceipt = React.forwardRef((props, ref) => {
    let mainData=common.cloneObject(props.props);
    if (props === undefined || props.props === undefined || props.props.orderNo === undefined)
        return <></>
    
    let cancelledOrDeletedSubTotal = 0;
    let cancelledOrDeletedVatTotal = 0;
    let cancelledOrDeletedTotal = 0;
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
                    <h6 className="mb-0 text-uppercase text-center">INVOICE BILL</h6>
                    <hr />
                    <div className="card border shadow-none">
                        <div className="card-header py-3">
                            <div className="row align-items-center g-3">
                                <div className="col-7">
                                    <h5 className="mb-0"><img src="assets/images/logo.png" className="logo-icon" alt="logo icon" /> Saleh Garib  Tailoring Shop
                                    </h5>
                                </div>
                                <div className="col-5">
                                    <Barcode value={props.props.orderNo} width={3} height={30}></Barcode>
                                </div>
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
                                <table className="table table-invoice">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th className="text-center">KANDOORA NO.</th>
                                            <th className="text-center" width="10%">DESCRIPTION</th>
                                            <th className="text-center" width="10%">SUB TOTAL</th>
                                            <th className="text-center" width="20%">VAT @ {props.props.vat}%</th>
                                            <th className="text-center" width="20%">TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            activeOrderDetails?.map((ele, index) => {
                                                return <tr key={ele.id}>
                                                    <td className="text-center">{index + 1}.</td>
                                                    <td className="text-center">{ele.orderNo}</td>
                                                    <td className="text-center">{ele.designCategory} - {ele.designModel}</td>
                                                    <td className="text-center">{parseFloat(ele?.subTotalAmount).toFixed(2)}</td>
                                                    <td className="text-center">{(ele?.totalAmount - ele.subTotalAmount)?.toFixed(2)}</td>
                                                    <td className="text-center">{ele?.totalAmount?.toFixed(2)}</td>
                                                </tr>
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>

                            <div className="row bg-light align-items-center m-0">
                                <div className="col col-auto p-3">
                                    <p className="mb-0">SUBTOTAL</p>
                                    <h4 className="mb-0">{(props.props?.subTotalAmount - cancelledOrDeletedSubTotal).toFixed(2)}</h4>
                                </div>
                                <div className="col col-auto p-3">
                                    <i className="bi bi-plus-circle text-muted"></i>
                                </div>
                                <div className="col col-auto me-auto p-3">
                                    <p className="mb-0">VAT ({props.props.vat}%)</p>
                                    <h4 className="mb-0">{(props.props.vatAmount - cancelledOrDeletedVatTotal)?.toFixed(2)}</h4>
                                </div>
                                <div className="col col-auto p-3">
                                    <i className="bi bi-dash-circle text-muted"></i>
                                </div>
                                <div className="col col-auto me-auto p-3">
                                    <p className="mb-0">Advance</p>
                                    <h4 className="mb-0">{props.props.advanceAmount?.toFixed(2)}</h4>
                                </div>
                                <div className="col bg-dark col-auto p-3">
                                    <p className="mb-0 text-white">TOTAL</p>
                                    <h4 className="mb-0 text-white">{(props.props.balanceAmount - cancelledOrDeletedTotal)?.toFixed(2)}</h4>
                                </div>
                                <div style={{ width: '100%' }} className='mb-0 text-center text-muted'>This invoice printed on : {common.getHtmlDate(new Date())}</div>
                            </div>
                            <hr className='mt-0' />
                            <div className="my-3">
                                * Make all cheques payable to [Your Company Name]<br />
                                * Payment is due within 30 days<br />
                                * If you have any questions concerning this invoice, contact  [Name, Phone Number, Email]
                            </div>
                        </div>
                        <div className="card-footer py-3">
                            <p className="text-center mb-2">
                                THANK YOU FOR YOUR BUSINESS
                            </p>
                            <p className="text-center d-flex align-items-center gap-3 justify-content-center mb-0">
                                <span className=""><i className="bi bi-globe"></i> www.domain.com</span>
                                <span className=""><i className="bi bi-telephone-fill"></i> T:+11-0462879</span>
                                <span className=""><i className="bi bi-envelope-fill"></i> info@example.com</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})
