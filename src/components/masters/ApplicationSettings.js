import React, { useEffect, useState } from 'react'
import { apiUrls } from '../../apis/ApiUrls';
import { Api } from '../../apis/Api';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import { validationMessage } from '../../constants/validationMessage';
import TableView from '../tables/TableView';
import Label from '../common/Label';
import Inputbox from '../common/Inputbox';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import RegexFormat from '../../utils/RegexFormat';
import ButtonBox from '../common/ButtonBox';
import Breadcrumb from '../common/Breadcrumb';

export default function ApplicationSettings() {
    const applicationSettingModelTemplate = {
        id: 0,
        key: '',
        value: '',
        section: '',
        extraSetting: ''
    }
    const [applicationSettingModel, setApplicationSettingModel] = useState(applicationSettingModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [sectionList, setSectionList] = useState([])
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();

    useEffect(() => {
        Api.Get(apiUrls.masterDataController.getByMasterDataType + "?MasterDataType=appsetting_section")
            .then(res => {
                setSectionList(res.data);
            });
    }, []);


    const handleDelete = (id) => {
        Api.Delete(apiUrls.applicationSettingController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.applicationSettingController.search + `?SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data;
            tableOptionTemplet.totalRecords = res.data?.length ?? 0;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        if (name === 'key')
            value = value.toLowerCase().trim();

        setApplicationSettingModel({ ...applicationSettingModel, [name]: value });

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
        if (isRecordSaving) {
            debugger;
            var model = [];
            model.push(applicationSettingModel);
            Api.Put(apiUrls.applicationSettingController.add, model).then(res => {
                if (res.data==true) {
                    common.closePopup('closeApplicationSetting');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.applicationSettingController.update, applicationSettingModel).then(res => {
                if (res.data === true) {
                    common.closePopup('closeApplicationSetting');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (id, data) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.applicationSettingController.getByKey + `?key=${data?.key}`).then(res => {
            if (res.data?.id > 0) {
                setApplicationSettingModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Section', prop: 'section' },
            { name: 'Key', prop: 'key' },
            { name: 'Value', prop: 'value' },
            { name: 'Extra Setting', prop: 'extraSetting' }
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
            popupModelId: "add-appSettings",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setApplicationSettingModel({ ...applicationSettingModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Application Settings',
        items: [
            {
                title: "Application Settings'",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Application Settings",
                icon: 'bx bx-plus',
                modelId: 'add-appSettings',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.applicationSettingController.getAll).then(res => {
            tableOptionTemplet.data = res.data;
            tableOptionTemplet.totalRecords = res.data?.length;
            setTableOption({ ...tableOptionTemplet });
        })
            ;
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setApplicationSettingModel({ ...applicationSettingModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { value, key, section } = applicationSettingModel;
        const newError = {};
        if (!section || section === "") newError.section = validationMessage.sectionRequired;
        if (!value || value === "") newError.value = validationMessage.valueRequired;
        if (!key || key === "") newError.key = validationMessage.keyRequired;
        else if (key.length < 3) newError.key = validationMessage.keyInvalidLength;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Application Settings Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-appSettings" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Application Settings</h5>
                            <button type="button" className="btn-close" id='closeApplicationSetting' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <Label text="Section" isRequired={true} />
                                                <Dropdown data={sectionList} elementKey="value" onChange={handleTextChange} name="section" value={applicationSettingModel.section} className="form-control-sm" />
                                                <ErrorLabel message={errors?.section} />
                                            </div>
                                            <div className="col-12">
                                                <Inputbox onChangeHandler={handleTextChange} name="key" value={applicationSettingModel.key} labelText="Key Name" isRequired={true} className="form-control-sm" errorMessage={errors?.key} />
                                            </div>
                                            <div className="col-12">
                                                <Inputbox onChangeHandler={handleTextChange} name="value" value={applicationSettingModel.value} labelText="Value" isRequired={true} className="form-control-sm" errorMessage={errors?.value} />
                                            </div>
                                            <div className="col-12">
                                                <Label text="Extra Setting (In JSON format only)" />
                                                <textarea style={{ width: '100%', resize: 'none' }} rows={5} onChange={e => handleTextChange(e)} name="extraSetting" value={applicationSettingModel.extraSetting} className="form-control-sm" />
                                                <ErrorLabel message={errors?.extraSetting} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? 'save' : 'update'} onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} modalId="closeApplicationSetting" className="btn-sm" />
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
