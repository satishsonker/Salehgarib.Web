import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';


export default function CompanyShopCompany() {
    const expenseCompanyTemplate = {
        id: 0,
        companyName: '',
        contactNo: '',
        address: ''
    }
    const [expenseCompanyModel, setExpanseCompanyModel] = useState(expenseCompanyTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.expenseController.deleteExpenseCompany + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.expenseController.searchExpenseCompany + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = expenseCompanyModel;
            data[name] = value.toUpperCase();
            data.code =common.generateMasterDataCode(value);
        setExpanseCompanyModel({ ...data });

        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null })
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }

        let data = common.assignDefaultValue(expenseCompanyTemplate, expenseCompanyModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.expenseController.addExpenseCompany, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-expenseCompany');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.expenseController.updateExpenseCompany, expenseCompanyModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-expenseCompany');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (expenseCompanyId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.expenseController.getExpenseCompany + expenseCompanyId).then(res => {
            if (res.data.id > 0) {
                setExpanseCompanyModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Company/Shop Name', prop: 'companyName' },
            { name: 'Contact Number', prop: 'contactNo' },
            { name: 'Address', prop: 'address' }
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
            popupModelId: "add-expenseCompany",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setExpanseCompanyModel({ ...expenseCompanyTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Expanse',
        items: [
            {
                title: "Expanse",
                icon: "bi bi-cash",
                link: '/expense',
            },
            {
                title: "Expanse Company'",
                icon: "bi bi-bank2",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Expanse Company",
                icon: 'bx bx-plus',
                modelId: 'add-expenseCompany',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.expenseController.getAllExpenseCompany + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
           ;
    }, [pageNo, pageSize]);


    useEffect(() => {
        if (isRecordSaving) {
            setExpanseCompanyModel({ ...expenseCompanyTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const {companyName} = expenseCompanyModel;
        const newError = {};
        if (!companyName || companyName === "") newError.companyName = validationMessage.companyNameRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Expanse Company Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-expenseCompany" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Expanse Company</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Company/Shop Name" isRequired={true}></Label>
                                                <input type="text" name="companyName" onChange={e=>handleTextChange(e)} value={expenseCompanyModel.companyName} className="form-control" />
                                                <ErrorLabel message={errors?.companyName}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Contact No"></Label>
                                                <input required onChange={e => handleTextChange(e)} name="contactNo" value={expenseCompanyModel.contactNo} type="text" className="form-control" />
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Address"></Label>
                                                <input required onChange={e => handleTextChange(e)} name="address" value={expenseCompanyModel.address} type="text" className="form-control" />
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
