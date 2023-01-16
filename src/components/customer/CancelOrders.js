import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'

export default function CancelOrders() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Post(apiUrls.orderController.searchCancelledOrders + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {
            var orders = res.data.data
            orders.forEach(element => {
                if (element.orderDetails.filter(x => x.isCancelled).length === element.orderDetails.length)
                    element.status = "Cancelled"
            });
            tableOptionTemplet.data = orders;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            resetOrderDetailsTable();

        }).catch(err => {

        });
    }
    const resetOrderDetailsTable = () => {
        tableOptionOrderDetailsTemplet.data = [];
        tableOptionOrderDetailsTemplet.totalRecords = 0;
        setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
    }
    const handleView = (orderId) => {

        setViewOrderDetailId(orderId);
    }
    const tableOptionTemplet = {
        headers: headerFormat.order,
        showTableTop: true,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        changeRowClassHandler: (data) => {
            if (data.id === viewOrderDetailId)
                return "cancelOrder"
        },
        actions: {
            showEdit: false,
            showDelete: false,
            view: {
                handler: handleView
            }
        }
    }

    const tableOptionOrderDetailsTemplet = {
        headers: headerFormat.orderDetails,
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        showAction: false
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    const breadcrumbOption = {
        title: 'Cancel Orders',
        items: [
            {
                link: "/customers",
                title: "Customers",
                icon: "bi bi-person-bounding-box"
            },
            {
                isActive: false,
                title: "Cancel Orders",
                icon: "bi bi-x-octagon-fill"
            }
        ]
    }

    //Initial data loading 
    useEffect(() => {
        Api.Get(apiUrls.orderController.getCancelledOrder + `?pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                var orders = res.data.data
                orders.forEach(element => {
                    if (element.orderDetails.filter(x => x.isCancelled).length === element.orderDetails.length)
                        element.status = "Cancelled"
                    else if (element.orderDetails.filter(x => x.isCancelled).length > 0)
                        element.status = "Partial Cancelled"
                    let vatAmount = ((element.totalAmount / (100 + element.vat)) * element.vat);
                    element.subTotal = element.totalAmount - vatAmount;
                    element.vatAmount = vatAmount;

                });

                tableOptionTemplet.data = orders;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
                resetOrderDetailsTable();
            })
    }, [pageNo, pageSize]);

    useEffect(() => {
        let orders = tableOption.data.find(x => x.id === viewOrderDetailId);
        if (orders) {
            orders.orderDetails.forEach(element => {
                if (element.isCancelled)
                    element.status = "Cancelled"
                let vatAmount = element.totalAmount - element.subTotalAmount;
                element.vatAmount = vatAmount;
                element.vat = orders.vat;
            })

            tableOptionOrderDetailsTemplet.data = orders.orderDetails;
            tableOptionOrderDetailsTemplet.totalRecords = orders.orderDetails.length;
            setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
        }

    }, [viewOrderDetailId])

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Cancelled Orders Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>
            {
                tableOptionOrderDetails.data.length > 0 &&
                <TableView option={tableOptionOrderDetails}></TableView>
            }
        </>
    )
}
