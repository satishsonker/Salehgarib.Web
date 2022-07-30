import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView';
import CustomerOrderForm from './CustomerOrderForm';

export default function CustomerOrders() {
    const customerOrderModelTemplate = {
        id: 0,
        firstname: "",
        customerId: 0,
        lastname: "",
        contact1: "",
        contact2: "",
        orderNo: 0,
        branch: "",
        accountId: "",
        customerName: "",
        salesmanId: 0,
        designSampleId: 0,
        measurementStatusId: 0,
        orderStatusId: 0,
        categoryId: 0,
        cityId: 0,
        poBox: "",
        preAmount: 0,
        deliveryDate: "",
        chest: 0,
        sleevesLoose: 0,
        deep: 0,
        backDown: 0,
        bottom: 0,
        length: 0,
        hipps: 0,
        sleeves: 0,
        shoulder: 0,
        neck: 0,
        extra: 0

    };
    const [customerOrderModel, setCustomerOrderModel] = useState(customerOrderModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const handleDelete = (id) => {
        Api.Delete(apiUrls.customerController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        }).catch(err => {
            toast.error(toastMessage.deleteError);
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.customerController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }
    const handleEdit = (customerId) => {

        Api.Get(apiUrls.customerController.get + customerId).then(res => {
            if (res.data.id > 0) {
                setCustomerOrderModel(res.data);
                setIsRecordSaving(false);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    }
    const handleView = (orderId) => {
        let orderDetails = tableOption.data.find(x => x.id === orderId).orderDetails;
        tableOptionOrderDetailsTemplet.data = orderDetails;
        tableOptionOrderDetailsTemplet.totalRecords = orderDetails.length;
        setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
    }
    const tableOptionTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo" },
            { name: "Customer Name", prop: "customerName" },
            { name: "Salesname", prop: "salesname" },
            { name: "Order Date", prop: "orderDate" },
            { name: "City", prop: "city" },
            { name: "Total Amount", prop: "totalAmount" },
            { name: "Advance Amount", prop: "advanceAmount" },
            { name: "Balance Amount", prop: "balanceAmount" },
            { name: "Payment Mode", prop: "paymentMode" },
            { name: "Customer Ref Name", prop: "customerRefName" }
        ],
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: true,
            popupModelId: "add-customer-order",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            },
            view: {
                handler: handleView
            }
        }
    }

    const tableOptionOrderDetailsTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo" },
            { name: "Category", prop: "categoryName" },
            { name: "Model", prop: "designSampleName" },
            { name: "Price", prop: "price" },
            { name: "Chest", prop: "chest" },
            { name: "SleevesLoose", prop: "sleevesLoose" },
            { name: "Deep", prop: "deep" },
            { name: "BackDown", prop: "backDown" },
            { name: "Bottom", prop: "bottom" },
            { name: "Length", prop: "length" },
            { name: "Hipps", prop: "hipps" },
            { name: "Sleeves", prop: "sleeves" },
            { name: "Shoulder", prop: "shoulder" },
            { name: "Neck", prop: "neck" },
            { name: "Extra", prop: "extra" },
            { name: "Crystal", prop: "crystal" },
            { name: "Description", prop: "description" },
            { name: "Work Type", prop: "workType" },
            { name: "Order Status", prop: "orderStatus" },
            { name: "Measurement Status", prop: "measurementStatus" }
        ],
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    const saveButtonHandler = () => {
        setCustomerOrderModel({ ...customerOrderModelTemplate });
        setIsRecordSaving(true);
    }
    const breadcrumbOption = {
        title: 'Customers',
        items: [
            {
                link: "/customers",
                title: "Customers",
                icon: "bi bi-person-bounding-box"
            },
            {
                isActive: false,
                title: "Customers Orders",
                icon: "bi bi-cart3"
            }
        ],
        buttons: [
            {
                text: "Customer Orders",
                icon: 'bx bx-plus',
                modelId: 'add-customer-order',
                handler: saveButtonHandler
            }
        ]
    }
    //Initial data loading
    useEffect(() => {
        Api.Get(apiUrls.orderController.getAll + `?pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.data.length;
                setTableOption({ ...tableOptionTemplet });
            })
    }, [])

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Customer Orders</h6>
            <hr />
            <TableView option={tableOption}></TableView>
            <TableView option={tableOptionOrderDetails}></TableView>

            <div id="add-customer-order" className="modal fade in" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Customer Order Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <CustomerOrderForm></CustomerOrderForm>
                    </div>
                </div>
            </div>

        </>
    )
}
