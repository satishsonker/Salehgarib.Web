import React from 'react'
import TableView from '../tables/TableView'
import { headerFormat } from '../../utils/tableHeaderFormat'

export default function BillingTaxTableNew({
    billingData = [],
    showPrintOption = true,
    showBalanceVat = true,
    forReport = false,
    showBalanceAmount = true,
}) {

    const tableOption = {
        headers: headerFormat.billingTaxReport,
        data: billingData,
        totalRecords: billingData?.length ?? 0,
        searchHandler: () => { },
        showAction: false,
        showPagination: false,
        showSerialNo: true
    }

    return (
        <TableView option={tableOption}></TableView>
    )
}

