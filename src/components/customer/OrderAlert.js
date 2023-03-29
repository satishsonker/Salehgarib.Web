import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import TableView from '../tables/TableView';
import Inputbox from '../common/Inputbox';
import Dropdown from '../common/Dropdown';
import ButtonBox from '../common/ButtonBox';
import { headerFormat } from '../../utils/tableHeaderFormat';
import KandooraStatusPopup from './KandooraStatusPopup';
export default function OrderAlert() {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const [searchParams, setSearchParams] = useSearchParams();
    let queryData = searchParams.get('alertBeforeDays');
    queryData = queryData === null ? 10 : parseInt(queryData);
    const [filter, setFilter] = useState({
        alertBeforeDays: queryData,
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth()),
        toDate: common.getHtmlDate(new Date()),
        salesmanId:0
    })
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [fetchData, setFetchData] = useState(0);
    const [viewOrderId, setViewOrderId] = useState(0);
    const [salesmanList, setSalesmanList] = useState([]);
    const kandooraStatusHandler = (id, data) => {
        data.id = data?.orderId;
        data.orderDetails = [{ status: data?.status, orderNo: data?.kandooraNo }];
        setViewOrderId(data);
    }
    const filterDataChangeHandler = (e) => {
        var { name, value } = e.target;
        if (name === 'alertBeforeDays') {
            value = parseInt(value);
        }
        setFilter({ ...filter, [name]: value });
    }
    const processResponseData = (res) => {
        var data = res.data.data;
        data.forEach(element => {
            if (element.isCancelled === true)
                element.status = "Cancelled";
            else if (element.isDeleted === true)
                element.status = "Deleted";
            let delData = new Date(element.deliveryDate);
            let currentData = new Date();
            var Difference_In_Time = delData.getTime() - currentData.getTime();
            element.remainingDays = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
            element.grade = `${common.getGrade(element.subTotalAmount)}/${element.subTotalAmount}`;
        });
        tableOptionOrderDetailsTemplet.data = data;
        tableOptionOrderDetailsTemplet.totalRecords = res.data.totalRecords;
        setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.searchAlert + `PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}&daysBefore=${filter.alertBeforeDays}&fromDate=${filter.fromDate}&toDate=${filter.toDate}`, {})
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

    const tableOptionOrderDetailsTemplet = {
        headers: headerFormat.alertOrder,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showEdit: false,
            showDelete: false,
            showView: false,
            buttons: [
                {
                    modelId: "kandoora-status-popup-model",
                    icon: "bi bi-bar-chart",
                    title: 'View Kandoora Status',
                    handler: kandooraStatusHandler,
                    showModel: true
                }
            ]
        }
    }

    useEffect(() => {
        Api.Get(apiUrls.orderController.getOrderAlert + filter.alertBeforeDays + `&pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${filter.fromDate}&toDate=${filter.toDate}&salesmanId=${filter.salesmanId}`)
            .then(res => {
                processResponseData(res);
            })
    }, [fetchData, pageNo, pageSize]);

    useEffect(() => {
        Api.Get(apiUrls.dropdownController.employee + `?searchTerm=salesman`)
            .then(res => {
                setSalesmanList(res.data);
            });
    }, [])


    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>

            <div className="d-flex justify-content-end">
            <div className='mx-2'>
                    <span> Salesman</span>
                    <Dropdown data={salesmanList} name="salesmanId" onChange={filterDataChangeHandler} value={filter.salesmanId} className="form-control-sm" />
                </div>
                <div className='mx-2'>
                    <span> From Date</span>
                    <Inputbox type="date" name="fromDate" value={filter.fromDate} max={filter.toDate} onChangeHandler={filterDataChangeHandler} className="form-control-sm" showLabel={false} />
                </div>
                <div className='mx-2'>
                    <span> To Date</span>
                    <Inputbox type="date" name="toDate" min={filter.fromDate} value={filter.toDate} onChangeHandler={filterDataChangeHandler} className="form-control-sm" showLabel={false} />
                </div>
                <div className='mx-2'>
                    <span> Alert before days</span>
                    <Dropdown data={common.numberRangerForDropDown(2, 15)} name="alertBeforeDays" onChange={filterDataChangeHandler} value={filter.alertBeforeDays} className="form-control-sm" />
                </div>
                <div className='mx-2 my-3 py-1'>
                    <ButtonBox type="go" onClickHandler={e => { setFetchData(x => x + 1) }} className="btn-sm"></ButtonBox>
                </div>
            </div>
            <hr />
            <TableView option={tableOptionOrderDetails}></TableView>
            <KandooraStatusPopup orderData={viewOrderId} />
        </>
    )
}
