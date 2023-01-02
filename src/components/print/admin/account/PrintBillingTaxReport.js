import React from 'react'
import BillingTaxTable from '../../../account/BillingTaxTable'
import InvoiceHead from '../../../common/InvoiceHead'

export const PrintBillingTaxReport = React.forwardRef((props, ref) => {

    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Billing Tax Report'></InvoiceHead>
            <div className='card'>
                <div className='card-body'>
                    <div className='text-end'>Report from {props.props.filter.fromDate} To {props.props.filter.toDate}</div>
                    <BillingTaxTable billingData={props.props?.data}/>
                </div>
            </div>
        </div>
    )
})
