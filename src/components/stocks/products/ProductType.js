import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toastMessage } from '../../../constants/ConstantValues';
import { validationMessage } from '../../../constants/validationMessage';
import { common } from '../../../utils/common';
import RegexFormat from '../../../utils/RegexFormat';
import Breadcrumb from '../../common/Breadcrumb';
import ErrorLabel from '../../common/ErrorLabel';
import Label from '../../common/Label';
import TableView from '../../tables/TableView';

export default function ProductType() {
    const productTypeTemplate = {
        id: 0,
        code: '',
        value: ''
    }
    const [productTypeModel, setProductTypeModel] = useState(productTypeTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.productController.deleteType + id).then(res => {
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
       Api.Get(apiUrls.productController.searchType + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = productTypeModel;
        data[name] = value.toUpperCase();
        data.code = value.toLowerCase().trim().replaceAll(RegexFormat.specialCharectors, "_").replaceAll(RegexFormat.endWithHyphen, '');
        setProductTypeModel({ ...data });

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

        let data = common.assignDefaultValue(productTypeTemplate, productTypeModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.productController.addType, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-productType');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.productController.updateType, productTypeModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-productType');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (productTypeId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.productController.getType + productTypeId).then(res => {
            if (res.data.id > 0) {
                setProductTypeModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
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
            popupModelId: "add-productType",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setProductTypeModel({ ...productTypeTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Product',
        items: [ 
            {
                title: "Products",
                icon: "bi bi bi-layers",
                link: '/products',
            },
            {
                title: "Product Type'",
                icon: "bi bi-cup",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Product Type",
                icon: 'bx bx-plus',
                modelId: 'add-productType',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.productController.getAllType + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setProductTypeModel({ ...productTypeTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const { value } = productTypeModel;
        const newError = {};
        if (!value || value === "") newError.value = validationMessage.productTypeRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Product Type Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-productType" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Product Type</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Product Type" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="value" value={productTypeModel.value} type="text" id='value' className="form-control" />
                                                <ErrorLabel message={errors?.value}></ErrorLabel>
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
