import React, { useEffect, useState } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown'
import ErrorLabel from '../common/ErrorLabel';
import TableView from '../tables/TableView';

export default function SalesmanReport() {
    const [salesmanList, setSalesmanList] = useState([]);
    const [errors, setErrors] = useState({});
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const [searchModel, setsearchModel] = useState({ salesmanId: 0, fromDate: common.getHtmlDate(new Date()), toDate: common.getHtmlDate(new Date()) });

    useEffect(() => {
        var apisList = [];
        apisList.push(Api.Get(apiUrls.dropdownController.employee + `?SearchTerm=salesman`));
        Api.MultiCall(apisList).then(res => {
            setSalesmanList(res[0].data);
        });
    },[]);

    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.searchBySalesmanAndDateRange + `${searchModel.fromDate}/${searchModel.toDate}?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {
            var orders = res.data.data
            orders.forEach(element => {
                if (element.orderDetails.filter(x => x.isCancelled).length === element.orderDetails.length)
                    element.status = "Cancelled"
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
    const breadcrumbOption = {
        title: 'Salesman Report',
        items: [
            {
                link: "/Employee-details",
                title: "Orders",
                icon: "bi bi-person-badge-fill"
            },
            {
                isActive: false,
                title: "Salesman Report",
                icon: "bi bi-file-earmark-bar-graph"
            }
        ]
    }
    const textChangeHandler = (e) => {
        debugger;
        let { name, type, value } = e.target;
        if (type === "select-one") {
            value = parseInt(value);
        }
        setsearchModel({ ...searchModel, [name]: value });
    }
    const validateError = () => {
        const { fromDate, toDate, salesmanId } = searchModel;
        const newError = {};
        if (!fromDate || fromDate === common.defaultDate) newError.fromDate = validationMessage.fromDateRequired;
        if (!toDate || toDate === common.defaultDate) newError.toDate = validationMessage.toDateRequired;
        if (!salesmanId || salesmanId === 0) newError.salesmanId = validationMessage.salesmanRequired;
        return newError;
    }

    const handleView = (orderId) => {

        setViewOrderDetailId(orderId);
    }
    const tableOptionTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo" },
            { name: "Customer Name", prop: "customerName" },
            { name: "Salesname", prop: "salesman" },
            { name: "Order Date", prop: "orderDate" },
            { name: "Order Delivery Date", prop: "orderDeliveryDate" },
            { name: "VAT", prop: "vat", action: { decimal: true } },
            { name: "Sub Total", prop: "subTotalAmount", action: { decimal: true } },
            { name: "VAT Amount", prop: "vatAmount", action: { decimal: true } },
            { name: "Total Amount", prop: "totalAmount", action: { decimal: true } },
            { name: "Advance Amount", prop: "advanceAmount", action: { decimal: true } },
            { name: "Balance Amount", prop: "balanceAmount", action: { decimal: true } },
            { name: "Payment Mode", prop: "paymentMode" },
            { name: "Order Status", prop: "status" },
            { name: "Deleted/Cancelled By", prop: "updatedBy" },
            { name: "Deleted/Cancelled On", prop: "updatedAt" },
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
            { name: "Status", prop: "status" },
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

    useEffect(() => {
        let formErrors = validateError();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setErrors({});
        let url = apiUrls.orderController.getBySalesman + `/${searchModel.fromDate}/${searchModel.toDate}?PageNo=${pageNo}&PageSize=${pageSize}&salesmanId=${searchModel.salesmanId}`;
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
            setViewOrderDetailId(0);
        })
    }, [pageNo, pageSize,searchModel]);

    useEffect(() => {
        if(viewOrderDetailId===0)
        return;
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
    }, [viewOrderDetailId]);
    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div>
                Search by Order Date : <div className="form-check form-check-inline" style={{ display: "inline-grid" }}>
                    <input className="form-control-sm" type="date" onChange={e => textChangeHandler(e)} max={searchModel.toDate} name='fromDate' value={searchModel.fromDate} />
                    <ErrorLabel message={errors?.fromDate} />
                </div> To
                <div className="form-check form-check-inline" style={{ display: "inline-grid" }}>
                    <input className="form-control-sm" type="date" onChange={e => textChangeHandler(e)} min={searchModel.fromDate} name='toDate' value={searchModel.toDate} />
                    <ErrorLabel message={errors?.toDate} />
                </div>
                Salasman :   <div className="form-check form-check-inline" style={{ display: "inline-grid" }}>
                    <Dropdown className='form-control-sm' onChange={e => textChangeHandler(e)} searchable={true} data={salesmanList} defaultValue='0' name="salesmanId" value={searchModel.salesmanId} defaultText="Select salesman.." />
                    <ErrorLabel message={errors?.salesmanId} />
                </div>
            </div>
            <hr />
            <TableView option={tableOption} />
            {viewOrderDetailId>0 && <>
            <hr />
            <TableView option={tableOptionOrderDetails} />
            </>}
        </>
    )
}
