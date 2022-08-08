import { data } from 'jquery';
import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import Breadcrumb from '../common/Breadcrumb'
import Dropdown from '../common/Dropdown';
import TableView from '../tables/TableView'

export default function SearchOrders() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [customerList, setCustomerList] = useState([]);
    const [salesmanList, setSalesmanList] = useState([]);
    const [searchModel, setSearchModel] = useState({ customerId: 0, salesmanId: 0 });
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const [searchBy, setSearchBy] = useState('customer');
    const handleTextChange = (e) => {
        let model = searchModel;
        let { type, name, value } = e.target;
        model.customerId = value;
        model.salesmanId = 0;
        if (type === 'select-one')
            value = parseInt(value);
        model[name] = value;
        setSearchModel({ ...model });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Post(apiUrls.orderController.searchDeletedOrders + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {
            var orders = res.data.data
            orders.forEach(element => {
                if (element.orderDetails.filter(x => x.isCancelled).length === element.orderDetails.length)
                    element.status = "Deleted"
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
    const tableOptionTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo" },
            { name: "Customer Name", prop: "customerName" },
            { name: "Salesname", prop: "salesman" },
            { name: "Order Date", prop: "orderDate" },
            { name: "Order Delivery Date", prop: "orderDeliveryDate" },
            { name: "City", prop: "city" },
            { name: "VAT", prop: "vat", action: { decimal: true } },
            { name: "Sub Total", prop: "subTotalAmount", action: { decimal: true } },
            { name: "VAT Amount", prop: "vatAmount", action: { decimal: true } },
            { name: "Total Amount", prop: "totalAmount", action: { decimal: true } },
            { name: "Advance Amount", prop: "advanceAmount", action: { decimal: true } },
            { name: "Balance Amount", prop: "balanceAmount", action: { decimal: true } },
            { name: "Payment Mode", prop: "paymentMode" },
            { name: "Customer Ref Name", prop: "customerRefName" },
            { name: "Order Status", prop: "status" },
            { name: "Deleted/Cancelled By", prop: "updatedBy" },
            { name: "Deleted/Cancelled On", prop: "updatedAt" },
            { name: "Deleted/Cancelled Note", prop: "note" },
        ],
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
            }
        }
    }

    const tableOptionOrderDetailsTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo" },
            { name: "Order Delivery Date", prop: "orderDeliveryDate" },
            { name: "Category", prop: "designCategory" },
            { name: "Model", prop: "designModel" },
            { name: "Chest", prop: "chest" },
            { name: "Sleeve Loose", prop: "sleeveLoose" },
            { name: "Deep", prop: "deep" },
            { name: "BackDown", prop: "backDown" },
            { name: "Bottom", prop: "bottom" },
            { name: "Length", prop: "length" },
            { name: "Hipps", prop: "hipps" },
            { name: "Sleeve", prop: "sleeve" },
            { name: "Shoulder", prop: "shoulder" },
            { name: "Neck", prop: "neck" },
            { name: "Extra", prop: "extra" },
            { name: "Description", prop: "description" },
            { name: "Work Type", prop: "workType" },
            { name: "Order Status", prop: "orderStatus" },
            { name: "Measurement Status", prop: "measurementStatus" },
            { name: "Crystal", prop: "crystal" },
            { name: "Crystal Price", prop: "crystalPrice" },
            { name: "Price", prop: "price" },
            { name: "Sub Total Amount", prop: "subTotalAmount" },
            { name: "VAT", prop: "vat" },
            { name: "VAT Amount", prop: "vatAmount" },
            { name: "Total Amount", prop: "totalAmount" },
            { name: "Deleted/Cancelled By", prop: "updatedBy" },
            { name: "Deleted/Cancelled On", prop: "updatedAt" },
            { name: "Deleted/Cancelled Note", prop: "note" },
        ],
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
        Api.MultiCall(apisList).then(res => {
            setCustomerList(res[0].data.data);
            setSalesmanList(res[1].data);
        });
    }, []);

    useEffect(() => {
        if (searchModel.customerId === 0 && searchModel.salesmanId === 0)
            return;
        let url;
        switch (searchBy) {
            default:
            case 'customer':
                url = apiUrls.orderController.getByCustomer + `?PageNo=${pageNo}&PageSize=${pageSize}&customerId=${searchModel.customerId}`;
                break;
            case 'salesman':
                url = apiUrls.orderController.getBySalesman + `?PageNo=${pageNo}&PageSize=${pageSize}&salesmanId=${searchModel.salesmanId}`;
                break;
        }
        Api.Get(url).then(res => {
            var orders = res.data.data
            orders.forEach(element => {
                element.vatAmount = ((element.totalAmount / (100 + element.vat)) * element.vat);
                element.subTotalAmount = parseFloat(element.totalAmount - element.vatAmount);
                element.balanceAmount = parseFloat(element.balanceAmount);
                element.totalAmount = parseFloat(element.totalAmount);
                element.advanceAmount = parseFloat(element.advanceAmount);
                element.vat = parseFloat(element.vat);
                element.updatedAt = element.updatedAt === "0001-01-01T00:00:00" ? "" : element.updatedAt;
                if (element.orderDetails.filter(x => x.isCancelled).length === element.orderDetails.length)
                    element.status = "Cancelled"
                else if (element.orderDetails.filter(x => x.isCancelled).length > 0)
                    element.status = "Partially Cancelled"
                else if (element.isDeleted)
                    element.status = "Deleted"
                else
                    element.status = "Active"
            });
            tableOptionTemplet.data = orders;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
    }, [pageNo, pageSize, searchModel]);

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
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <hr />
            Search by <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" onClick={e => handleSearchType('customer')} name="inlineRadioOptions" id="inlineRadio1" value="Customer" />
                <label className="form-check-label" htmlFor="inlineRadio1">Customer</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" onClick={e => handleSearchType('salesman')} name="inlineRadioOptions" id="inlineRadio2" value="Salesman" />
                <label className="form-check-label" htmlFor="inlineRadio2">Salesman</label>
            </div>
            <div className="form-check form-check-inline">
                {searchBy === 'customer' && <Dropdown searchHandler={customerSearchHandler} className='form-control-sm' onChange={handleTextChange} data={customerList} elemenyKey="id" text="firstname" defaultValue='' name="customerId" value={searchModel.customerId} searchable={true} defaultText="Select Customer.." />}

                {searchBy === 'salesman' && <Dropdown className='form-control-sm' onChange={handleTextChange} data={salesmanList} defaultValue='0' name="salesmanId" value={searchModel.salesmanId} defaultText="Select salesman.." />}
            </div>
            <TableView option={tableOption}></TableView>
            {
                tableOptionOrderDetails.data.length > 0 &&
                <TableView option={tableOptionOrderDetails}></TableView>
            }
        </>
    )
}
