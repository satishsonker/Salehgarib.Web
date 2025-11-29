import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import TableView from '../tables/TableView';
import ButtonBox from '../common/ButtonBox';
import Inputbox from '../common/Inputbox';
import { useNavigate } from 'react-router-dom';

export default function MasterDataType() {  
    let navigate = useNavigate();
    const masterDataModelTemplate = {
        id: 0,
        code: '',
        value: ''
    }
    const [masterDataTypeModel, setMasterDataTypeModel] = useState(masterDataModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.masterDataController.deleteDataType + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.masterDataController.searchDataType + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = masterDataTypeModel;
        data[name] = value;
        data.code = common.generateMasterDataCode(value);
        setMasterDataTypeModel({ ...data });

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

        let data = common.assignDefaultValue(masterDataModelTemplate, masterDataTypeModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.masterDataController.addDataType, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-masterDataType');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.masterDataController.updateDataType, masterDataTypeModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-masterDataType');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (masterDataId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.masterDataController.getDataType + masterDataId).then(res => {
            if (res.data.id > 0) {
                setMasterDataTypeModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Value', prop: 'value' },
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
            popupModelId: "add-masterDataType",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setMasterDataTypeModel({ ...masterDataModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    const redirectHandler = () => {
        navigate('/master-data');
    }

    const breadcrumbOption = {
        title: 'Master Data',
        items: [
            {
                title: "Master Data Type'",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Master Data Type",
                icon: 'bx bx-plus',
                modelId: 'add-masterDataType',
                handler: saveButtonHandler
            },
            {
                text: "Master Data",
                icon: 'bx bx-plus',
                handler: redirectHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.masterDataController.getAllDataType + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
           ;
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setMasterDataTypeModel({ ...masterDataModelTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const { value } = masterDataTypeModel;
        const newError = {};
        if (!value || value === "") newError.value = validationMessage.masterDataRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Master Data Type Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-masterDataType" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Master Data Type</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <Inputbox labelText="Master Data" labelFontSize="12px" isRequired={true} errorMessage={errors?.value}  onChangeHandler={handleTextChange} name="value" value={masterDataTypeModel.value} type="text" id='value' className="form-control-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? 'Save' : 'Update'} className="btn-sm" onClickHandler={handleSave}/>
                            <ButtonBox type="cancel" modelDismiss={true}  className="btn-sm" id='closePopup'/>
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>

    )
}
