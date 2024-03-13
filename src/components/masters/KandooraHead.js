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
import { headerFormat } from '../../utils/tableHeaderFormat';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';

export default function KandooraHead() {
    const kandooraHeadModelTemplate = {
        id: 0,
        headName: "",
        displayOrder: 0
    }
    const [kandooraHeadModel, setKandooraHeadModel] = useState(kandooraHeadModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.masterController.kandooraHead.delete + id).then(res => {
            if (res.data>0) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        })
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.masterController.kandooraHead.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
    }

    const handleTextChange = (e) => {
        var { value, name, type } = e.target;

        if (type === "number")
            value = parseInt(value);
        if (name === "headName")
            value = value.toUpperCase();
        setKandooraHeadModel({ ...kandooraHeadModel, [name]: value });

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

        let data = common.assignDefaultValue(kandooraHeadModelTemplate, kandooraHeadModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.masterController.kandooraHead.add, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('addKandooraExpenseHeadClose');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.masterController.kandooraHead.update, kandooraHeadModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('addKandooraExpenseHeadClose');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            });
        }
    }
    const handleEdit = (kandooraHeadId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.masterController.kandooraHead.get + kandooraHeadId).then(res => {
            if (res.data.id > 0) {
                setKandooraHeadModel(res.data);
            }
        })
    };

    const tableOptionTemplet = {
        headers:headerFormat.kandooraExpHead,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "addKandooraExpenseHead",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setKandooraHeadModel({ ...kandooraHeadModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Kandoora Expense Head',
        items: [
            {
                title: "Kandoora Expense Head",
                icon: "bi bi-eyeglasses",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Kandoora Expense Head",
                icon: 'bx bx-plus',
                modelId: 'addKandooraExpenseHead',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.masterController.kandooraHead.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setKandooraHeadModel({ ...kandooraHeadModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { headName, displayOrder } = kandooraHeadModel;
        const newError = {};
        if (!headName || headName === "") newError.headName = validationMessage.kandooraHeadRequired;
        if (!displayOrder || displayOrder === 0) newError.displayOrder = validationMessage.displayOrderRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="addKandooraExpenseHead" className="modal fade in" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addKandooraExpenseHead" aria-hidden="true">
                <div className="modal-dialog" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Kandoora Expense Head</h5>
                            <button type="button" id='addKandooraExpenseHeadClose' className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <Inputbox labelText="Kandoora Expense Head" errorMessage={errors?.headName} isRequired={true} onChangeHandler={handleTextChange} name="headName" value={kandooraHeadModel.headName} type="text" id='vheadNamealue' className="form-control-sm" />
                                             </div>
                                            <div className="col-md-12">
                                                <Inputbox 
                                                labelTextHelp="Kandoora expense head will be displayed as per display order" isRequired={true}  
                                                labelText="Display Order" 
                                                errorMessage={errors?.displayOrder} 
                                                onChangeHandler={e => handleTextChange(e)} 
                                                name="displayOrder" 
                                                value={kandooraHeadModel.displayOrder} 
                                                type="number" min={1} 
                                                id='displayOrder' 
                                                className="form-control-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="save" text={isRecordSaving ? 'save' : 'update'} onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" className="btn-sm" id='closePopup' modelDismiss={true} data-bs-dismiss="modal" modalId="#addKandooraExpenseHead"/>
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
