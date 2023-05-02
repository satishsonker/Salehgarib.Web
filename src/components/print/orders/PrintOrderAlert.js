import React from 'react'
import { common } from '../../../utils/common';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import InvoiceHead from '../../common/InvoiceHead';

export const PrintOrderAlert = React.forwardRef((props, ref) => {
    let data = props.props;
    if (data?.length === 0)
        return;
    const headers = headerFormat.printOrderAlert;

    const dataFormatter = (header, row) => {
        let colData = row[header?.prop];
        if (header?.prop.toLocaleLowerCase().indexOf('date') > -1)
            return common.getHtmlDate(colData, "ddmmyyyy");
        else if(colData?.toString().toLocaleLowerCase()==='completed')
        {
            return <span style={{fontSize:'10px'}}><i class="bi bi-check-lg"></i></span>
        }
        else if(colData?.toString().toLocaleLowerCase()==='not started')
        {
            return <span style={{fontSize:'10px'}}><i class="bi bi-x-lg"></i></span>
        }
        else
            return colData;
    }
    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Order Alert Report' hideTrnNo={true}></InvoiceHead>
            <div className='my-2 text-end text-small fw-bold'><i class="bi bi-check-lg"> = Completed, </i><i class="bi bi-x-lg"> = Not Started</i>,  Blank = No Work Type Assigned</div>
            <table className='table table-bordered' style={{fontSize:'10px'}}>
                <thead>
                    <tr>
                        {headers?.map((ele, index) => {
                            return <th key={index} className='text-center'>{ele?.name}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {
                        data?.map((res, index) => {
                            return <tr key={index}>
                                {headers?.map((hEle, hIndex) => {
                                    return <th key={hIndex} className='text-center'>{dataFormatter(hEle, res)}</th>
                                })}
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
)
