import React, { useState, useEffect } from 'react'
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import Breadcrumb from '../../common/Breadcrumb';
import Inputbox from '../../common/Inputbox';
import ButtonBox from '../../common/ButtonBox';
import { common } from '../../../utils/common';
import { toast } from 'react-toastify';
import { toastMessage } from '../../../constants/ConstantValues';
import { validationMessage } from '../../../constants/validationMessage';
import TableView from '../../tables/TableView';

export default function FabricDiscountType() {
    const fabricDiscountModelTemplate = {
        id: 0,
        name: '',
        code: '',
    }
    const [fabricDiscountModel, setFabricDiscountModel] = useState(fabricDiscountModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageDiscount, setPageDiscount] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.fabricMasterController.discountType.deleteDiscountType + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.fabricMasterController.discountType.searchDiscountType + `?PageNo=${pageNo}&PageDiscount=${pageDiscount}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = fabricDiscountModel;
        if (name === 'name' && isRecordSaving) {
            data['code'] = common.generateMasterDataCode(value.trim())
        }
        data[name] = value.toUpperCase();
        setFabricDiscountModel({ ...data });

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

        let data = common.assignDefaultValue(fabricDiscountModelTemplate, fabricDiscountModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.fabricMasterController.discountType.addDiscountType, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricDiscount');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.fabricMasterController.discountType.updateDiscountType, fabricDiscountModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricDiscount');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (discountId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.fabricMasterController.discountType.getDiscountType + discountId).then(res => {
            if (res.data.id > 0) {
                setFabricDiscountModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: headerFormat.fabricDiscount,
        data: [],
        totalRecords: 0,
        pageDiscount: pageDiscount,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageDiscount: setPageDiscount,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-fabricDiscount",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {
        setFabricDiscountModel({ ...fabricDiscountModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Fabric Discount Type',
        items: [
            {
                title: "Fabric Discount Type'",
                icon: "bi bi-broadcast-pin",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Fabric Discount Type",
                icon: 'bx bx-plus',
                modelId: 'add-fabricDiscount',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.fabricMasterController.discountType.getAllDiscountType + `?PageNo=${pageNo}&PageDiscount=${pageDiscount}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [pageNo, pageDiscount]);

    useEffect(() => {
        if (isRecordSaving) {
            setFabricDiscountModel({ ...fabricDiscountModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { name, code } = fabricDiscountModel;
        const newError = {};
        if (!name || name === "") newError.name = validationMessage.fabricDiscountNameRequired;
        if (!code || code === "") newError.code = validationMessage.fabricDiscountCodeRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Fabric Discount Type Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-fabricDiscount" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Fabric Discount Type</h5>
                            <button type="button" className="btn-close" id='closeFabricDiscount' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Inputbox type="text" labelText="Sale Mode Name" isRequired={true} onChangeHandler={handleTextChange} name="name" value={fabricDiscountModel.name} className="form-control-sm" errorMessage={errors?.name} />
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox type="text" labelText="Sale Mode Code" disabled={true} isRequired={true} onChangeHandler={handleTextChange} name="code" value={fabricDiscountModel.code} className="form-control-sm" errorMessage={errors?.code} />
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


