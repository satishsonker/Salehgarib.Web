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

export default function Products() {
    const productModelTemplate = {
        productName: '',
        company: '',
        supplierName: '',
        quantityUnit: 0,
        unitPrice: 0,
        productDate: common.getHtmlDate(new Date()),
        supplierId: 0
    }
    const [productModel, setProductModel] = useState(productModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [errors, setErrors] = useState();
    const [supplierList, setSupplierList] = useState([]);
    const handleDelete = (id) => {
        Api.Delete(apiUrls.productController.delete + id).then(res => {
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
                    common.closePopup();
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
                    common.closePopup();
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
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Product Name', prop: 'productName' },
            { name: 'Company', prop: 'company' },
            { name: 'Supplier Name', prop: 'supplierName' },
            { name: 'Quantity Unit', prop: 'quantityUnit' },
            { name: 'Unit Price', prop: 'unitPrice' },
            { name: 'Product Date', prop: 'productDate' }
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
                text: "Product Deatils",
                icon: 'bx bx-plus',
                modelId: 'add-product',
                handler: saveButtonHandler
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
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setProductModel({ ...productModelTemplate });
        }
    }, [isRecordSaving])

    useEffect(() => {
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.dropdownController.suppliers));
        Api.MultiCall(apiCalls).then(res => {
            if (res[0].data.length > 0)
                setSupplierList([...res[0].data]);
        })
    }, []);

    const validateError = () => {
        const { productName, quantityUnit, unitPrice, supplierId, company } = productModel;
        const newError = {};
        if (!productName || productName === "") newError.productName = validationMessage.productNameRequired;
        if (!company || company === "") newError.company = validationMessage.companyNameRequired
        if (supplierId === 0) newError.supplierId = validationMessage.supplierRequired;
        if (unitPrice === 0) newError.unitPrice = validationMessage.unitPriceRequired;
        if (quantityUnit === 0) newError.quantityUnit = validationMessage.quantityRequired;

        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Product Deatils</h6>
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
                                                <Label text="Product Date"></Label>
                                                <input required onChange={e => handleTextChange(e)} name="productDate" value={productModel.productDate} type="date" id='productDate' className="form-control" />
                                            </div>
                                            <div className="col-12">
                                                <Label text="Product Name" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="productName" value={productModel.productName} type="text" id='productName' className="form-control" />
                                                <ErrorLabel message={errors?.productName}></ErrorLabel>
                                            </div>
                                            <div className="col-12">
                                                <Label text="Company" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="company" value={productModel.company} type="text" id='company' className="form-control" />
                                                <ErrorLabel message={errors?.company}></ErrorLabel>
                                            </div>
                                            <div className="col-12">
                                                <Label text="Supplier" isRequired={true}></Label>
                                                <select className='form-control' onChange={e => handleTextChange(e)} name="supplierId" value={productModel.supplierId}>
                                                    <option value="0">Select supplier</option>
                                                    {
                                                        supplierList.map((ele, index) => {
                                                            return <option key={index} value={ele.id}>{ele.value}</option>
                                                        })
                                                    }
                                                </select>
                                                <ErrorLabel message={errors?.supplierId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Quantity Unit" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="quantityUnit" min={0} value={productModel.quantityUnit} type="number" id='quantityUnit' className="form-control" />
                                                <ErrorLabel message={errors?.quantityUnit}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Unit Price" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="unitPrice" min={0} value={productModel.unitPrice} type="number" id='unitPrice' className="form-control" />
                                                <ErrorLabel message={errors?.unitPrice}></ErrorLabel>
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
