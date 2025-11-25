import React from 'react'
import { common } from '../../../../utils/common'
import InvoiceHead from '../../../common/InvoiceHead'
import BillingTaxTableNew from '../../../account/BillingTaxTableNew'
import SummaryTotals from '../../../common/SummaryTotals'

export const PrintBillingTaxReport = React.forwardRef((props, ref) => {
const VAT = parseFloat(process.env.REACT_APP_VAT);
    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Billing Tax Report'></InvoiceHead>
            <div className='text-end my-3'>Report from {common.getHtmlDate(new Date(props.props.filter.fromDate),"ddmmyyyy")} To {common.getHtmlDate(new Date(props.props.filter.toDate),"ddmmyyyy")}</div>
            <BillingTaxTableNew forReport={true} billingData={props.props?.data} showBalanceVat={false} showPrintOption={false} showBalanceAmount={false}/>
             <SummaryTotals data={props.props?.data} param={[
                         { prop: 'credit', displayText: 'Total Paid Amount', 
                            callback: (value) => {
                                return value-((value / (100 + VAT)) * VAT);
                            }
                        },                        
                        { prop: 'credit', displayText: 'Total VAT Amount', 
                            callback: (value) => {
                                return ((value / (100 + VAT)) * VAT);
                            }
                        },
                        { prop: 'credit', displayText: 'Total Gross Amount' }
                    ]} />
        </div>
    )
})
