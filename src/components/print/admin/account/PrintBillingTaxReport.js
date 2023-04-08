import React from 'react'
import { common } from '../../../../utils/common'
import BillingTaxTable from '../../../account/BillingTaxTable'
import InvoiceHead from '../../../common/InvoiceHead'

export const PrintBillingTaxReport = React.forwardRef((props, ref) => {

    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Billing Tax Report'></InvoiceHead>
            <div className='text-end my-3'>Report from {common.getHtmlDate(new Date(props.props.filter.fromDate),"ddmmyyyy")} To {common.getHtmlDate(new Date(props.props.filter.toDate),"ddmmyyyy")}</div>
            <BillingTaxTable forReport={true} billingData={props.props?.data} showBalanceVat={false} showPrintOption={false} showBalanceAmount={false}/>
        </div>
    )
})
