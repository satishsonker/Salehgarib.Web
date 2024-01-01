import React from 'react'
import { common } from '../../../../utils/common';
import InvoiceHead from '../../../common/InvoiceHead';

export const PrintEmployeeSalarySlip = React.forwardRef((props, ref) => {
  if (props == undefined || props.props === undefined)
    return;
  let empSalaryData = props.props.data;

  return (
    <div ref={ref} className="p-3">
      <InvoiceHead receiptType='Employee Salary Slip'></InvoiceHead>
      <div className='card'>
        <div className='card-body'>
          <div className='row border p-2 border-dark'>
            <div className='col-4'>Employee : {empSalaryData[0]?.employeeName}</div>
            <div className='col-4 text-center'>Emp Id : {empSalaryData[0]?.employeeId}</div>
            <div className='col-4 text-end'>Salary Slip Date : {common.getHtmlDate(new Date(),'ddmmyyyy')}</div>
          </div>
          <hr />
          <table className='table table-bordered table-stripe' style={{ fontSize: 'var(--app-font-size)' }}>
            <thead>
              <tr>
                <th className='text-center'>Sr.</th>
                <th className='text-center'>Voucher No.</th>
                <th className='text-center'>Date</th>
                <th className='text-center'>Order No.</th>
                <th className='text-center'>Price+Grade</th>
                <th className='text-center'>Qty</th>
                <th className='text-center'>Note</th>
                <th className='text-end'>Amount</th>
                <th className='text-end'>Extra</th>
              </tr>
            </thead>
            <tbody>
              {empSalaryData?.map((res, index) => {
                return <tr key={index}>
                  <td className='text-center'>{index + 1}</td>
                  <td className='text-center'>{res.voucherNo}</td>
                  <td className='text-center'>{common.getHtmlDate(res.date,'ddmmyyyy')}</td>
                  <td className='text-center'>{res.kandooraNo}</td>
                  <td className='text-center'>{res.orderPrice + ' - ' + common.getGrade(res.orderPrice)}</td>
                  <td className='text-center'>{res.qty}</td>
                  <td className='text-center'>{res.note}</td>
                  <td className='text-end'>{common.printDecimal(res.amount)}</td>
                  <td className='text-end'>{common.printDecimal(res.extra)}</td>
                </tr>
              })}
            </tbody>
          </table>
          <hr />
          <div className='row border border-dark p-2'>
            <div className='col-8'>
              <div className='row'>
                <div className='col-4'>Employee</div>
                <div className='col-8'> {empSalaryData[0]?.employeeName}</div>
                <div className='col-4'>Emp Id</div>
                <div className='col-8'> {empSalaryData[0]?.employeeId}</div>
                <div className='col-4'>Salary Date</div>
                <div className='col-8'> {common.getFirstDateOfMonth(props.props?.filter?.month - 1, props.props?.filter?.year)} to {common.getLastDateOfMonth(props.props?.filter?.month, props.props?.filter?.year)}</div>
                <div className='col-4'>.</div>
                <div className='col-8'>.</div>
                <div className='col-4'>Receiving Sign</div>
                <div className='col-8'>.........................................................................</div>
                <div className='col-12'>.</div>
              </div>
            </div>
            <div className='col-4'>
              <div className='row'>
                <div className='col-6 fw-bold'>Total Qty</div>
                <div className='col-6 fw-bold text-end'> Total Amount</div>
                <div className='col-6 fw-bold text-center'>{empSalaryData.reduce((sum, ele) => {
                  return sum += ele.qty ?? 0;
                }, 0)}</div>
                <div className='col-6 fw-bold text-end'>{common.printDecimal(empSalaryData.reduce((sum, ele) => {
                  return sum += ele.amount ?? 0;
                }, 0))}</div>
                 <div className='col-6 fw-bold'>Total Extra</div>
                <div className='col-6 fw-bold text-end'>{common.printDecimal(empSalaryData.reduce((sum, ele) => {
                  return sum += ele.extra ?? 0;
                }, 0))}</div>
                <div className='col-6 fw-bold'>Total Adv. (-)</div>
                <div className='col-6 fw-bold text-end'> {empSalaryData[0]?.emiAmount}</div>
                <div className='col-6 fw-bold'>Net Total</div>
                <div className='col-6 fw-bold text-end'>{common.printDecimal((empSalaryData.reduce((sum, ele) => {
                  return sum += ele.amount+ele.extra;
                }, 0)-empSalaryData[0]?.emiAmount))}</div>
                 <div className='col-12'>.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
