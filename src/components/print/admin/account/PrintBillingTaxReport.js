import React from 'react'
import { common } from '../../../../utils/common'
import InvoiceHead from '../../../common/InvoiceHead'
import BillingTaxTableNew from '../../../account/BillingTaxTableNew'

export const PrintBillingTaxReport = React.forwardRef((props, ref) => {

    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Billing Tax Report'></InvoiceHead>
            <div className='text-end my-3'>Report from {common.getHtmlDate(new Date(props.props.filter.fromDate),"ddmmyyyy")} To {common.getHtmlDate(new Date(props.props.filter.toDate),"ddmmyyyy")}</div>
            <BillingTaxTableNew forReport={true} billingData={props.props?.data} showBalanceVat={false} showPrintOption={false} showBalanceAmount={false}/>
        </div>
    )
})
