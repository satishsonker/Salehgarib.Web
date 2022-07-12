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
            popupModelId: "add-customer-order",
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
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Customer Orders</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            <div id="add-customer-order" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-xl">
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
                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Order No
                                                </label>
                                                <input type="text" className="form-control" placeholder="4848548" disabled />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Name</label>
                                                <input type="text" className="form-control" placeholder="Mansoor" disabled />
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <button type="button" className="btn btn-info text-white waves-effect"
                                                    data-bs-dismiss="modal">Refresh</button>

                                            </div>

                                            <div className="clearfix"></div>
                                            <div className="col-12 col-md-3">
                                                <label className="form-label">Customer Name</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>
                                            <div className="col-12 col-md-3">
                                                <label className="form-label">Pre. Amount</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>


                                            <div className="col-12 col-md-3">
                                                <label className="form-label">Delivery Date</label>
                                                <input type="date" className="form-control" disabled />
                                            </div>


                                            <div className="col-12 col-md-3">
                                                <label className="form-label">Contact1</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>
                                            <div className="col-12 col-md-3">
                                                <label className="form-label">P.O. Box</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-3">
                                                <label className="form-label">Saleman</label>
                                                <select className="form-select" id="validationCustom04" required="">
                                                    <option selected="" disabled="" value="">Choose...</option>
                                                    <option>...</option>




                                                </select>
                                            </div>


                                            <div className="col-12 col-md-3">
                                                <label className="form-label">City</label>
                                                <select className="form-select" id="validationCustom08" required="">
                                                    <option selected="" disabled="" value="">Choose...</option>
                                                    <option>...</option>




                                                </select>
                                            </div>

                                            <div className="clearfix"></div>



                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Length</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Hipps</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Sleeves</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Shoulder</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Neck</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Extra</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Order Stat.</label>
                                                <select className="form-select" id="validationCustom048" required="">
                                                    <option selected="" disabled="" value="">Choose...</option>
                                                    <option>...</option>




                                                </select>
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Chest</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Bottom</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Sleeves Loo.</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Deep</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Back Down</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Name</label>
                                                <input type="text" className="form-control" disabled />
                                            </div>

                                            <div className="col-12 col-md-2">
                                                <label className="form-label">Measu.Sat.</label>
                                                <select className="form-select" id="validationCustom048" required="">
                                                    <option selected="" disabled="" value="">Choose...</option>
                                                    <option>...</option>




                                                </select>
                                            </div>

                                            <div className="col-12 col-md-2 mt-auto">
                                                <button type="button" className="btn btn-info text-white waves-effect" data-bs-dismiss="modal">Add
                                                    me</button>
                                            </div>


                                            <div className="clearfix"></div>

                                            <div className="d-flex justify-content-start bd-highlight mb-3 example-parent">
                                                <div className="p-2 bd-highlight col-example btnbr">ROSE+KAJU</div>
                                                <div className="p-2 bd-highlight col-example btnbr">LINING

                                                </div>

                                                <div className="p-2 bd-highlight col-example btnbr">FLOWERS</div>
                                                <div className="p-2 bd-highlight col-example btnbr">ROSE+SUNFLR.</div>
                                                <div className="p-2 bd-highlight col-example btnbr">TIGER</div>
                                                <div className="p-2 bd-highlight col-example btnbr">KAJU</div>
                                                <div className="p-2 bd-highlight col-example btnbr">GEOMATRICAL</div>
                                                <div className="p-2 bd-highlight col-example btnbr">SUNFLOWER</div>
                                                <div className="p-2 bd-highlight col-example btnbr">ROSE</div>
                                                <div className="p-2 bd-highlight col-example btnbr">PEACOCK</div>
                                                <div className="p-2 bd-highlight col-example btnbr">ROSE+ARKA</div>
                                                <div className="p-2 bd-highlight col-example btnbr">SMALL ROSE</div>


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
