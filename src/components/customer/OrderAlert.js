import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import TableView from '../tables/TableView';

export default function OrderAlert() {
    const [searchParams, setSearchParams] = useSearchParams();
    let queryData=searchParams.get('alertBeforeDays');
    queryData=queryData===null?10:parseInt(queryData);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [alertBeforeDays, setAlertBeforeDays] = useState(queryData);

    const processResponseData = (res) => {
        var data = res.data.data;
        data.forEach(element => {
            element.vat = 5;
            element.subTotalAmount = parseFloat(element.subTotalAmount).toFixed(2);
            element.price = parseFloat(element.price).toFixed(2);
            element.crystalPrice = parseFloat(element.crystalPrice).toFixed(2);
            element.vatAmount = parseFloat(element.totalAmount - element.subTotalAmount).toFixed(2);
            element.crystal = element.crystal ? element.crystal : '0.0';
            element.updatedAt = element.updatedAt === '0001-01-01T00:00:00' || !element.updatedAt ? '' : element.updatedAt

            if (element.isCancelled === true)
                element.status = "Cancelled";
            else if (element.isDeleted === true)
                element.status = "Deleted";
            else
                element.status = "Active";
            let delData = new Date(element.orderDeliveryDate);
            let currentData = new Date();
            var Difference_In_Time = delData.getTime() - currentData.getTime();
            element.remainingDays = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
        });
        tableOptionOrderDetailsTemplet.data = data;
        tableOptionOrderDetailsTemplet.totalRecords = res.data.totalRecords;
        setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.searchAlert + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}&daysBefore=${alertBeforeDays}`, {})
            .then(res => {
                processResponseData(res);
            }).catch(err => {

            });
    }
    const breadcrumbOption = {
        title: 'Order Alerts',
        items: [
            {
                link: "/customers",
                title: "Customers",
                icon: "bi bi-person-bounding-box"
            },
            {
                link: "/customer-orders",
                title: "Customer Orders",
                icon: "bi bi-cart3"
            },
            {
                isActive: false,
                title: "Order Alerts",
                icon: "bi bi-bell"
            }
        ]
    }

    const remainingDaysBadge = (row, header) => {
        var days = row[header.prop];
        if (days >= 9)
            return <span className="badge bg-info">{days} Days</span>
        if (days >= 6 && days < 9)
            return <span className="badge bg-success text-dark">{days} Days</span>
        if (days >= 2 && days < 6)
            return <span className="badge bg-warning text-dark">{days} Days</span>
        if (days >= 2 && days < 6)
            return <span className="badge bg-danger text-dark">{days} Days</span>
        if (days >= 0 && days < 1)
            return <span className="badge bg-dark">{days} Days</span>
        if (days < 0)
            return <span className="badge bg-secondary">{days} Days</span>
    }

    const tableOptionOrderDetailsTemplet = {
        headers: [ 
            { name: "Remaining Days", prop: "remainingDays", title: "Remaining Days for order delivery", customColumn: remainingDaysBadge },
            { name: "Status", prop: "status" },
            { name: "Order No", prop: "mainOrderNo" },
            { name: "Kandoora No", prop: "orderNo" },
            { name: "CustomerName", prop: "customerName" },
            { name: "Contact", prop: "contact" },
            { name: "Order Delivery Date", prop: "orderDeliveryDate" },
           { name: "Description", prop: "description" },
            { name: "Price", prop: "price" },
            { name: "VAT Amount", prop: "vatAmount" },
            { name: "Total Amount", prop: "totalAmount",action:{decimal:true} },
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        showAction:false
    }

    useEffect(() => {
        Api.Get(apiUrls.orderController.getOrderAlert + alertBeforeDays + `&pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                processResponseData(res);
            })
    }, [alertBeforeDays, pageNo, pageSize])

    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <label style={{ fontWeight: 'normal', width: '100%', textAlign: 'right', whiteSpace: 'nowrap', fontSize: '12px' }}>
                <span> Alert before  </span>
                <select className='form-control-sm' onChange={e => setAlertBeforeDays(e.target.value)} value={alertBeforeDays}>
                    {
                        common.numberRangerForDropDown(2, 15).map(ele => {
                            return <option key={ele.id} value={ele.id}>{ele.value}</option>
                        })
                    }
                </select>

                <span> Days </span></label>
            <hr />
            <TableView option={tableOptionOrderDetails}></TableView>
        </>
    )
}
