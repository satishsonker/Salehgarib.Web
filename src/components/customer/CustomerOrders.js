import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'

export default function CustomerOrders() {
    const customerOrderModelTemplate = {
        "id": 0,
        "firstname": "",
        "lastname": "",
        "contact1": "",
        "contact2": "",
        "orderNo": 0,
        "accountId": "",
        "branch": "",
        "poBox": ""
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

    const handleTextChange = (e) => {
        var value = e.target.value;
        if (e.target.type === 'number') {
            value = parseInt(e.target.value);
        }
        setCustomerOrderModel({ ...customerOrderModel, [e.target.name]: value });
    }
    const handleSave = () => {
        let data = common.assignDefaultValue(customerOrderModelTemplate, customerOrderModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.customerController.add, data).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.customerController.update, data).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
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
    const tableOptionTemplet = {
        headers: [
            { name: "Lastname", prop: "lastname" },
            { name: "Contact1", prop: "contact1" },
            { name: "Contact2", prop: "contact2" },
            { name: "OrderNo", prop: "orderNo" },
            { name: "Customer", prop: "customer" }
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-customer",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const saveButtonHandler = () => {
        setCustomerOrderModel({ ...customerOrderModelTemplate });
        setIsRecordSaving(true);
    }
    const breadcrumbOption = {
        title: 'Customers',
        buttons: [
            {
                text: "Customer Orders",
                icon: 'bx bx-plus',
                modelId: 'add-customer-order',
                handler: saveButtonHandler
            }
        ]
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Customer Orders</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            <div id="add-customer-order" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Customer Order Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className="modal-body">
                            <from className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-12">
                                            <label class="form-label">Customer</label>
                                                <input type="text" className="form-control" value={customerOrderModel.customer} name='customer' onChange={e => handleTextChange(e)} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                            <label class="form-label">Contact 1</label>
                                                <input type="text" className="form-control" value={customerOrderModel.contact1} name='contact1' onChange={e => handleTextChange(e)} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                            <label class="form-label">Contact 2</label>
                                                <input type="text" className="form-control" value={customerOrderModel.contact2} name='contact2' onChange={e => handleTextChange(e)} />
                                            </div>
                                            <div className="col-12">
                                            <label class="form-label">Lastname</label>
                                                <input type="text" className="form-control" value={customerOrderModel.lastname} name='lastname' onChange={e => handleTextChange(e)} />
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Order No.</label>
                                                <input type="text" className="form-control" value={customerOrderModel.orderNo} name='orderNo' onChange={e => handleTextChange(e)} />
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </from>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={e => handleSave()} className="btn btn-info text-white waves-effect" data-bs-dismiss="modal"> {isRecordSaving ? "Save" : "Update"}</button>
                            <button type="button" className="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
