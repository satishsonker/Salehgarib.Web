import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import RegexFormat from '../../utils/RegexFormat';
import Breadcrumb from '../common/Breadcrumb';
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function MasterData() {
    const workTypeCode = 'work_type';
    const [masterDataTypeList, setMasterDataTypeList] = useState([]);
    const masterDataModelTemplate = {
        id: 0,
        code: '',
        value: '',
        masterDataType: ''
    }
    const [masterDataModel, setMasterDataModel] = useState(masterDataModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const [filterMasterDataType, setFilterMasterDataType] = useState("")
    const handleDelete = (id) => {
        Api.Delete(apiUrls.masterDataController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.masterDataController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }

    const handleTextChange = (e) => {
        var { value, name, type } = e.target;
        var data = masterDataModel;
        if (type === 'select-one') {
            data.masterDataType = value
        }
        else {
            data[name] = value;
            if (data.masterDataType !== workTypeCode)
                data.code = value.toLowerCase().trim().replaceAll(RegexFormat.specialCharectors, "_").replaceAll(RegexFormat.endWithHyphen, '');
        }
        setMasterDataModel({ ...data });

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

        let data = common.assignDefaultValue(masterDataModelTemplate, masterDataModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.masterDataController.add, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closePopupMasterData');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch(filterMasterDataType);
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.masterDataController.update, masterDataModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closePopupMasterData');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch(filterMasterDataType);
                }
            });
        }
    }
    const handleEdit = (masterDataId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.masterDataController.get + masterDataId).then(res => {
            if (res.data.id > 0) {
                var data = res.data;
                data.masterDataType = res.data.masterDataTypeCode;
                setMasterDataModel(data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Master Data Type', prop: 'masterDataTypeValue' },
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
            popupModelId: "add-masterData",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setMasterDataModel({ ...masterDataModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Master Data',
        items: [
            {
                title: "Master Data'",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Master Data",
                icon: 'bx bx-plus',
                modelId: 'add-masterData',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        setFilterMasterDataType('');
        Api.Get(apiUrls.masterDataController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
           ;
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setMasterDataModel({ ...masterDataModelTemplate });
        }
    }, [isRecordSaving]);
    useEffect(() => {
        Api.Get(apiUrls.masterDataController.getAllDataType + "?pageNo=1&PageSize=10000")
            .then(res => {
                setMasterDataTypeList(res.data.data);
            })
    }, [])


    const validateError = () => {
        const { value, masterDataType, code } = masterDataModel;
        const newError = {};
        if (!value || value === "") newError.value = validationMessage.masterDataRequired;
        if (!masterDataType || masterDataType === "") newError.masterDataType = validationMessage.masterDataTypeRequired;
        if (masterDataType === workTypeCode) {
            if (!code || code === "") newError.code = validationMessage.masterDataCodeRequired;
        }
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Master Data Deatils</h6>
            <label style={{ fontWeight: 'normal', width: '100%', textAlign: 'right', whiteSpace: 'nowrap', fontSize: '12px' }}>
                <span> Master Data Type  </span>
                <select className='form-control-sm' onChange={e => { handleSearch(e.target.value); setFilterMasterDataType(e.target.value) }} value={filterMasterDataType}>
                    <option value="">Select </option>
                    {
                        masterDataTypeList?.map(ele => {
                            return <option key={ele.id} value={ele.code}>{ele.value}</option>
                        })
                    }
                </select>
            </label>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-masterData" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Master Data</h5>
                            <button type="button" className="btn-close" id='closePopupMasterData' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Master Data Type" isRequired={true}></Label>
                                                <Dropdown data={masterDataTypeList} onChange={e => handleTextChange(e)} value={masterDataModel.masterDataType} name="masterDataType" elementKey="code" defaultText='Select Master Data Type' defaultValue=''></Dropdown>
                                                <ErrorLabel message={errors?.masterDataType}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox labelText="Master Data" isRequired={true} onChangeHandler={handleTextChange} name="value" value={masterDataModel.value} errorMessage={errors?.value} />
                                            </div>
                                            {masterDataModel.masterDataType === workTypeCode &&
                                                <div className="col-md-12">
                                                    <Inputbox labelText="Code" isRequired={true} onChangeHandler={handleTextChange} name="code" value={masterDataModel.code} errorMessage={errors?.code} />
                                                </div>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? 'save' : 'update'} onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" className="btn-sm" modelDismiss={true} />
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>

    )
}
