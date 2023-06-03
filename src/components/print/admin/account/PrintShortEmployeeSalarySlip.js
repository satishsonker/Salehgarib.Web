import React from 'react'
import { common } from '../../../../utils/common';
import InvoiceHead from '../../../common/InvoiceHead';

export const PrintShortEmployeeSalarySlip = React.forwardRef((props, ref) => {
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
          <div className='row border border-dark p-2'>
            <div className='col-8'>
              <div className='row'>
                <div className='col-4'>Employee</div>
                <div className='col-8'> {empSalaryData[0]?.employeeName} ({empSalaryData[0]?.jobTitle})</div>
                <div className='col-4'>Emp Id</div>
                <div className='col-8'> {empSalaryData[0]?.employeeId}</div>
                <div className='col-4'>Contact No</div>
                <div className='col-8'>{empSalaryData[0]?.contactNo}</div>
                <div className='col-4'>Salary Date</div>
                <div className='col-8'> {common.getFirstDateOfMonth(props.props?.filter?.month - 1, props.props?.filter?.year)} to {common.getLastDateOfMonth(props.props?.filter?.month, props.props?.filter?.year)}</div>
                <div className='col-12'>.</div>
                <div className='col-4'>Employee Sign</div>
                <div className='col-8'>.........................................................................</div>
               <div className='col-4'>Director Sign</div>
                <div className='col-8'>.........................................................................</div>
                <div className='col-12'>.</div>
              </div>
            </div>
            <div className='col-4'>
              <div className='row'>
                <div className='col-6 fw-bold'>Total Qty</div>
                <div className='col-6 fw-bold text-end'> Total Amount</div>
                <div className='col-6 fw-bold text-center'>{common.printDecimal(empSalaryData?.reduce((sum, ele) => {
                  return sum += ele.qty ?? 0;
                }, 0))}</div>
                <div className='col-6 fw-bold text-end'>{common.printDecimal(empSalaryData?.reduce((sum, ele) => {
                  return sum += ele.amount ?? 0;
                }, 0))}</div>
                 <div className='col-6 fw-bold'>Total Extra</div>
                <div className='col-6 fw-bold text-end'>{common.printDecimal(empSalaryData?.reduce((sum, ele) => {
                  return sum += ele.extra ?? 0;
                }, 0))}</div>
                <div className='col-6 fw-bold'>Total Adv.</div>
                <div className='col-6 fw-bold text-end'> {0}</div>
                <div className='col-6 fw-bold'>Net Total</div>
                <div className='col-6 fw-bold text-end'>{common.printDecimal(empSalaryData?.reduce((sum, ele) => {
                  return sum += ele.amount+ele.extra;
                }, 0))}</div>
                 <div className='col-12'>.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
