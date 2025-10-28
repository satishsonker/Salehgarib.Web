import Breadcrumb from '../common/Breadcrumb'
import ErrorLabel from '../common/ErrorLabel'
import Label from '../common/Label'
import TableView from '../tables/TableView'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Inputbox from '../common/Inputbox'
import ButtonBox from '../common/ButtonBox'
import Dropdown from '../common/Dropdown'
import { headerFormat } from '../../utils/tableHeaderFormat'

export default function WorkDescription() {
    const workDescriptionTemplate = {
        id: 0,
        code: '',
        value: ''
    }
    const [workDescriptionModel, setWorkDescriptionModel] = useState(workDescriptionTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const [workTypeList, setWorkTypeList] = useState([]);

    const handleDelete = (id) => {
        Api.Delete(apiUrls.workDescriptionController.deleteWorkDescription + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }

    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.workDescriptionController.searchWorkDescription + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = workDescriptionModel;
        data[name] = value.toUpperCase();
        setWorkDescriptionModel({ ...data });

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

        let data = common.assignDefaultValue(workDescriptionTemplate, workDescriptionModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.workDescriptionController.addWorkDescription, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-workDescription');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.workDescriptionController.updateWorkDescription, workDescriptionModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-workDescription');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }

    const handleEdit = (workDescriptionId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.workDescriptionController.getWorkDescription + workDescriptionId).then(res => {
            if (res.data.id > 0) {
                setWorkDescriptionModel(res.data);
            }
        });
    };

    useEffect(() => {
        Api.Get(apiUrls.masterDataController.getByMasterDataType + "?masterdatatype=work_type")
            .then(res => {
                setWorkTypeList([...res.data]);
            });
    }, []);

    const customColumn = (row, header) => {
        var val = row[header.prop];
        if (workTypeList.length === 0)
            return "";
        return workTypeList.find(x => x.code === val).value;
    }

    const tableOptionTemplet = {
        headers:headerFormat.workDescription,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-workDescription",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };
    tableOptionTemplet.headers[1].customColumn = customColumn;

    const saveButtonHandler = () => {

        setWorkDescriptionModel({ ...workDescriptionTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    const breadcrumbOption = {
        title: 'Work Description',
        items: [
            {
                title: "Work Description Type'",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Work Description Type",
                icon: 'bx bx-plus',
                modelId: 'add-workDescription',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.workDescriptionController.getAllWorkDescription + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setWorkDescriptionModel({ ...workDescriptionTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const { value, code } = workDescriptionModel;
        const newError = {};
        if (!value || value === "") newError.value = validationMessage.workDescriptionRequired;
        if (!code || code === "") newError.code = validationMessage.workTypeRequired;
        return newError;
    }
    
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Work Description Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-workDescription" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Work Description</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Work Type"></Label>
                                                <Dropdown name="code" data={workTypeList} elementKey="code" onChange={handleTextChange} value={workDescriptionModel.code} className="form-control-sm" />
                                                <ErrorLabel message={errors?.code} />
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox errorMessage={errors?.value} labelText="Work Description" name="value" onChangeHandler={handleTextChange} className="form-control-sm" value={workDescriptionModel.value} />
                                                <div className='text-muted' style={{ fontSize: '9px' }}>Use comma (,) to separate value for multiple entries</div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="save" text={isRecordSaving ? 'Save' : 'Update'} onClickHandler={handleSave} />
                            <ButtonBox type="cancel" modelDismiss={true} id="closePopup" />
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
