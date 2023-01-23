import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import TableView from '../tables/TableView';

export default function CustomerStatement({ contactNo }) {
    const tableOptionTemplet = {
        headers:headerFormat.customerStatement,
        data: [],
        totalRecords: 0,
        shoPagination: false,
        showAction: false,
        showTableTop: false,
        maxHeight:'150px'
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    useEffect(() => {
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
