import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function RentDetail() {
    const rentDetailTemplate = {
        id: 0,
        rentLocationId: 0,
        rentAmount: 0,
        installments: 0,
        firstInstallmentDate: common.getHtmlDate(new Date())
    }

    const installmentList = common.numberRangerForDropDown([1,2,3,4,6,12,24,36,48]);
    const [rentLocations, setRentLocations] = useState([])
    const [rentDetailModel, setRentDetailModel] = useState(rentDetailTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.rentController.deleteDetail + id).then(res => {
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
        Api.Get(apiUrls.rentController.searchDetail + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name,type } = e.target;
        var data = rentDetailModel;
        if(type==='select-one' || type==='number')
        {
            value=parseInt(value);
        }
        data[name] = value;
        setRentDetailModel({ ...data });

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

        let data = common.assignDefaultValue(rentDetailTemplate, rentDetailModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.rentController.addDetail, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-rentLocation');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.rentController.updateDetail, rentDetailModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-rentLocation');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (rentLocationId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.rentController.getDetail + rentLocationId).then(res => {
            if (res.data.id > 0) {
                setRentDetailModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };
    
    const tableOptionTransactionTemplet = {
        headers: [
            { name: 'Installment Name', prop: 'installmentName' },
            { name: 'Installment Date', prop: 'installmentDate' },
            { name: 'Installment Amount', prop: 'installmentAmount' },
            { name: 'Paid', prop: 'isPaid',action:{replace:{'false':'No','true':'Yes'}} },
            { name: 'Paid On', prop: 'paidOn' }, 
            { name: 'Paid By', prop: 'paidBy' },
            { name: 'Payment Mode', prop: 'paymentMode' },
            { name: 'Cheque No.', prop: 'chequeNo' },
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        showAction: false,
        showTableTop:false,
        showPagination:false
    };
    const [tableOptionTransaction, setTableOptionTransaction] = useState(tableOptionTransactionTemplet);
    const getTransactionHandler = (id) => {
        Api.Get(apiUrls.rentController.getRentTransaction + `?id=${id}`)
            .then(res => {
                tableOptionTransactionTemplet.data = res.data;
                tableOptionTransactionTemplet.totalRecords = res.data.length;
                setTableOptionTransaction({...tableOptionTransactionTemplet});
            });
    }
    const tableOptionTemplet = {
        headers: [
            { name: 'Location', prop: 'rentLocation' },
            { name: 'Rent Amount', prop: 'rentAmount' },
            { name: 'Installments', prop: 'installments' },
            { name: 'First Installment Date', prop: 'firstInstallmentDate' }
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            popupModelId: "add-rentLocation",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            },
            view: {
                modelId: 'add-rent-transaction',
                handler: getTransactionHandler
            }
        }
    };

    
    const saveButtonHandler = () => {

        setRentDetailModel({ ...rentDetailTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Holiday',
        items: [
            {
                title: "Rent Details",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Rent Details",
                icon: 'bx bx-plus',
                modelId: 'add-rentLocation',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.rentController.getAllDetail + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setRentDetailModel({ ...rentDetailTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const { rentLocationId,rentAmount,installments,firstInstallmentDate } = rentDetailModel;
        const newError = {};
        if (!rentLocationId || rentLocationId === 0) newError.rentLocationId = validationMessage.locationNameRequired;
        if (!rentAmount || rentAmount === 0) newError.rentAmount = validationMessage.rentAmountRequired;
        if (!installments || installments === 0) newError.installments = validationMessage.rentInstallmentRequired;
        if (!firstInstallmentDate || firstInstallmentDate === '') newError.firstInstallmentDate = validationMessage.rentInstallmentDateRequired;
        return newError;
    }

    useEffect(() => {
        Api.Get(apiUrls.rentController.getAllLocation)
            .then(res => {
                setRentLocations(res.data.data);
            })
            .catch(err => {

            });
    }, [])
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Rent Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-rentLocation" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Rent Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Rent Location" isRequired={true}></Label>
                                                <Dropdown name="rentLocationId" onChange={handleTextChange} value={rentDetailModel.rentLocationId} data={rentLocations} text="locationName"></Dropdown>
                                                <ErrorLabel message={errors?.rentLocationId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox isRequired={true} labelText="Rent Amount" min={0} max={9000000} onChangeHandler={handleTextChange} name="rentAmount" value={rentDetailModel.rentAmount} type="number" id='value' errorMessage={errors?.rentAmount} />
                                                <ErrorLabel message={errors?.rentAmount}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Installments" isRequired={true}></Label>
                                                <Dropdown name="installments" onChange={handleTextChange} value={rentDetailModel.installments} data={installmentList}></Dropdown>
                                                <ErrorLabel message={errors?.installments}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox isRequired={true} labelText="First Installment Date" onChangeHandler={handleTextChange} name="firstInstallmentDate" value={rentDetailModel.firstInstallmentDate} type="date" id='value' errorMessage={errors?.firstInstallmentDate} />
                                                <ErrorLabel message={errors?.firstInstallmentDate}></ErrorLabel>
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

            <div id="add-rent-transaction" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Rent Transaction Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <TableView option={tableOptionTransaction} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
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
