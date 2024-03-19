import React from 'react'
import InvoiceHead from '../../common/InvoiceHead'
import Label from '../../common/Label';
import { common } from '../../../utils/common';
import ReceiptFooter from '../ReceiptFooter';

export const PrintWorkTypeDetails = React.forwardRef((props, ref) => {
    var workType = props.props?.workType;
    var completeStatus=props.props?.completeStatus;
    var data = props.props?.data;
    var filter = props.props?.filter;
    return <>
        <div ref={ref} style={{ padding: '10px' }} className="row">
            <div className="col col-lg-12 mx-auto">
                <div className="card border shadow-none"></div>
                <InvoiceHead hideTrnNo={true} receiptType={`${workType} Detail`}></InvoiceHead>
                <div className="card-header py-2 bg-light">
                    <div className="row row-cols-12 row-cols-lg-12">

                        <div className="col-4 text-center">
                            <Label fontSize='13px' bold={true} text={"Print On : " + common.getHtmlDate(new Date(), "ddmmyyyyhhmmss")}></Label>
                        </div>
                        <div className="col-4 text-center">
                            <Label fontSize='13px' bold={true} text={"Total Count : " + data?.length}></Label>
                        </div>
                        <div className="col-4 text-center">
                            <Label fontSize='13px' bold={true} text={`Report For : ${workType} - ${completeStatus}` }></Label>
                        </div>
                        <div className="col-12 text-center">
                            <Label fontSize='13px' bold={true} text={`Report Range : ${filter.fromDate} - ${filter.toDate}` }></Label>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="card-body">
                        <div className="table">
                            <table className="table table-invoice">
                                <thead>
                                    <tr>
                                        <th className="text-center">Sr. No.</th>
                                        <th className="text-center">Order No.</th>
                                        <th className="text-center">Completed</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-center">Salesman</th>
                                        <th className="text-center">Delivery Date</th>
                                        <th className="text-center">Work Type</th>
                                        <th className="text-center">M. Status</th>
                                        <th className="text-center">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.map((ele, index) => {
                                            return <>
                                                <tr>
                                                    <td className="text-start">{(index + 1)}</td>
                                                    <td className="text-center">{ele?.orderNo}</td>
                                                    <td className="text-center">{ele?.workTypesCompletedStatus[0].completed ? "Yes" : "No"}</td>
                                                    <td className="text-center">{ele?.orderQty}</td>
                                                    <td className="text-center">{ele?.salesman}</td>
                                                    <td className="text-center">{common.getHtmlDate(ele?.orderDeliveryDate, 'ddmmyyyy')}</td>
                                                    <td className="text-center">{ele?.workType}</td>
                                                    <td className="text-center">{ele?.measurementStatus}</td>
                                                    <td className="text-center">{common.getGrade(ele?.price)}</td>
                                                </tr>
                                            </>
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
})
