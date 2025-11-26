import { useState } from 'react'
import TableView from '../tables/TableView'
import { headerFormat } from '../../utils/tableHeaderFormat'
import PrintTaxInvoiceReceipt from '../print/orders/PrintTaxInvoiceReceipt';
export default function BillingTaxTableNew({
    billingData = [],
    forReport = false,
}) {

    const [selectedOrderId, setSelectedOrderId] = useState(0);
    const tableOption = {
        headers: headerFormat.billingTaxReport,
        data: billingData,
        totalRecords: billingData?.length ?? 0,
        searchHandler: () => { },
        showFooter: !forReport,
        showAction: !forReport,
        actions: {
            showView: false,
            showEdit: false,
            showDelete: false,
            showPrint: true,
            print: {
                    icon: 'bi-printer',
                    toolTip: 'Print Tax Invoice Receipt',
                    handler: (id,data) => {
                        setSelectedOrderId(data.orderId);
                    }
                }
        }
        ,
        showPagination: false,
        showSerialNo: true,
        showTableTop: !forReport,
        plainTable: forReport,
    }

    return (
        <>
            <TableView option={tableOption}></TableView>
            <PrintTaxInvoiceReceipt orderId={selectedOrderId} />
        </>
    )
}

