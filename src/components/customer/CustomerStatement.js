import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import TableView from '../tables/TableView';

export default function CustomerStatement({ contactNo }) {
    const tableOptionTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo",action:{hAlign:'center',dAlign:'center',footerText:"Total"}},
            { name: "Order Amount", prop: "totalAmount",action:{decimal:true,footerSum:true,hAlign:'center',dAlign:'center'} },
            { name: "Advance", prop: "advanceAmount",action:{decimal:true,footerSum:true,hAlign:'center',dAlign:'center'} },
            { name: "Paid Amount", prop: "paidAmount",action:{decimal:true,footerSum:true,hAlign:'center',dAlign:'center'} },
            { name: "Balance Amount", prop: "balanceAmount",action:{decimal:true,footerSum:true,hAlign:'center',dAlign:'center'} }
        ],
        data: [],
        totalRecords: 0,
        shoPagination: false,
        showAction: false,
        showTableTop: false,
        maxHeight:'150px'
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    useEffect(() => {
        debugger;
        if (contactNo === undefined || contactNo.lenght < 7)
            return;
        Api.Get(apiUrls.customerController.getStatement + contactNo.replace('+', '%2B'))
            .then(res => {
                tableOptionTemplet.data = res.data;
                tableOptionTemplet.totalRecords = res.data.length;
                setTableOption({ ...tableOptionTemplet });
            })
            .catch(err => {

            })
    }, [contactNo]);

    return (
        <>
           <div className='row border'>
            <div className='col-12'>
            </div>
            <div className='col-12'>
            <TableView option={tableOption} />
            </div>
           </div>
        </>
    )
}
