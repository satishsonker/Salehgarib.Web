import React, { useState,useEffect } from 'react'
import { toastMessage } from '../../../constants/ConstantValues';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toast } from 'react-toastify';
import Breadcrumb from '../../common/Breadcrumb';
import Inputbox from '../../common/Inputbox';
import { validationMessage } from '../../../constants/validationMessage';
import TableView from '../../tables/TableView';
import ButtonBox from '../../common/ButtonBox';
import { common } from '../../../utils/common';
import { headerFormat } from '../../../utils/tableHeaderFormat';

export default function FabricSizeDetails() {
    const fabricSizeModelTemplate = {
        "id": 0,
        "name": ''
    }
    const [fabricSizeModel, setFabricSizeModel] = useState(fabricSizeModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.fabricMasterController.size.deleteSize + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.fabricMasterController.size.searchSize + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = fabricSizeModel;
        data[name] = value.toUpperCase();
        setFabricSizeModel({ ...data });

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

        let data = common.assignDefaultValue(fabricSizeModelTemplate, fabricSizeModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.fabricMasterController.size.addSize, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricSize');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.fabricMasterController.size.updateSize, fabricSizeModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricSize');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (sizeId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.fabricMasterController.size.getSize + sizeId).then(res => {
            if (res.data.id > 0) {
                setFabricSizeModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: headerFormat.fabricSize,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-fabricSize",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setFabricSizeModel({ ...fabricSizeModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Fabric Size',
        items: [
            {
                title: "Fabric Size'",
                icon: "bi bi-broadcast-pin",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Fabric Size",
                icon: 'bx bx-plus',
                modelId: 'add-fabricSize',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.fabricMasterController.size.getAllSize + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            ;
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setFabricSizeModel({ ...fabricSizeModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { name } = fabricSizeModel;
        const newError = {};
        if (!name || name === "") newError.name = validationMessage.fabricSizeNameRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Fabric Size Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-fabricSize" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Fabric Size</h5>
                            <button type="button" className="btn-close" id='closeFabricSize' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Inputbox type="text" labelText="Fabric Size" isRequired={true} onChangeHandler={handleTextChange} name="name" value={fabricSizeModel.name} className="form-control-sm" errorMessage={errors?.name} />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? 'Save' : 'Update'} text={isRecordSaving ? 'Save' : 'Update'} onClickHandler={handleSave}  className="btn-sm"/>
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

