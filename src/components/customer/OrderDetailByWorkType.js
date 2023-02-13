import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'
import { useSearchParams } from 'react-router-dom';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { headerFormat } from '../../utils/tableHeaderFormat';
import { common } from '../../utils/common';
import Dropdown from '../common/Dropdown';

export default function OrderDetailByWorkType() {
    const [searchParams, setSearchParams] = useSearchParams();
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [orderStatusList, setOrderStatusList] = useState([]);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState("Active");
    const REQUESTED_WORKTYPE = searchParams.get("workType");
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.searchByWorkType + `${REQUESTED_WORKTYPE}&PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }
    const tableOptionTemplet = {
        headers: headerFormat.orderWorkType,
        showTableTop: true,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        searchBoxWidth: '74%',
        showAction: false
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    useEffect(() => {
        Api.Get(apiUrls.orderController.getByWorkType + `${REQUESTED_WORKTYPE}&pageNo=${pageNo}&pageSize=${pageSize}&orderStatus=${selectedOrderStatus}`)
            .then(res => {
                var orders = res.data.data
                orders.forEach(element => {
                    var vatObj = common.calculateVAT(element.subTotalAmount, VAT);
                    element.vatAmount = vatObj.vatAmount
                    element.subTotalAmount = parseFloat(element.totalAmount - vatObj.vatAmount);
                    element.balanceAmount = parseFloat(element.balanceAmount);
                    element.totalAmount = parseFloat(element.totalAmount);
                    element.advanceAmount = parseFloat(element.advanceAmount);
                    element.vat = VAT;
                });
                tableOptionTemplet.data = orders;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            })
    }, [pageNo, pageSize, selectedOrderStatus,REQUESTED_WORKTYPE]);
    const changeHandler = (e) => {
        setSelectedOrderStatus(e.target.value);
    }
    useEffect(() => {
        Api.Get(apiUrls.orderController.getOrderStatusList)
            .then(res => {
                setOrderStatusList(res.data);
            })
    }, []);


    const breadcrumbOption = {
        title: "Orders",
        items: [
            {
                title: common.workType[REQUESTED_WORKTYPE] + " Details",
                icon: "bi bi-person-badge-fill",
                isActive: false,
            }
        ]
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between">
                <h6 className="mb-0 text-uppercase">{common.workType[REQUESTED_WORKTYPE]} Orders</h6>
                <div className=''>
                <Dropdown title="Order Status Filter" data={common.dropdownArray(orderStatusList)} value={selectedOrderStatus} onChange={changeHandler} className="form-control-sm"></Dropdown>
                </div>
            </div>

            <hr />
            <TableView option={tableOption}></TableView>
        </>
    )
}
