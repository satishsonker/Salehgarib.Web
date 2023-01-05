import React, { useRef } from 'react'
import { common } from '../../utils/common'
import ButtonBox from '../common/ButtonBox'
import Label from '../common/Label'
import ReactToPrint from 'react-to-print';

export default function PrintWorkDescription({ pageIndex, orderIndex, setPageIndex, orderData, workTypeList, workDescriptionList, isWDSelected }) {
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
                            <div className='col-12 d-flex justify-content-between mb-4'>
                                <Label text={"Order No.: - " + orderData?.orderNo} />
                                <Label text={"Kandoora No.: - " + orderData?.orderNo + "-" + orderIndex} />
                                <Label text={"Name: - " + orderData?.customerName} />
                                <Label text={"Price: - " + common.printDecimal(orderData?.orderDetails[pageIndex - 1]?.price)} />
                                <Label text={"Date: - " + common.getHtmlDate(new Date(), "ddmmyyyy")} />
                            </div>
                            <hr/>
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
                                                <div className='fs-6 fw-bold mt-6 text-uppercase' style={{ width: '100%', borderBottom: '1px solid', marginBottom: '3px' }}>{ele.value}</div>
                                                {workDescriptionList.filter(x => x.code === ele.code).map(wd => {
                                                    return <div style={{fontSize:'11px',margin:'3px'}} className={isWDSelected(wd.id) ? 'work-description-badge bg-info': "work-description-badge"}>
                                                        {isWDSelected(wd.id) ? <i className="bi bi-check-square-fill"></i> : ""}{wd.value}</div>
                                                })}
                                            </>}
                                        </>
                                    })}
                                    <div className='fs-6 fw-bold mt-6 text-uppercase' style={{ width: '100%', height: '200px', borderBottom: '1px solid', marginBottom: '3px' }}>Note</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
