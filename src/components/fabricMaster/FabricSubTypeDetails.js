import React, { useState, useEffect } from 'react'
import { toastMessage } from '../../constants/ConstantValues';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toast } from 'react-toastify';
import Breadcrumb from '../common/Breadcrumb';
import Inputbox from '../common/Inputbox';
import { validationMessage } from '../../constants/validationMessage';
import TableView from '../tables/TableView';
import ButtonBox from '../common/ButtonBox';
import { common } from '../../utils/common';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import { headerFormat } from '../../utils/tableHeaderFormat';

export default function FabricSubTypeDetails() {
    const fabricSubTypeModelTemplate = {
        id: 0,
        name: '',
        fabricTypeId: 0
    }
    const [fabricSubTypeModel, setFabricSubTypeModel] = useState(fabricSubTypeModelTemplate);
    const [fabricTypeList, setFabricTypeList] = useState([])
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.fabricMasterController.subType.deleteSubType + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.fabricMasterController.subType.searchSubType + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name, type } = e.target;
        var data = fabricSubTypeModel;
        if (type === 'select-one') {
            data[name] = parseInt(value);
        }
        else {
            data[name] = value.toUpperCase();
        }
        setFabricSubTypeModel({ ...data });

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
        else{
            setErrors({});
        }

        let data = common.assignDefaultValue(fabricSubTypeModelTemplate, fabricSubTypeModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.fabricMasterController.subType.addSubType, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricType');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.fabricMasterController.subType.updateSubType, fabricSubTypeModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricType');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (typeId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.fabricMasterController.subType.getSubType + typeId).then(res => {
            if (res.data.id > 0) {
                setFabricSubTypeModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: headerFormat.fabricSubType,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-fabricType",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setFabricSubTypeModel({ ...fabricSubTypeModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Fabric Sub Type',
        items: [
            {
                title: "Fabric Sub Type'",
                icon: "bi bi-broadcast-pin",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Fabric Sub Type",
                icon: 'bx bx-plus',
                modelId: 'add-fabricType',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.fabricMasterController.subType.getAllSubType + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            ;
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setFabricSubTypeModel({ ...fabricSubTypeModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { name,fabricTypeId } = fabricSubTypeModel;
        const newError = {};
        if (!name || name === "") newError.name = validationMessage.fabricSubTypeNameRequired;
        if (!fabricTypeId || fabricTypeId === 0) newError.fabricTypeId = validationMessage.fabricTypeNameRequired;
        return newError;
    }

    useEffect(() => {
        Api.Get(apiUrls.fabricMasterController.type.getAllType + "?pageNo=1&pageSize=10000000")
            .then(res => {
                setFabricTypeList([...res.data.data]);
            });
    }, []);

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Fabric Sub Type Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-fabricType" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Fabric Sub Type</h5>
                            <button type="button" className="btn-close" id='closeFabricType' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Fabric Type" isRequired={true} fontSize='12px' />
                                                <Dropdown data={fabricTypeList} text="name" isRequired={true} onChange={handleTextChange} name="fabricTypeId" value={fabricSubTypeModel.fabricTypeId} className="form-control-sm" />
                                                <ErrorLabel message={errors?.fabricTypeId} />
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox type="text" labelText="Fabric Sub Type" isRequired={true} onChangeHandler={handleTextChange} name="name" value={fabricSubTypeModel.name} className="form-control-sm" errorMessage={errors?.name} />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? 'Save' : 'Update'} text={isRecordSaving ? 'Save' : 'Update'} onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} modalId="closePopup" className="btn-sm" />
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
