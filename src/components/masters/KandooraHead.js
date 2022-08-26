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

export default function KandooraHead() {const kandooraHeadModelTemplate = {
    id: 0,
  headName:"",
  displayOrder: 0
}
const [kandooraHeadModel, setKandooraHeadModel] = useState(kandooraHeadModelTemplate);
const [isRecordSaving, setIsRecordSaving] = useState(true);
const [pageNo, setPageNo] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [errors, setErrors] = useState();
const handleDelete = (id) => {
    Api.Delete(apiUrls.masterController.kandooraHead.delete + id).then(res => {
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
    Api.Get(apiUrls.masterController.kandooraHead.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
        tableOptionTemplet.data = res.data.data;
        tableOptionTemplet.totalRecords = res.data.totalRecords;
        setTableOption({ ...tableOptionTemplet });
    }).catch(err => {

    });
}

const handleTextChange = (e) => {
    var { value, name,type } = e.target;
    debugger;
    if(type==="number")
    value=parseInt(value);
    if(name==="headName")
    value=value.toUpperCase();
    setKandooraHeadModel({ ...kandooraHeadModel,[name]:value });

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
                common.closePopup();
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
                common.closePopup();
                toast.success(toastMessage.updateSuccess);
                handleSearch('');
            }
        }).catch(err => {
            toast.error(toastMessage.updateError);
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
    }).catch(err => {
        toast.error(toastMessage.getError);
    })
};

const tableOptionTemplet = {
    headers: [
        { name: 'Kandoora Expense Head Name', prop: 'headName' },
        { name: 'Head Display Order', prop: 'displayOrder' }
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
        popupModelId: "add-KandooraExpenseHead",
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
            modelId: 'add-KandooraExpenseHead',
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
    })
        .catch(err => {

        });
}, [pageNo, pageSize]);

useEffect(() => {
    if (isRecordSaving) {
        setKandooraHeadModel({ ...kandooraHeadModelTemplate });
    }
}, [isRecordSaving])

const validateError = () => {
    const { headName,displayOrder } = kandooraHeadModel;
    const newError = {};
    if (!headName || headName === "") newError.headName = validationMessage.kandooraHeadRequired;
    if (!displayOrder || displayOrder === 0) newError.displayOrder = validationMessage.displayOrderRequired;
    return newError;
}
  return (
    <>
    <Breadcrumb option={breadcrumbOption}></Breadcrumb>
    <h6 className="mb-0 text-uppercase">Kandoora expense Head Deatils</h6>
    <hr />
    <TableView option={tableOption}></TableView>

    {/* <!-- Add Contact Popup Model --> */}
    <div id="add-KandooraExpenseHead" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">New Kandoora Expense Head</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div className="modal-body">
                    <div className="form-horizontal form-material">
                        <div className="card">
                            <div className="card-body">
                                <form className="row g-3">
                                    <div className="col-md-12">
                                        <Label text="Kandoora Expense Head" isRequired={true}></Label>
                                        <input required onChange={e => handleTextChange(e)} name="headName" value={kandooraHeadModel.headName} type="text" id='vheadNamealue' className="form-control" />
                                        <ErrorLabel message={errors?.headName}></ErrorLabel>
                                    </div>
                                    <div className="col-md-12">
                                        <Label text="Display Order" helpText="Kandoora expense head will be displayed as per display order" isRequired={true}></Label>
                                        <input required onChange={e => handleTextChange(e)} name="displayOrder" value={kandooraHeadModel.displayOrder} type="number" min={1} id='displayOrder' className="form-control" />
                                        <ErrorLabel message={errors?.displayOrder}></ErrorLabel>
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
