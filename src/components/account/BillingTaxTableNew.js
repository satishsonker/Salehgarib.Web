import React from 'react'
import TableView from '../tables/TableView'
import { headerFormat } from '../../utils/tableHeaderFormat'

export default function BillingTaxTableNew({
    billingData = [],
    forReport = false,
}) {

    const tableOption = {
        headers: headerFormat.billingTaxReport,
        data: billingData,
        totalRecords: billingData?.length ?? 0,
        searchHandler: () => { },
        showAction: false,
        showPagination: false,
        showSerialNo: true,
        showTableTop: !forReport,
    }

    return (
        <TableView option={tableOption}></TableView>
    )
}

