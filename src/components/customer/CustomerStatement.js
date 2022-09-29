import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import TableView from '../tables/TableView';

export default function CustomerStatement({ contactNo }) {
    const [statementSum, setStatementSum] = useState({
        orderAmount: 0,
        paidAmount: 0,
        balanceAmount: 0
    });
    const tableOptionTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo" },
            { name: "Order Amount", prop: "totalAmount" },
            { name: "Advance", prop: "advanceAmount" },
            { name: "Paid Amount", prop: "paidAmount" },
            { name: "Balance Amount", prop: "balanceAmount" }
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
        if (contactNo === undefined || contactNo.lenght < 7)
            return;
        Api.Get(apiUrls.customerController.getStatement + contactNo.replace('+', '%2B'))
            .then(res => {
                tableOptionTemplet.data = res.data;
                tableOptionTemplet.totalRecords = res.data.length;
                setTableOption({ ...tableOptionTemplet });
                let obj = {
                    orderAmount: 0,
                    paidAmount: 0,
                    balanceAmount: 0
                }
                res.data.forEach(element => {
                    debugger
                    obj.balanceAmount += isNaN(parseFloat(element.balanceAmount)) ? 0 : parseFloat(element.balanceAmount);;
                    obj.paidAmount += isNaN(parseFloat(element.paidAmount)) ? 0 : parseFloat(element.paidAmount);;
                    obj.orderAmount += isNaN(parseFloat(element.totalAmount)) ? 0 : parseFloat(element.totalAmount);
                });
                setStatementSum(obj);
            })
            .catch(err => {

            })
    }, [contactNo]);

    return (
        <>
           <div className='row border'>
            <div className='col-12'>
            <div className="d-flex justify-content-between border border-danger">
                <div className="p-2">Total Order Amount : {statementSum.orderAmount.toFixed(2)}</div>
                <div className="p-2">Total Paid Amount : {statementSum.paidAmount.toFixed(2)}</div>
                <div className="p-2">Total Balance Amount : {statementSum.balanceAmount.toFixed(2)}</div>
            </div>
            </div>
            <div className='col-12'>
            <TableView option={tableOption} />
            </div>
           </div>
        </>
    )
}
