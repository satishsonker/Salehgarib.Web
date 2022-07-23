import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function DesignSamples() {
    const designSampleModelTemplate = {
        id: 0,
        name: "",
        model: "",
        costPrice: 0,
        salePrice: 0,
        file: undefined,
        categoryId: 0,
        categoryName: "",
        picturePath: "",
        availableQty:0
    }
    const [designCategory, setDesignCategory] = useState([])
    const [designSampleModel, setDesignSampleModel] = useState(designSampleModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.masterController.designSample.delete + id).then(res => {
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
        Api.Get(apiUrls.masterController.designSample.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, type, name, files } = e.target;
        var data = designSampleModel;
        switch (type) {
            case "number":
            case "select-one":
                value = parseFloat(value);
                break;
            case 'file':
                value = files;
                break;
            default:
                break;
        }
        if (name === 'name') {
            data.model = value.toUpperCase();
        }
        data[name] = value;
        setDesignSampleModel({ ...data });

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

        var formData = new FormData();
        let data = common.assignDefaultValue(designSampleModelTemplate, designSampleModel);
        for (var key in data) {
            if (key === 'file') {
                formData.append(key, data[key][0], data[key][0].name);
            }
            else
                formData.append(key, data[key]);
        }
        if (isRecordSaving) {
            Api.FileUploadPut(apiUrls.masterController.designSample.add, formData).then(res => {
                if (res.data.id > 0) {
                    common.closePopup();
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.FileUploadPost(apiUrls.masterController.designSample.update, formData).then(res => {
                if (res.data.id > 0) {
                    common.closePopup();
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (designSampleId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.masterController.designSample.get + designSampleId).then(res => {
            if (res.data.id > 0) {
                setDesignSampleModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Sample Name', prop: 'name' },
            { name: 'Sample Model', prop: 'model' },
            { name: 'Sample Image', prop: 'picturePath', action: { image: true } },
            { name: 'Cost Price', prop: 'costPrice' },
            { name: 'Sale Model', prop: 'salePrice' },
            { name: 'Category Name', prop: "categoryName" }
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
            popupModelId: "add-designSample",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setDesignSampleModel({ ...designSampleModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Design Sample',
        items: [
            {
                title: "Design Sample'",
                icon: "bi bi-menu-button",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Design Sample",
                icon: 'bx bx-plus',
                modelId: 'add-designSample',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        var apiList = [];
        apiList.push(Api.Get(apiUrls.masterController.designSample.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`));
        apiList.push(Api.Get(apiUrls.dropdownController.designCategory));
        Api.MultiCall(apiList).then(res => {
            tableOptionTemplet.data = res[0].data.data;
            tableOptionTemplet.totalRecords = res[0].data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            setDesignCategory(res[1].data);
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setDesignSampleModel({ ...designSampleModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { categoryId, model, name, costPrice, salePrice, file } = designSampleModel;
        const newError = {};
        if (!name || name === "") newError.name = validationMessage.nameRequired;
        if (!model || model === "") newError.model = validationMessage.modelRequired;
        if (model && model.length > 30) newError.model = validationMessage.maxCharAllowed(30);
        if (name && name.length > 30) newError.name = validationMessage.maxCharAllowed(30);
        if (!categoryId || categoryId < 1) newError.categoryId = validationMessage.categoryNameRequired;
        if (!costPrice || costPrice < 1) newError.costPrice = validationMessage.costPriceRequired;
        if (!salePrice || salePrice < 1) newError.salePrice = validationMessage.salePriceRequired;
        if (!salePrice && !costPrice && salePrice<costPrice) newError.salePrice = validationMessage.salesPriceLessThanCostPrice;
        if (file && file.length === 0 || file === "") newError.file = validationMessage.fileRequired;
        var fileError = validateFileExtenstionAndSize(file);
        if (fileError) {
            newError.file = fileError;
        }
        return newError;
    }
    const validateFileExtenstionAndSize = (file) => {
        if (!file || file?.length === 0)
            return;

        var { name, size } = file[0];
        var ext = name.substring(name.lastIndexOf('.'), name.length);
        var allowedFileExt = process.env.REACT_APP_ALLOWED_FILE_EXTENSION;
        var allowedFileSize = eval(process.env.REACT_APP_ALLOWED_FILE_SIZE);
        if (allowedFileExt.indexOf(ext) === -1)
            return validationMessage.allowedFileExtension;
        if (size > allowedFileSize)
            return validationMessage.allowedFileSize;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Design Sample Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-designSample" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Design Sample</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Design Category" isRequired={true}></Label>
                                                <Dropdown onChange={handleTextChange} name="categoryId" defaultValue='0' searchable={true} value={designSampleModel.categoryId} defaultText="Select design category.." data={designCategory}></Dropdown>
                                                <ErrorLabel message={errors?.categoryId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Sample Name" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="name" value={designSampleModel.name} type="text" id='name' className="form-control" />
                                                <ErrorLabel message={errors?.name}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Sample Model" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="model" value={designSampleModel.model} type="text" id='model' className="form-control" />
                                                <ErrorLabel message={errors?.model}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Cost Price" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="costPrice" value={designSampleModel.costPrice} min={0} type="number" id='costPrice' className="form-control" />
                                                <ErrorLabel message={errors?.costPrice}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Sale Price" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="salePrice" value={designSampleModel.salePrice} min={designSampleModel.costPrice} type="number" id='salePrice' className="form-control" />
                                                <ErrorLabel message={errors?.salePrice}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Available Quantity" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="availableQty" value={designSampleModel.availableQty} min={0} type="number" id='availableQty' className="form-control" />
                                                <ErrorLabel message={errors?.salePrice}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <input type="file" name='file' onChange={e => handleTextChange(e)} alue={designSampleModel.file} className="form-control"></input>
                                                <ErrorLabel message={errors?.file}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <img src={process.env.REACT_APP_API_URL + designSampleModel?.picturePath}></img>
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
