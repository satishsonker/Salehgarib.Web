import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toastMessage } from '../../../constants/ConstantValues';
import { validationMessage } from '../../../constants/validationMessage';
import { common } from '../../../utils/common';
import RegexFormat from '../../../utils/RegexFormat';
import Breadcrumb from '../../common/Breadcrumb';
import ErrorLabel from '../../common/ErrorLabel';
import Label from '../../common/Label';
import TableView from '../../tables/TableView';

export default function Suppliers() {
    const supplierModelTemplate = {
        contact: '',
        companyName: '',
        title: '',
        address: '',
        city: '',
        supid:0
    }
    const [supplierModel, setSupplierModel] = useState(supplierModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.supplierController.delete + id).then(res => {
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
        Api.Get(apiUrls.supplierController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var value = e.target.value;
        if (e.target.type === 'number' || e.target.type === 'select-one') {
            value = parseInt(e.target.value);
        }
        setSupplierModel({ ...supplierModel, [e.target.name]: value });

        if (!!errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null })
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }

        let data = common.assignDefaultValue(supplierModelTemplate, supplierModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.supplierController.add, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup();
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.supplierController.update, supplierModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup();
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (supplierId) => {
        setIsRecordSaving(false);
        Api.Get(apiUrls.supplierController.get + supplierId).then(res => {
            if (res.data.id > 0) {
                setSupplierModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Company Name', prop: 'companyName' },
            { name: 'Contact', prop: 'contact' },
            { name: 'Title', prop: 'title' },
            { name: 'Address', prop: 'address' },
            { name: 'city', prop: 'city' }
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
            popupModelId: "add-supplier",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setSupplierModel({ ...supplierModelTemplate });
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Suppliers',
        items: [
            {
                title: "Supplier Details",
                icon: "bi bi-layers",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Supplier Deatils",
                icon: 'bx bx-plus',
                modelId: 'add-supplier',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.supplierController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setSupplierModel({ ...supplierModelTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const { companyName,title,city,address,contact} = supplierModel;
        const newError = {};
        if (!companyName || companyName === "") newError.companyName = validationMessage.companyNameRequired;
        if (!title || title === "") newError.title = validationMessage.titleRequired;
        if (!city || city === "") newError.city = validationMessage.cityRequired;
        if (!address || address === "") newError.address = validationMessage.addressRequired;
        if (contact?.length>0 && !RegexFormat.mobile.test(contact)) newError.contact = validationMessage.invalidContact;

        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Supplier Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-supplier" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Suppliers</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-12">
                                                <Label text="Company Name" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="companyName" value={supplierModel.companyName} type="text" id='companyName' className="form-control" />
                                                <ErrorLabel message={errors?.companyName}></ErrorLabel>
                                            </div>
                                            <div className="col-12">
                                                <Label text="Contact" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="contact" value={supplierModel.contact} type="text" id='contact' className="form-control" />
                                                <ErrorLabel message={errors?.contact}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Title" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="title" min={0} value={supplierModel.title} type="text" id='title' className="form-control" />
                                                <ErrorLabel message={errors?.title}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="City" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="city" min={0} value={supplierModel.city} type="text" id='city' className="form-control" />
                                                <ErrorLabel message={errors?.city}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Address" isRequired={true}></Label>
                                                <textarea required onChange={e => handleTextChange(e)} name="address" min={0} value={supplierModel.address} type="text" id='address' className="form-control" />
                                                <ErrorLabel message={errors?.address}></ErrorLabel>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" onClick={e => handleSave(e)} className="btn btn-info text-white waves-effect" >{isRecordSaving ? 'Save' : 'Update'}</button>
                            <button type="button" className="btn btn-danger waves-effect" id='closePopup' data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
