import React from 'react'
import CancelTaxTable from '../../../account/CancelTaxTable'
import InvoiceHead from '../../../common/InvoiceHead'

export const PrintCancelTaxReport= React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Cancelled Tax Report'></InvoiceHead>
            <div className='card'>
                <div className='card-body'>
                    <CancelTaxTable billingData={props.props}/>
                </div>
            </div>
        </div>
    )
})
