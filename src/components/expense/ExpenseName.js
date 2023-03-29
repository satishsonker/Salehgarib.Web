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
import Dropdown from '../common/Dropdown';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';


export default function ExpenseName() {
    const expenseNameTemplate = {
        id: 0,
        code: '',
        value: '',
        expenseTypeId: 0
    }
    const [expenseNameModel, setExpanseNameModel] = useState(expenseNameTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const [expenseTypeList, setExpanseTypeList] = useState([])
    const handleDelete = (id) => {
        Api.Delete(apiUrls.expenseController.deleteExpenseName + id).then(res => {
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
        Api.Get(apiUrls.expenseController.searchExpenseName + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = expenseNameModel;
        if (name === 'expenseTypeId') {
            data[name] = parseInt(value);
        }
        else {
            data[name] = value.toUpperCase();
            data.code = common.generateMasterDataCode(value);
        }
        setExpanseNameModel({ ...data });

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

        let data = common.assignDefaultValue(expenseNameTemplate, expenseNameModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.expenseController.addExpenseName, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-expenseName');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.expenseController.updateExpenseName, expenseNameModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-expenseName');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (expenseNameId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.expenseController.getExpenseName + expenseNameId).then(res => {
            if (res.data.id > 0) {
                setExpanseNameModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };

    const tableOptionTemplet = {
        headers: headerFormat.expenseName,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-expenseName",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setExpanseNameModel({ ...expenseNameTemplate });
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
                title: "Expanse Name",
                icon: "bi bi-cash-coin",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Exp Type",
                icon: 'bi bi-credit-card',
                type: 'link',
                url: '/expense/type'
            },
            {
                text: "Expanse Name",
                icon: 'bx bx-plus',
                modelId: 'add-expenseName',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.expenseController.getAllExpenseName + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        Api.Get(apiUrls.expenseController.getAllExpenseType)
            .then(res => {
                setExpanseTypeList(res.data.data);
            })
    }, [])


    useEffect(() => {
        if (isRecordSaving) {
            setExpanseNameModel({ ...expenseNameTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const { value, expenseTypeId } = expenseNameModel;
        const newError = {};
        if (!value || value === "") newError.value = validationMessage.expanseNameRequired;
        if (!expenseTypeId || expenseTypeId === 0 || expenseTypeId === "") newError.expenseTypeId = validationMessage.expanseTypeRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Expanse Name Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-expenseName" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Expanse Name</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Expanse Type" isRequired={true}></Label>
                                                <Dropdown onChange={handleTextChange} data={expenseTypeList} name="expenseTypeId" value={expenseNameModel.expenseTypeId} className="form-control" />
                                                <ErrorLabel message={errors?.expenseTypeId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox labelText="Expanse Name" errorMessage={errors?.value} isRequired={true} name="value" className="form-control-sm" value={expenseNameModel.value} onChangeHandler={handleTextChange}/>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="save" text={isRecordSaving ? 'Save' : 'Update'} onClickHandler={handleSave} className="btn-sm"/>
                            <ButtonBox type="cancel" modelDismiss={true} className="btn-sm"/>
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>

    )
}
