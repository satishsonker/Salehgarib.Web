import React from 'react'
import InvoiceHead from '../../common/InvoiceHead';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import { common } from '../../../utils/common';
import FabricDailyStatusTable from '../CommonComponent/FabricDailyStatusTable';

export const PrintFabricDailyStatusReport = React.forwardRef((props, ref) => {
    if (props == undefined || props.props === undefined || props.props?.data === undefined)
        return;
    let statusData = props.props?.data;
    const getSum = props.props?.sum;
    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Fabric Daily Status Report'></InvoiceHead>
            <div className='card'>
                <div className='card-body'>
                    <div className='row my-2 fw-bold'>
                        <div className='col-6'>Fabric Status Report Date : {props.props?.date}</div>
                        <div className='col-6 text-end  fw-bold'>Printed On {new Date().toDateString()} {common.formatAMPM(new Date())}</div>
                    </div>
                    <FabricDailyStatusTable
                        data={statusData}
                        totals={getSum}
                        headers={headerFormat.printFabricDailyStatusReport}
                    />
                </div>
            </div>
        </div>
    )
})
