import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import Inputbox from '../common/Inputbox';
import TableView from '../tables/TableView'
import KandooraStatusPopup from './KandooraStatusPopup';
import MeasurementUpdatePopop from './MeasurementUpdatePopop';

export default function SearchOrders() {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const searchByValue = { customer: "customer", salesman: "salesman" };
    const [selectedOrderStatus, setSelectedOrderStatus] = useState("0");
    const [viewOrderId, setViewOrderId] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [orderStatusList, setOrderStatusList] = useState([]);
    const [pageSize, setPageSize] = useState(20);
    const [customerList, setCustomerList] = useState([]);
    const [salesmanList, setSalesmanList] = useState([]);
    const [searchModel, setSearchModel] = useState({ customerId: 0, salesmanId: 0, fromDate: common.getHtmlDate(common.getFirstDateOfMonth()), toDate: common.getHtmlDate(common.getLastDateOfMonth()) });
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const [searchBy, setSearchBy] = useState('customer');
    const [fireFilter, setFireFilter] = useState(0);
    const handleTextChange = (e) => {
        let model = searchModel;
        let { type, name, value } = e.target;
        if (type === 'select-one') {
            value = parseInt(value);
        }
        model[name] = value;
        setSearchModel({ ...model });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3) {
            toast.warn(toastMessage.invalidSearchLength);
            return;
        }
        let url;
        switch (searchBy) {
            default:
            case searchByValue.customer:
                url = apiUrls.orderController.searchByCustomer + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}&customerId=${searchModel.customerId}`;
                break;
            case searchByValue.salesman:
                url = apiUrls.orderController.searchBySalesman + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}&salesmanId=${searchModel.salesmanId}`;
                break;
        }
        Api.Get(url).then(res => {
            var orders = res.data.data
            debugger;
            orders.forEach(element => {
                element.paymentReceived = (((element.paidAmount + element.advanceAmount) / element.totalAmount) * 100).toFixed(2);
                element.vatAmount = common.calculatePercent(element.subTotalAmount, VAT);
                element.advanceAmount = element.advanceAmount + element.paidAmount;
                var cancelledQty = element.orderDetails.filter(x => x.isCancelled).length;
                if (cancelledQty === element.orderDetails.length)
                    element.status = "Cancelled"
                if (cancelledQty > 0 && cancelledQty < element.orderDetails.length)
                    element.status = "Partially Cancelled"
            });
            tableOptionTemplet.data = orders;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            tableOptionOrderDetailsTemplet.data = [];
            tableOptionOrderDetailsTemplet.totalRecords = 0;
            setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
        }).catch(err => {

        });
    }
    const handleView = (orderId) => {

        setViewOrderDetailId(orderId);
    }

    const handleSearchType = (searchType) => {
        setSearchBy(searchType);
        tableOptionTemplet.data = [];
        tableOptionTemplet.totalRecords = 0;
        setTableOption({ ...tableOptionTemplet });
    }
    const kandooraStatusHandler = (id, data) => {
        setViewOrderId(data);
    }
    const updateMeasurementHandler = (id, data) => {
        setViewOrderId(data);
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
            if (data.orderDetails.filter(x => x.isCancelled).length === data.orderDetails.length)
                return "cancelOrder"
            else if (data.orderDetails.filter(x => x.isCancelled).length > 0)
                return "partcancelOrder"
            else if (data.isDeleted)
                return "cancelOrder"
            else
                return "";
        },
        actions: {
            showEdit: false,
            showDelete: false,
            view: {
                handler: handleView
            },
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

    const tableOptionOrderDetailsTemplet = {
        headers: headerFormat.orderDetails,
        changeRowClassHandler: (data) => {
            return data?.isCancelled ? "bg-danger text-white" : "";
        },
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
        title: 'Search Orders',
        items: [
            {
                link: "/customers",
                title: "Customers",
                icon: "bi bi-person-bounding-box"
            },
            {
                isActive: false,
                title: "Search Orders",
                icon: "bi bi-binoculars"
            }
        ]
    }

    //Initial data loading 
    useEffect(() => {
        var apisList = [];
        apisList.push(Api.Get(apiUrls.customerController.getAll + `?pageNo=1&pageSize=1000000`));
        apisList.push(Api.Get(apiUrls.dropdownController.employee + `?SearchTerm=salesman`));
        apisList.push(Api.Get(apiUrls.orderController.getOrderStatusList));
        Api.MultiCall(apisList).then(res => {
            setCustomerList(res[0].data.data);
            setSalesmanList(res[1].data);
            setOrderStatusList(res[2].data);
        });
    }, []);

    useEffect(() => {
        if (searchModel.customerId === 0 && searchModel.salesmanId === 0) {
            if (fireFilter > 0) {
                if (searchBy === searchByValue.customer)
                    toast.warn(validationMessage.customerRequired);
                else if (searchBy === searchByValue.salesman)
                    toast.warn(validationMessage.salesmanRequired);
            }
            return;
        }
        let url;
        let queryString=`&PageNo=${pageNo}&PageSize=${pageSize}&fromDate=${searchModel.fromDate}&toDate=${searchModel.toDate}&orderStatus=${selectedOrderStatus}`;
        switch (searchBy) {
            default:
            case searchByValue.customer:
                url = apiUrls.orderController.getByCustomer + `?customerId=${searchModel.customerId}`+queryString;
                break;
            case searchByValue.salesman:
                url = apiUrls.orderController.getBySalesman + `?salesmanId=${searchModel.salesmanId}`+queryString;
                break;
        }
        Api.Get(url).then(res => {
            var orders = res.data.data
            orders.forEach(element => {
                element.vatAmount = common.calculatePercent(element.subTotalAmount, VAT);
                element.subTotalAmount = parseFloat(element.totalAmount - element.vatAmount);
                element.balanceAmount = parseFloat(element.balanceAmount);
                element.totalAmount = parseFloat(element.totalAmount);
                element.advanceAmount = parseFloat(element.advanceAmount + element.paidAmount);
                element.paymentReceived = (((element.totalAmount - element.balanceAmount) / element.totalAmount) * 100).toFixed(2);
                element.vat = VAT;
                element.updatedAt = element.updatedAt === "0001-01-01T00:00:00" ? "" : element.updatedAt;
                var cancelledQty = element.orderDetails.filter(x => x.isCancelled).length;
                if (cancelledQty === element.orderDetails.length)
                    element.status = "Cancelled"
                if (cancelledQty > 0 && cancelledQty < element.orderDetails.length)
                    element.status = "Partially Cancelled"
            });
            tableOptionTemplet.data = orders;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
    }, [pageNo, pageSize, fireFilter]);

    useEffect(() => {
        let orders = tableOption.data.find(x => x.id === viewOrderDetailId);
        if (orders) {
            orders.orderDetails.forEach(element => {
                element.subTotalAmount = parseFloat(element.subTotalAmount).toFixed(2);
                element.price = parseFloat(element.price).toFixed(2);
                element.crystalPrice = parseFloat(element.crystalPrice).toFixed(2);
                element.vatAmount = parseFloat(element.totalAmount - element.subTotalAmount).toFixed(2);
                element.crystal = element.crystal ? element.crystal : '0.0';
                element.updatedAt = element.updatedAt === '0001-01-01T00:00:00' || !element.updatedAt ? '' : element.updatedAt
                if (!element.vat) {
                    element.vat = parseFloat(orders.vat).toFixed(2);;
                }
                if (element.isCancelled === true)
                    element.status = "Cancelled";
                else if (element.isDeleted === true)
                    element.status = "Deleted";
                else
                    element.status = "Active";
            });
            tableOptionOrderDetailsTemplet.data = orders.orderDetails;
            tableOptionOrderDetailsTemplet.totalRecords = orders.orderDetails.length;
            setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
        }
    }, [viewOrderDetailId])

    const customerSearchHandler = (data, searchTerm) => {
        return data.filter(x => searchTerm === "" || x.firstname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || x.contact1.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
    }

    const calculateSum = (propName, onlyCancelled = false) => {
        if (!onlyCancelled) {
            if (propName === 'payemntPercent') {
                return ((calculateSum("advanceAmount") / calculateSum("totalAmount")) * 100)
            }
            return tableOption.data.reduce((sum, ele) => {
                if (ele?.status?.toLowerCase() === "cancelled")
                    return sum;
                return sum += ele[propName];
            }, 0);
        }
        else {
            return tableOption.data.reduce((sum, ele) => {
                if (ele?.status?.toLowerCase() !== "cancelled")
                    return sum;
                return sum += ele[propName];
            }, 0);
        }
    }
    const changeHandler = (e) => {
        setSelectedOrderStatus(e.target.value);
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <hr />
            <div className='d-flex justify-content-end mb-2'>
                Search by <div className="form-check form-check-inline mx-2">
                    <input className="form-check-input" defaultChecked={true} type="radio" onClick={e => handleSearchType('customer')} name="inlineRadioOptions" id="inlineRadio1" value="Customer" />
                    <label className="form-check-label" htmlFor="inlineRadio1">Customer</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" onClick={e => handleSearchType('salesman')} name="inlineRadioOptions" id="inlineRadio2" value="Salesman" />
                    <label className="form-check-label" htmlFor="inlineRadio2">Salesman</label>
                </div>
                <div className="form-check form-check-inline">
                    {searchBy === searchByValue.customer && <Dropdown searchHandler={customerSearchHandler} className='form-control-sm' onChange={handleTextChange} data={customerList} elementKey="id" text="firstname" defaultValue='' name="customerId" value={searchModel.customerId} searchable={true} defaultText="Select Customer.." />}

                    {searchBy === searchByValue.salesman && <Dropdown className='form-control-sm' onChange={handleTextChange} data={salesmanList} defaultValue='0' name="salesmanId" value={searchModel.salesmanId} defaultText="Select salesman.." />}
                </div>
                <div className='mx-2'>
                            <Dropdown title="Order Status Filter" defaultText="All Status" data={common.dropdownArray(orderStatusList)} value={selectedOrderStatus} onChange={changeHandler} className="form-control-sm"></Dropdown>
                        </div>
                <div className='mx-2'>
                    <Inputbox type="date" className='form-control-sm' showLabel={false} name="fromDate" value={searchModel.fromDate} onChangeHandler={handleTextChange} />
                </div>
                <div className='mx-2'>
                    <Inputbox type="date" className='form-control-sm' showLabel={false} name="toDate" value={searchModel.toDate} onChangeHandler={handleTextChange} />
                </div>
                <div className='mx-2'>
                    <ButtonBox type="go" onClickHandler={() => { setFireFilter(ele => ele + 1) }} className="btn-sm" />
                </div>
                <div className='mx-2'>
                    <ButtonBox type="print" className="btn-sm" />
                </div>
            </div>

            <TableView option={tableOption}></TableView>
            {
                tableOptionOrderDetails.data.length > 0 &&
                <TableView option={tableOptionOrderDetails}></TableView>
            }
            <div className='card'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-1'>
                            <Inputbox disabled={true} labelText="Total Amount" value={common.printDecimal(calculateSum("totalAmount"))}></Inputbox>
                        </div>
                        <div className='col-1'>
                            <Inputbox disabled={true} labelText="Total Qty" value={calculateSum("qty")}></Inputbox>
                        </div>
                        <div className='col-1'>
                            <Inputbox disabled={true} labelTextHelp="Avg Amount = Total Amount / Total Qty" labelText="Avg Amount" value={common.printDecimal(tableOption.data.reduce((sum, ele) => { return sum += ele.totalAmount }, 0) / tableOption.data.reduce((sum, ele) => { return sum += ele.qty }, 0))}></Inputbox>
                        </div>
                        <div className='col-1'>
                            <Inputbox disabled={true} labelText="Total Advance" value={common.printDecimal(calculateSum("advanceAmount"))}></Inputbox>
                        </div>
                        <div className='col-1'>
                            <Inputbox disabled={true} labelText="Total Balance" value={common.printDecimal(calculateSum("balanceAmount"))}></Inputbox>
                        </div>
                        <div className='col-1'>
                            <Inputbox disabled={true} labelText="Received %" value={common.printDecimal(calculateSum("payemntPercent"))}></Inputbox>
                        </div>
                        <div className='col-1'>
                            <Inputbox labelText="Commission"></Inputbox>
                        </div>
                        <div className='col-1'>
                            <Inputbox disabled={true} labelText="Cancelled Qty" value={calculateSum("qty", true)}></Inputbox>
                        </div>
                        <div className='col-1'>
                            <Inputbox disabled={true} labelText="Cancelled Amount" value={common.printDecimal(calculateSum("totalAmount", true))}></Inputbox>
                        </div>
                    </div>
                </div>
            </div>
            <KandooraStatusPopup orderData={viewOrderId} />
            <MeasurementUpdatePopop orderData={viewOrderId} searchHandler={handleSearch} />
        </>
    )
}
