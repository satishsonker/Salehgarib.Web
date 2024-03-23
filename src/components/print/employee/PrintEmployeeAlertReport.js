import React from 'react'
import InvoiceHead from '../../common/InvoiceHead'
import Label from '../../common/Label'
import { common } from '../../../utils/common'
import TableView from '../../tables/TableView'

export default function PrintEmployeeAlertReport({ printRef, tableOption,company,JobTitle,EmpStatus }) {
    return (
        <div ref={printRef}>
            <div className='card-body'>
                <InvoiceHead receiptType="Employee Alert Report" />
                <div className='d-flex justify-content-center'>
                    <Label text={`Print On : ${common.getHtmlDate(new Date(), 'ddmmyyyyhhmmss')}`} />
                </div>
                <div className='d-flex justify-content-between'>
                    <Label text={`Company : ${company}`} />
                    <Label text={`Job Title : ${JobTitle}`} />
                    <Label text={`Employee Status : ${EmpStatus}`} />
                </div>
                <hr />
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            {tableOption.headers?.map((ele, ind) => {
                                if(ele?.name==="Job Name" || ele?.name==="Company" || ele?.name==="Status")
                                return ""
                            else
                                return <th key={ind} className='text-center'>{ele?.name}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {tableOption.data?.map((ele, ind) => {
                            return <tr key={ind} className='text-center'>
                                {tableOption.headers?.map((eleHead, indHead) => {
                                      if(eleHead?.name==="Job Name" || eleHead?.name==="Company" || eleHead?.name==="Status")
                                      return ""
                                  else
                                    return <td key={indHead} className='text-center'>{eleHead?.name?.toLowerCase()?.indexOf('expiry')>-1 || eleHead?.name?.toLowerCase()?.indexOf('data')>-1?common.getHtmlDate(ele[eleHead.prop]): ele[eleHead.prop]}</td>
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
