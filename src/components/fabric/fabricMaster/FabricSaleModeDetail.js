import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toastMessage } from '../../../constants/ConstantValues';
import { common } from '../../../utils/common';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import { validationMessage } from '../../../constants/validationMessage';
import Inputbox from '../../common/Inputbox';
import ButtonBox from '../../common/ButtonBox';
import Breadcrumb from '../../common/Breadcrumb';
import TableView from '../../tables/TableView';

export default function FabricSaleModeDetail() {
    const fabricSaleModeModelTemplate = {
        id: 0,
        name: '',
        code: '',
        minSaleAmount: 0,
        maxSaleAmount: 0,
        title: ''
    }
    const [fabricSaleModeModel, setFabricSaleModeModel] = useState(fabricSaleModeModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSaleMode, setPageSaleMode] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.fabricMasterController.saleMode.deleteSaleMode + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.fabricMasterController.saleMode.searchSaleMode + `?PageNo=${pageNo}&PageSaleMode=${pageSaleMode}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        debugger;
        var { value, name, type } = e.target;
        var data = fabricSaleModeModel;

        if (type === 'number') {
            data[name] = parseFloat(value)
        } else {
            if(name==='name' && isRecordSaving)
            {
                data['code'] =common.generateMasterDataCode(value.trim())
            }
            data[name] = value.toUpperCase();
        }
        setFabricSaleModeModel({ ...data });

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

        let data = common.assignDefaultValue(fabricSaleModeModelTemplate, fabricSaleModeModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.fabricMasterController.saleMode.addSaleMode, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricSaleMode');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.fabricMasterController.saleMode.updateSaleMode, fabricSaleModeModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricSaleMode');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (saleModeId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.fabricMasterController.saleMode.getSaleMode + saleModeId).then(res => {
            if (res.data.id > 0) {
                setFabricSaleModeModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: headerFormat.fabricSaleMode,
        data: [],
        totalRecords: 0,
        pageSaleMode: pageSaleMode,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSaleMode: setPageSaleMode,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-fabricSaleMode",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {
        setFabricSaleModeModel({ ...fabricSaleModeModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Fabric Sale Mode',
        items: [
            {
                title: "Fabric Sale Mode'",
                icon: "bi bi-broadcast-pin",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Fabric Sale Mode",
                icon: 'bx bx-plus',
                modelId: 'add-fabricSaleMode',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.fabricMasterController.saleMode.getAllSaleMode + `?PageNo=${pageNo}&PageSaleMode=${pageSaleMode}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [pageNo, pageSaleMode]);

    useEffect(() => {
        if (isRecordSaving) {
            setFabricSaleModeModel({ ...fabricSaleModeModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { name, code, minSaleAmount } = fabricSaleModeModel;
        const newError = {};
        if (!name || name === "") newError.name = validationMessage.fabricSaleModeNameRequired;
        if (!code || code === "") newError.code = validationMessage.fabricSaleModeCodeRequired;
        if (!minSaleAmount || minSaleAmount === "") newError.minSaleAmount = validationMessage.fabricSaleModeMinSaleAmountRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Fabric Sale Mode Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-fabricSaleMode" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Fabric Sale Mode</h5>
                            <button type="button" className="btn-close" id='closeFabricSaleMode' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Inputbox type="text" labelText="Sale Mode Name" isRequired={true} onChangeHandler={handleTextChange} name="name" value={fabricSaleModeModel.name} className="form-control-sm" errorMessage={errors?.name} />
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox type="text" labelText="Sale Mode Code" disabled={true} isRequired={true} onChangeHandler={handleTextChange} name="code" value={fabricSaleModeModel.code} className="form-control-sm" errorMessage={errors?.code} />
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox type="number" min={0.0} labelText="Min Sale Amount" isRequired={true} onChangeHandler={handleTextChange} name="minSaleAmount" value={fabricSaleModeModel.minSaleAmount} className="form-control-sm" errorMessage={errors?.minSaleAmount} />
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox type="number" min={0.0} labelText="Max Sale Amount" onChangeHandler={handleTextChange} name="maxSaleAmount" value={fabricSaleModeModel.maxSaleAmount} className="form-control-sm" errorMessage={errors?.maxSaleAmount} />
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox type="text" labelText="Title" onChangeHandler={handleTextChange} name="title" value={fabricSaleModeModel.title} className="form-control-sm" errorMessage={errors?.title} />
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


