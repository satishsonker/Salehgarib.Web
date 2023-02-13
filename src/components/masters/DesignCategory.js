import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import RegexFormat from '../../utils/RegexFormat';
import Breadcrumb from '../common/Breadcrumb';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function DesignCategory() {
    const designCategoryModelTemplate = {
        "id": 0,
        "code": '',
        "value": ''
    }
    const [designCategoryModel, setDesignCategoryModel] = useState(designCategoryModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.masterController.designCategory.delete + id).then(res => {
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
        Api.Get(apiUrls.masterController.designCategory.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data=designCategoryModel;
        data[name]=value.toUpperCase().trim();
        data.code=value.toLowerCase().trim().replaceAll(RegexFormat.specialCharectors, "_").replaceAll(RegexFormat.endWithHyphen,'');
        setDesignCategoryModel({ ...data});

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

        let data = common.assignDefaultValue(designCategoryModelTemplate, designCategoryModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.masterController.designCategory.add, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-designCategory');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.masterController.designCategory.update, designCategoryModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-designCategory');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (designCategoryId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.masterController.designCategory.get + designCategoryId).then(res => {
            if (res.data.id > 0) {
                setDesignCategoryModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Category Name', prop: 'value' },
            { name: 'Category Code', prop: 'code' }
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
            popupModelId: "add-designCategory",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setDesignCategoryModel({ ...designCategoryModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Design Category',
        items: [
            {
                title: "Design Category'",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Design Category",
                icon: 'bx bx-plus',
                modelId: 'add-designCategory',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.masterController.designCategory.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setDesignCategoryModel({ ...designCategoryModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { value} = designCategoryModel;
        const newError = {};
        if (!value || value === "") newError.value = validationMessage.categoryNameRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Design Category Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-designCategory" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Design Category</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Category Name" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="value" value={designCategoryModel.value} type="text" id='value' className="form-control" />
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
