import React from 'react'
import { common } from '../../utils/common'

export default function EMIDetailPopup({data}) {
    if(data===undefined || data===null)
    return <></>

    return (
        <>
            <div className="modal fade" id="emi-details-popup-model" tabIndex="-1" aria-labelledby="emi-details-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="emi-details-popup-model-label">EMI Breakups</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>Deducted From Salary On</th>
                                        <th>Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            data?.map((ele, index) => {
                                                return <tr key={index}>
                                                    <td>{ele.amount}</td>
                                                    <td style={{ textAlign: "center" }}>{common.monthList[ele.deductionMonth-1]}, {ele.deductionYear}</td>
                                                    <td>{ele.remark}</td>
                                                </tr>
                                            })
                                        }
                                    </>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
