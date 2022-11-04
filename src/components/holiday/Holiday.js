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
export default function Holiday() {
    const holidayModelTemplate = {
        id: 0,
        holidayNameId: 0,
        holidayDate: common.getHtmlDate(new Date()),
        year: new Date().getFullYear(),
        recurringEveryYear: true
    }
    const [holidayModel, setHolidayModel] = useState(holidayModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [errors, setErrors] = useState();
    const [holidayTypeList, setHolidayTypeList] = useState([]);
    const holidayYear = common.numberRangerForDropDown(new Date().getFullYear(), new Date().getFullYear() + 10);
    const handleDelete = (id) => {
        Api.Delete(apiUrls.holidayController.deleteHoliday + id).then(res => {
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
        Api.Get(apiUrls.holidayController.searchHoliday + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name, checked, type } = e.target;
        var data = holidayModel;
        debugger;
        if (name === 'holidayNameId') {
            data[name] = parseInt(value);
        }
        else if (name === 'holidayDate') {
            data.year = new Date(value).getFullYear();
            data[name] = value;
        }
        else if (name === 'year') {
            data.holidayDate = common.getHtmlDate(new Date(`${value}-01-01`));
            data[name] = parseInt(value);
        }
        else if (type === 'checkbox') {
            data[name] = checked;
        }
        else {
            data[name] = value.toUpperCase();
            data.code = value.toLowerCase().trim().replaceAll(RegexFormat.specialCharectors, "_").replaceAll(RegexFormat.endWithHyphen, '');
        }
        setHolidayModel({ ...data });

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

        let data = common.assignDefaultValue(holidayModelTemplate, holidayModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.holidayController.addHoliday, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-holiday');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.holidayController.updateHoliday, holidayModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-holiday');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (holidayId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.holidayController.getHoliday + holidayId).then(res => {
            if (res.data.id > 0) {
                let data = res.data;
                data.holidayDate = common.getHtmlDate(data?.holidayDate);
                setHolidayModel(data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Holiday Name', prop: 'holidayName' },
            { name: 'Holiday Type', prop: 'holidayType' },
            { name: 'Date', prop: 'holidayDate' },
            { name: 'Year', prop: 'year' },
            { name: 'Recurring Every Year', prop: 'recurringEveryYear', action: { replace: { true: "Yes", false: "No" } } }
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
            popupModelId: "add-holiday",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setHolidayModel({ ...holidayModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Holiday',
        items: [
            {
                title: "Holiday",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Holiday Name",
                icon: 'bx bx-plus',
                modelId: 'add-holiday',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.holidayController.getAllHoliday + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        Api.Get(apiUrls.holidayController.getAllHolidayName)
            .then(res => {
                setHolidayTypeList(res.data.data);
            })
    }, []);


    useEffect(() => {
        if (isRecordSaving) {
            setHolidayModel({ ...holidayModelTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const { year, holidayDate, holidayNameId } = holidayModel;
        const newError = {};
        if (!year || year === 0 || year === "") newError.year = validationMessage.holidayYearRequired;
        if (!holidayDate || holidayDate === "") newError.holidayDate = validationMessage.holidayDateRequired;
        if (!holidayNameId || holidayNameId === 0 || holidayNameId === "") newError.holidayNameId = validationMessage.holidayNameRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Holiday Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-holiday" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Holiday</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Holiday Name" isRequired={true}></Label>
                                                <Dropdown onChange={handleTextChange} data={holidayTypeList} name="holidayNameId" value={holidayModel.holidayNameId} className="form-control" />
                                                <ErrorLabel message={errors?.holidayNameId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Holiday Date" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="holidayDate" value={holidayModel.holidayDate} type="date" className="form-control" />
                                                <ErrorLabel message={errors?.holidayDate}></ErrorLabel>
                                            </div>
                                            {/* <div className="col-md-12">
                                                <Label text="Holiday Year" isRequired={true}></Label>
                                                <Dropdown onChange={handleTextChange} data={holidayYear} name="year" value={holidayModel.year} className="form-control" />
                                                <ErrorLabel message={errors?.year}></ErrorLabel>
                                            </div> */}
                                            <div className="col-md-12">
                                                <Label text="Recurring Every Year" helpText="Holiday on same date at every year."></Label>
                                                <div className="form-check">
                                                    <input className="form-check-input" name='recurringEveryYear' onChange={e => handleTextChange(e)} type="checkbox" checked={holidayModel.recurringEveryYear} id="gridCheck2" />
                                                    <label className="form-check-label" htmlFor="gridCheck2">Recurring Every Year</label>
                                                </div>
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
