import React, { useRef } from 'react'
import { common } from '../../utils/common'
import ButtonBox from '../common/ButtonBox'
import Label from '../common/Label'
import ReactToPrint from 'react-to-print';

export default function PrintWorkDescription({ pageIndex, orderIndex, setPageIndex, orderData, workTypeList, workDescriptionList, isWDSelected, printModel }) {
    var printRef = useRef();
    return (
        <>
            <div className='row'>
                <div className='d-flex justify-content-between'>
                    <ButtonBox type="back" onClickHandler={() => { setPageIndex(0) }} className="btn-sm" />
                    <ReactToPrint
                        trigger={() => {
                            return <button className='btn btn-sm btn-warning' data-bs-dismiss="modal"><i className='bi bi-printer'></i> Print Work Type</button>
                        }}
                        content={(el) => (printRef.current)}
                    />
                </div>
                <div className='card' ref={printRef}>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-12 text-center fw-bold fs-6 mb-4'>{process.env.REACT_APP_COMPANY_NAME}</div>
                            <hr />
                            <table className='table table-bordered'>
                                <tbody>
                                    <tr>
                                        <td>Order No.: - {orderData?.orderNo}</td>
                                        <td>Kandoora No.: - {orderData?.orderNo + "-" + orderIndex}</td>
                                        <td>{orderData?.orderDetails[orderIndex - 1]?.measurementCustomerName === "" ? "Name: - " + orderData?.customerName : "Name: - " + orderData?.orderDetails[orderIndex - 1]?.measurementCustomerName}</td>
                                        <td>Price: - {common.printDecimal(orderData?.orderDetails[orderIndex - 1]?.price)}</td>
                                        <td>Date: - {common.getHtmlDate(new Date(), "ddmmyyyy")}</td>
                                    </tr>
                                    <tr>
                                        <td>Same Print: {printModel?.samePrint}</td>
                                        <td>New Model: {printModel?.newModel}</td>
                                        <td>Model Like: {printModel?.likeModel}</td>
                                        <td>Model No: {orderData?.orderDetails[orderIndex - 1]?.designModel}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr />
                            <div className='col-12'>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-start',
                                    alignItems: 'center',
                                }}>
                                    {workTypeList?.map((ele, index) => {
                                        return <>
                                            {workDescriptionList.find(x => x.code === ele.code) !== undefined && <>
                                                <div className='fs-6 fw-bold mt-6 text-uppercase' style={{ width: '100%', minHeight: '100px', borderBottom: '1px solid', marginBottom: '3px' }}>{ele.value}
                                                   <div style={{display:'flex'}}> {workDescriptionList.filter(x => x.code === ele.code).map(wd => {
                                                        if (isWDSelected(wd.id))
                                                            return <div style={{ fontSize: '11px', margin: '3px' }} className="work-description-badge">
                                                                {wd.value}</div>
                                                        else
                                                            return <></>
                                                    })}
                                                    </div>
                                                </div>
                                            </>}
                                        </>
                                    })}
                                    <div className='fs-6 fw-bold mt-6 text-uppercase' style={{ width: '100%', height: '200px', borderBottom: '1px solid', marginBottom: '3px' }}>Note
                                        <p>{orderData?.orderDetails[orderIndex - 1]?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
