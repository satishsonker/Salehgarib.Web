import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toastMessage } from '../../../constants/ConstantValues';
import { validationMessage } from '../../../constants/validationMessage';
import { common } from '../../../utils/common';
import Breadcrumb from '../../common/Breadcrumb';
import ErrorLabel from '../../common/ErrorLabel';
import Label from '../../common/Label';
import TableView from '../../tables/TableView';
import Dropdown from '../../common/Dropdown';

export default function Products() {
    const productModelTemplate = {
        productName: '',
        sizeId: 0,
        widthId: 0,
        productTypeId: 0,
        id: 0
    }
    const [productModel, setProductModel] = useState(productModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const [productTypeList, setProductTypeList] = useState([]);
    const [sizeList, setSizeList] = useState([]);
    const [widthList, setWidthList] = useState([]);
    const handleDelete = (id) => {
        Api.Delete(apiUrls.productController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.productController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var value = e.target.value;
        if (e.target.type === 'number' || e.target.type === 'select-one') {
            value = parseInt(e.target.value);
        }
        setProductModel({ ...productModel, [e.target.name]: value });

        if (!!errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null })
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }

        let data = common.assignDefaultValue(productModelTemplate, productModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.productController.add, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-product');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.productController.update, productModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-product');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (productId) => {
        setIsRecordSaving(false);
        Api.Get(apiUrls.productController.get + productId).then(res => {
            if (res.data.id > 0) {
                setProductModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Product Name', prop: 'productName' },
            { name: 'Product Type', prop: 'productType' },
            { name: 'Size', prop: 'size' },
            { name: 'Shape', prop: 'width' },
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
            popupModelId: "add-product",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setProductModel({ ...productModelTemplate });
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Products',
        items: [
            {
                title: "Product Details",
                icon: "bi bi-layers",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "New Product",
                icon: 'bx bx-plus',
                modelId: 'add-product',
                handler: saveButtonHandler
            },
            {
                text: "new Product Type",
                icon: 'bx bx-plus',
                type:'link',
                url: '/product/product-type'
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.productController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
           ;
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setProductModel({ ...productModelTemplate });
        }
    }, [isRecordSaving])

    useEffect(() => {
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.productController.getAllType));
        apiCalls.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + '?masterDataTypes=fabric_size&masterDataTypes=shape'));
        Api.MultiCall(apiCalls).then(res => {
            if (res[0].data.data.length > 0)
                setProductTypeList([...res[0].data.data]);
            if (res[1].data.length > 0) {
                setWidthList([...res[1].data.filter(x => x.masterDataTypeCode === 'Shape')]);
                setSizeList([...res[1].data.filter(x => x.masterDataTypeCode === 'fabric_size')]);
            }
        })
    }, []);

    const isCrystal = (productTypeId) => {
        var productType = productTypeList.find(x => x.id === productTypeId);
        if (productType === undefined)
            return false;
        if (productType.value.toUpperCase().indexOf('CRYSTAL') || productType.value.toUpperCase().indexOf('CRISTAL'))
            return true;
        return false;
    }
    const validateError = () => {
        const { productName, sizeId, productTypeId, widthId } = productModel;
        const newError = {};
        if (!productName || productName === "") newError.productName = validationMessage.productNameRequired;
        if (!productTypeId || productTypeId === 0) newError.productTypeId = validationMessage.productTypeRequired;
        if (isCrystal(productTypeId)) {
            if (!sizeId || sizeId === 0) newError.sizeId = validationMessage.crystalSizeRequired;
            if (!widthId || widthId === 0) newError.widthId = validationMessage.crystalShapeRequired;
        }
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Product Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-product" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Products</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-12">
                                                <Label text="Product Type"></Label>
                                                <Dropdown data={productTypeList} defaultText="Select product type" name="productTypeId" defaultValue='' onChange={handleTextChange} value={productModel.productTypeId}></Dropdown>
                                                <ErrorLabel message={errors?.productTypeId}></ErrorLabel>
                                            </div>
                                            <div className="col-12">
                                                <Label text="Product Name"></Label>
                                                <input required onChange={e => handleTextChange(e)} name="productName" value={productModel.productName} type="text" id='productName' className="form-control" />
                                                <ErrorLabel message={errors?.productName}></ErrorLabel>
                                            </div>
                                            {
                                                isCrystal(productModel.productTypeId) &&
                                                <>
                                                    <div className="col-12">
                                                        <Label text="Size"></Label>
                                                        <Dropdown data={sizeList} defaultText="Select crystal size" name="sizeId" defaultValue='0' onChange={handleTextChange} value={productModel.sizeId}></Dropdown>
                                                        <ErrorLabel message={errors?.sizeId}></ErrorLabel>
                                                    </div>
                                                    <div className="col-12">
                                                        <Label text="Shape"></Label>
                                                        <Dropdown data={widthList} defaultText="Select crystal shape" name="widthId" defaultValue='0' onChange={handleTextChange} value={productModel.widthId}></Dropdown>
                                                        <ErrorLabel message={errors?.widthId}></ErrorLabel>
                                                    </div>
                                                </>
                                            }
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
