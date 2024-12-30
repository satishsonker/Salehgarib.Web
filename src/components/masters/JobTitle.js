import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import RegexFormat from '../../utils/RegexFormat';
import Breadcrumb from '../common/Breadcrumb';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';
export default function JobTitle() {
    const jobTitleModelTemplate = {
        "id": 0,
        "code": '',
        "value": ''
    }
    const [jobTitleModel, setJobTitleModel] = useState(jobTitleModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.masterController.jobTitle.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.masterController.jobTitle.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = jobTitleModel;
        data[name] = value.toUpperCase();
        if(!data.code || data.code==='')
        data.code = value.toLowerCase().trim().replaceAll(RegexFormat.specialCharectors, "_").replaceAll(RegexFormat.endWithHyphen, '');
        setJobTitleModel({ ...data });

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

        let data = common.assignDefaultValue(jobTitleModelTemplate, jobTitleModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.masterController.jobTitle.add, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeJobTitle');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.masterController.jobTitle.update, jobTitleModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeJobTitle');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (jobTitleId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.masterController.jobTitle.get + jobTitleId).then(res => {
            if (res.data.id > 0) {
                setJobTitleModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Job Title', prop: 'value' },
            { name: 'Job Title Code', prop: 'code' }
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
            popupModelId: "add-jobTitle",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setJobTitleModel({ ...jobTitleModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Job Title',
        items: [
            {
                title: "Job Title'",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Job Title",
                icon: 'bx bx-plus',
                modelId: 'add-jobTitle',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.masterController.jobTitle.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
           ;
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setJobTitleModel({ ...jobTitleModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { value } = jobTitleModel;
        const newError = {};
        if (!value || value === "") newError.value = validationMessage.jobTitleRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Job Title Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-jobTitle" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Job Title</h5>
                            <button type="button" className="btn-close" id='closeJobTitle' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Job Title" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="value" value={jobTitleModel.value} type="text" id='value' className="form-control" />
                                                <ErrorLabel message={errors?.value}></ErrorLabel>
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
