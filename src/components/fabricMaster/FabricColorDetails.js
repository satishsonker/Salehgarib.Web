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
import { headerFormat } from '../../utils/tableHeaderFormat';

export default function FabricColorDetails() {
    const fabricColorModelTemplate = {
        id: 0,
        colorName: '',
        colorCode: ''
    }
    const [fabricColorModel, setFabricColorModel] = useState(fabricColorModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.fabricMasterController.color.deleteColor + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.fabricMasterController.color.searchColor + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name, type } = e.target;
        var data = fabricColorModel;
            data[name] = value.toUpperCase();
        setFabricColorModel({ ...data });

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

        let data = common.assignDefaultValue(fabricColorModelTemplate, fabricColorModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.fabricMasterController.color.addColor, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricColor');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.fabricMasterController.color.updateColor, fabricColorModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricColor');
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
        Api.Get(apiUrls.fabricMasterController.color.getColor + typeId).then(res => {
            if (res.data.id > 0) {
                setFabricColorModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: headerFormat.fabricColor,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-fabricColor",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setFabricColorModel({ ...fabricColorModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Fabric Color',
        items: [
            {
                title: "Fabric Color'",
                icon: "bi bi-broadcast-pin",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Fabric Color",
                icon: 'bx bx-plus',
                modelId: 'add-fabricColor',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.fabricMasterController.color.getAllColor + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            ;
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setFabricColorModel({ ...fabricColorModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { colorName } = fabricColorModel;
        const newError = {};
        if (!colorName || colorName === "") newError.colorName = validationMessage.fabricColorNameRequired;
        return newError;
    }

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Fabric Color Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-fabricColor" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Fabric Color</h5>
                            <button type="button" className="btn-close" id='closeFabricColor' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Inputbox type="text" labelText="Fabric Color" isRequired={true} onChangeHandler={handleTextChange} name="colorName" value={fabricColorModel.colorName} className="form-control-sm" errorMessage={errors?.colorName} />
                                            </div>

                                            <div className="col-md-12">
                                                <Inputbox type="text" labelText="Fabric Code" isRequired={true} onChangeHandler={handleTextChange} name="colorCode" value={fabricColorModel.colorCode} className="form-control-sm" errorMessage={errors?.colorCode} />
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
