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
import Dropdown from '../common/Dropdown';

export default function HolidayName() {
    const holidayNameTemplate = {
        id: 0,
        code: '',
        value: '',
        holidayTypeId: 0
    }
    const [holidayNameModel, setHolidayNameModel] = useState(holidayNameTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const [holidayTypeList, setHolidayTypeList] = useState([])
    const handleDelete = (id) => {
        Api.Delete(apiUrls.holidayController.deleteHolidayName + id).then(res => {
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
        Api.Get(apiUrls.holidayController.searchHolidayName + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = holidayNameModel;
        if (name === 'holidayTypeId') {
            data[name] = parseInt(value);
        }
        else {
            data[name] = value.toUpperCase();
            data.code = value.toLowerCase().trim().replaceAll(RegexFormat.specialCharectors, "_").replaceAll(RegexFormat.endWithHyphen, '');
        }
        setHolidayNameModel({ ...data });

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

        let data = common.assignDefaultValue(holidayNameTemplate, holidayNameModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.holidayController.addHolidayName, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-holidayName');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.holidayController.updateHolidayName, holidayNameModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-holidayName');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (holidayNameId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.holidayController.getHolidayName + holidayNameId).then(res => {
            if (res.data.id > 0) {
                setHolidayNameModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Holiday Name', prop: 'value' },
            { name: 'Holiday Type', prop: 'holidayType' },
            { name: 'Code', prop: 'code' }
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
            popupModelId: "add-holidayName",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setHolidayNameModel({ ...holidayNameTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Holiday',
        items: [
            {
                title: "Holiday Name'",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Holiday Name",
                icon: 'bx bx-plus',
                modelId: 'add-holidayName',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.holidayController.getAllHolidayName + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        Api.Get(apiUrls.holidayController.getAllHolidayType)
            .then(res => {
                setHolidayTypeList(res.data.data);
            })
    }, [])


    useEffect(() => {
        if (isRecordSaving) {
            setHolidayNameModel({ ...holidayNameTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const { value,holidayTypeId } = holidayNameModel;
        const newError = {};
        if (!value || value === "") newError.value = validationMessage.holidayNameRequired;
        if (!holidayTypeId || holidayTypeId === 0|| holidayTypeId === "") newError.holidayTypeId = validationMessage.holidayTypeRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Holiday Name Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-holidayName" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Holiday Name</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Holiday Name" isRequired={true}></Label>
                                                <Dropdown onChange={handleTextChange} data={holidayTypeList} name="holidayTypeId" value={holidayNameModel.holidayTypeId} className="form-control" />
                                                <ErrorLabel message={errors?.holidayTypeId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Holiday Name" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="value" value={holidayNameModel.value} type="text" id='value' className="form-control" />
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
