import React, { useState, useEffect, useRef } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'
import { useSearchParams } from 'react-router-dom';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { headerFormat } from '../../utils/tableHeaderFormat';
import { common } from '../../utils/common';
import Dropdown from '../common/Dropdown';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';
import KandooraStatusPopup from './KandooraStatusPopup';
import MeasurementUpdatePopop from './MeasurementUpdatePopop';
import { useReactToPrint } from 'react-to-print';
import { PrintWorkTypeDetails } from '../print/worksheet/PrintWorkTypeDetails';

export default function OrderDetailByWorkType() {
    const [searchParams, setSearchParams] = useSearchParams();
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [orderStatusList, setOrderStatusList] = useState([]);
    const [orderTypeList, setOrderTypeList] = useState([]);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState("0");
    const [salesmanList, setSalesmanList] = useState([])
    const [viewOrderId, setViewOrderId] = useState(0);
    const [filter, setFilter] = useState({
        fromDate: common.getHtmlDate(common.addYearInCurrDate(-1)),
        toDate: common.getHtmlDate(new Date()),
        salesmanId: 0,
        completeStatus: 0,
        orderType:''
    });
    const [fetchData, setFetchData] = useState(0);
    const completeStatusList = [{ id: 0, value: "All" }, { id: 1, value: "Completed" }, { id: 2, value: "Not Completed" }]
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
    const printWorkTypeDetails = useRef();
    const printWorkTypeDetailsHandler = useReactToPrint({
        content: () => printWorkTypeDetails.current,
    });
    const kandooraStatusHandler = (id, data) => {
        data.id = data?.orderId;
        data.orderDetails = [{ status: data?.status, orderNo: data?.orderNo.split("-")[0], id: data.id }];
        setViewOrderId(data);
    }
    const updateMeasurementHandler = (id, data) => {
        //var selectedOrder = tableOption.data.find(order => order.id === id);
        data.id = data?.orderId;
        data.orderDetails = [{ status: data?.status, orderNo: data?.orderNo.split("-")[0], id: data.id, ...data }];
        setViewOrderId(data);
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
                },
                {
                    modelId: "measurement-update-popup-model",
                    icon: "bi bi-fullscreen-exit",
                    title: 'Update Measument and Design Model',
                    handler: updateMeasurementHandler,
                    showModel: true
                }
            ]
        }
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    useEffect(() => {
        Api.Get(apiUrls.orderController.getByWorkType + `${REQUESTED_WORKTYPE}&pageNo=${pageNo}&pageSize=${pageSize}&orderStatus=${selectedOrderStatus}&fromDate=${filter.fromDate}&toDate=${filter.toDate}&salesmanId=${filter.salesmanId}&orderType=${filter.orderType}&completeStatus=${filter.completeStatus}`)
            .then(res => {
                var orders = res.data.data
                tableOptionTemplet.data = orders;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            })
    }, [pageNo, pageSize, fetchData, REQUESTED_WORKTYPE]);

    const changeHandler = (e) => {
        setSelectedOrderStatus(e.target.value);
    }

    useEffect(() => {
        var apiList = [];
        //  apiList.push(Api.Get(apiUrls.orderController.getOrderStatusList));
        apiList.push(Api.Get(apiUrls.dropdownController.employee + `?SearchTerm=salesman`));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataType + `?masterDataType=order_type`));
        Api.MultiCall(apiList)
            .then(res => {
                setOrderStatusList(["Pending", "Completed", "Delivered"]);
                setSalesmanList(res[0].data);
                setOrderTypeList(res[1].data);
            });
    }, []);

    const breadcrumbOption = {
        title: common.workType[REQUESTED_WORKTYPE] + " Details",
        items: [
            {
                title: common.workType[REQUESTED_WORKTYPE] + " Details",
                icon: "bi bi-person-badge-fill",
                isActive: false,
            }
        ]
    }
    const filterDataChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    }
    const getComplteStatusText = () => {
        var data = completeStatusList.find(x => x.id === parseInt(filter.completeStatus));
        return data === undefined ? "All" : data.value;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between">
                <div className=''>
                    <div className="d-flex justify-content-end">
                        <div className='mx-2'>
                            <span> Complete Status</span>
                            <Dropdown title="Complete Status Filter" displayDefaultText={false} data={completeStatusList} value={filter.completeStatus} onChange={filterDataChangeHandler} name="completeStatus" className="form-control-sm"></Dropdown>
                        </div>
                        <div className='mx-2'>
                            <span> Salesman</span>
                            <Dropdown title="Salesman Filter" defaultText="All" data={salesmanList} value={filter.salesmanId} onChange={filterDataChangeHandler} name="salesmanId" className="form-control-sm"></Dropdown>
                        </div>
                        <div className='mx-2'>
                            <span> Booking Type</span>
                            <Dropdown title="Order Type Filter" name="orderType" defaultText="All Type" defaultValue="" data={orderTypeList} elementKey="value" value={filter.orderType} onChange={filterDataChangeHandler} className="form-control-sm"></Dropdown>
                        </div>
                        <div className='mx-2'>
                            <span> Order Status</span>
                            <Dropdown title="Order Status Filter" defaultText="All Status" data={common.dropdownArray(orderStatusList)} value={selectedOrderStatus} onChange={changeHandler} className="form-control-sm"></Dropdown>
                        </div>
                        <div className='mx-2'>
                            <span> From Date</span>
                            <Inputbox type="date" name="fromDate" value={filter.fromDate} max={filter.toDate} onChangeHandler={filterDataChangeHandler} className="form-control-sm" showLabel={false} />
                        </div>
                        <div className='mx-2'>
                            <span> To Date</span>
                            <Inputbox type="date" name="toDate" min={filter.fromDate} value={filter.toDate} onChangeHandler={filterDataChangeHandler} className="form-control-sm" showLabel={false} />
                        </div>
                        <div className='mx-2 my-3 py-1'>
                            <ButtonBox type="go" onClickHandler={e => { setFetchData(x => x + 1) }} className="btn-sm"></ButtonBox>
                        </div>
                        <div className='mx-2 my-3 py-1'>
                            <ButtonBox type="Print" onClickHandler={printWorkTypeDetailsHandler} className="btn-sm"></ButtonBox>
                        </div>
                    </div>
                </div>
            </div>

            <hr />
            <TableView option={tableOption}></TableView>
            <KandooraStatusPopup orderData={viewOrderId} />
            <MeasurementUpdatePopop orderData={viewOrderId} searchHandler={handleSearch} />
            <div className='d-none'>
                <PrintWorkTypeDetails ref={printWorkTypeDetails} props={{ data: tableOption.data, completeStatus: getComplteStatusText(), workType: common.workType[REQUESTED_WORKTYPE], filter: filter }} />
            </div>
        </>
    )
}
