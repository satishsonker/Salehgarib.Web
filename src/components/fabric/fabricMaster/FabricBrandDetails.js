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

export default function FabricBrandDetails() {
    const fabricBrandModelTemplate = {
        "id": 0,
        "name": ''
    }
    const [fabricBrandModel, setFabricBrandModel] = useState(fabricBrandModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.fabricMasterController.brand.deleteBrand + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.fabricMasterController.brand.searchBrand + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = fabricBrandModel;
        data[name] = value.toUpperCase();
        setFabricBrandModel({ ...data });

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

        let data = common.assignDefaultValue(fabricBrandModelTemplate, fabricBrandModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.fabricMasterController.brand.addBrand, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricBrand');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.fabricMasterController.brand.updateBrand, fabricBrandModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabricBrand');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (brandId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.fabricMasterController.brand.getBrand + brandId).then(res => {
            if (res.data.id > 0) {
                setFabricBrandModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: headerFormat.fabricBrand,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-fabricBrand",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setFabricBrandModel({ ...fabricBrandModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Fabric Brand',
        items: [
            {
                title: "Fabric Brand'",
                icon: "bi bi-broadcast-pin",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Fabric Brand",
                icon: 'bx bx-plus',
                modelId: 'add-fabricBrand',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.fabricMasterController.brand.getAllBrand + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            ;
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setFabricBrandModel({ ...fabricBrandModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { name } = fabricBrandModel;
        const newError = {};
        if (!name || name === "") newError.name = validationMessage.fabricBrandNameRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Fabric Brand Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-fabricBrand" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Fabric Brand</h5>
                            <button type="button" className="btn-close" id='closeFabricBrand' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Inputbox type="text" labelText="Fabric Brand" isRequired={true} onChangeHandler={handleTextChange} name="name" value={fabricBrandModel.name} className="form-control-sm" errorMessage={errors?.name} />
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
