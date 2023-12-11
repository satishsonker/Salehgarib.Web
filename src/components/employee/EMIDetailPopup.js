import React from 'react'
import { common } from '../../utils/common'
import ButtonBox from '../common/ButtonBox'

export default function EMIDetailPopup({ data }) {
    if (data === undefined || data === null)
        return <></>

    return (
        <>
            <div className="modal fade" id="emi-details-popup-model" tabIndex="-1" aria-labelledby="emi-details-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="emi-details-popup-model-label">EMI Breakups</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th className='text-center'>#</th>
                                        <th className='text-center'>Amount</th>
                                        <th className='text-center'>Deducted On</th>
                                        <th className='text-center'>Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            data?.map((ele, index) => {
                                                return <tr key={index}>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td className='text-center'>{common.printDecimal(ele.amount)}</td>
                                                    <td className='text-center'>{common.monthList[ele.deductionMonth - 1]}, {ele.deductionYear}</td>
                                                    <td className='text-center'>{ele.remark}</td>
                                                </tr>
                                            })
                                        }
                                    </>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                        <ButtonBox text="Close" type="cancel" className="btn-sm" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
