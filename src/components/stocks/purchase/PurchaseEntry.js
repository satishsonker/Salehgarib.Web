import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toastMessage } from '../../../constants/ConstantValues';
import { validationMessage } from '../../../constants/validationMessage';
import { common } from '../../../utils/common';
import Breadcrumb from '../../common/Breadcrumb';
import Dropdown from '../../common/Dropdown';
import ErrorLabel from '../../common/ErrorLabel';
import Label from '../../common/Label';
import TableView from '../../tables/TableView';

export default function PurchaseEntry() {
    const purchaseEntryModelTemplate = {
        purchaseEntryId: 0,
        purchaseNo: 0,
        supplierId: 0,
        invoiceNo: "",
        invoiceDate: common.getHtmlDate(new Date()),
        contactNo: "",
        trn: "",
        purchaseEntryDetailId: 0,
        purchaseEntryId: 0,
        brandId: 0,
        productId: 0,
        brandName: "",
        productName: "",
        qty: 0,
        unitPrice: 0,
        totalPrice: 0,
        totalPaid: 0,
        salePrice: 0,
        purchaseDate: common.getHtmlDate(new Date()),
        description: "",
        purchaseEntryDetails: []
    };
    const [purchaseEntryModel, setPurchaseEntryModel] = useState(purchaseEntryModelTemplate);
    const [supplierList, setSupplierList] = useState([])
    const [brandList, setBrandList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [errors, setErrors] = useState({})
    const handleDelete = (id, data) => {
        Api.Delete(apiUrls.purchaseEntryController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        }).catch(err => {
            toast.error(toastMessage.deleteError);
        });
    }
    const [viewPurchaseEntryId, setViewPurchaseEntryId] = useState(0);

    const handleSave = (e) => {
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }

        let data = common.assignDefaultValue(purchaseEntryModelTemplate, purchaseEntryModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.purchaseEntryController.add, data).then(res => {
                if (res.data.purchaseEntryId > 0) {
                    common.closePopup('add-purchase-entry');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.purchaseEntryController.update, purchaseEntryModel).then(res => {
                if (res.data.purchaseEntryId > 0) {
                    common.closePopup('add-purchase-entry');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }

    const handleEdit = (id, data) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.purchaseEntryController.get + data.purchaseEntryId).then(res => {
            let data = res.data;
            if (data.purchaseEntryId > 0) {
                data.brandId = 0;
                data.productId = 0;
                data.fabricWidthId = 0;
                data.brandName = '';
                data.productName = '';
                data.qty = 0;
                data.totalPaid = 0;
                data.totalPrice = 0;
                data.description = '';
                data.unitPrice = 0;
                setPurchaseEntryModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };

    const handleView = (id, data) => {
        setViewPurchaseEntryId(data.purchaseEntryId);
    }

    const saveButtonHandler = () => {
        Api.Get(apiUrls.purchaseEntryController.getPurchaseNo)
            .then(res => {
                purchaseEntryModelTemplate.purchaseNo = res.data;
                setPurchaseEntryModel({ ...purchaseEntryModelTemplate });
                setErrors({});
                setIsRecordSaving(true);
            });
    }

    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.purchaseEntryController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.data.forEach(element => {
                addAdditionalField(element);
            });
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            setViewPurchaseEntryId(0);
        }).catch(err => {

        });
    }
    const addAdditionalField = (dataRow) => {
        dataRow.id = dataRow.purchaseEntryId;
        dataRow.totalItems = dataRow.purchaseEntryDetails.length;
        dataRow.totalAmount = dataRow.purchaseEntryDetails.reduce(function (s, a) {
            return s + a.totalPrice;
        }, 0);
        dataRow.totalQty = dataRow.purchaseEntryDetails.reduce(function (s, a) {
            return s + a.qty;
        }, 0);
    }
    const tableOptionTemplet = {
        headers: [
            { name: "purchase No", prop: "purchaseNo" },
            { name: "Supplier", prop: "supplier" },
            { name: "Company Name", prop: "companyName" },
            { name: "Total Item", prop: "totalItems", action: { decimal: true } },
            { name: "Total Quantity", prop: "totalQty", action: { decimal: true } },
            { name: "Invoice Number", prop: "invoiceNo" },
            { name: "Invoice Date", prop: "invoiceDate" },
            { name: "Total Amount", prop: "totalAmount", action: { decimal: true } },
            { name: "Contact No", prop: "contactNo" },
            { name: "TRN No.", prop: "trn" },
            { name: "Created By", prop: "createdBy" }
        ],
        showTableTop: true,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: true,
            popupModelId: "add-purchase-entry",
            delete: {
                handler: handleDelete,
                showModel: true
            },
            edit: {
                handler: handleEdit,
                icon: "bi bi-pencil-fill",
                modelId: "add-purchase-entry"
            },
            view: {
                handler: handleView
            }
        }
    }

    const tableOptionDetailTemplet = {
        headers: [
            { name: "Brand", prop: "brandName" },
            { name: "Product", prop: "productName" },
            { name: "Quantity", prop: "qty", action: { decimal: true } },
            { name: "Unit Price", prop: "unitPrice", action: { decimal: true } },
            { name: "Total Price", prop: "totalPrice", action: { decimal: true } },
            { name: "Total Paid", prop: "totalPaid", action: { decimal: true } },
            { name: "Purchase Date", prop: "purchaseDate" },
            { name: "Description", prop: "description" },
        ],
        data: [],
        showAction: false,
        showTableTop: false
    }

    const breadcrumbOption = {
        title: 'Purchase Entry',
        items: [
            {
                isActive: false,
                title: "Purchase Entry",
                icon: "bi bi-cart3"
            }
        ],
        buttons: [
            {
                text: "New Purchase",
                icon: 'bx bx-plus',
                modelId: 'add-purchase-entry',
                handler: saveButtonHandler
            }
        ]
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [tableOptionDetail, setTableOptionDetail] = useState(tableOptionDetailTemplet);

    const handleTextChange = (e) => {
        var { value, type, name } = e.target;
        let data = purchaseEntryModel;
        if (type === 'select-one') {
            value = parseInt(value);
        }
        else if (type === 'number')
            value = parseFloat(value);
        if (name === 'qty') {
            value = isNaN(value) ? 0 : value;
            data.totalPrice = data.unitPrice * value;
            data.totalPaid = data.totalPrice;
        }

        if (name === 'unitPrice') {
            value = isNaN(value) ? 0 : value;
            data.totalPrice = data.qty * value;
            data.totalPaid = data.totalPrice;
        }

        data[name] = value;
        setPurchaseEntryModel({ ...data });

        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null })
        }
    }

    const addItems = (e) => {
        e.preventDefault();
        const formError = validateAddItem();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        let mainData = purchaseEntryModel;
        if (mainData.purchaseEntryDetails.find(x => x.brandId === purchaseEntryModel.brandId && x.productId === purchaseEntryModel.productId) !== undefined) {
            toast.warning('You have already added the same product with same brand!');
            return;
        }
        let item = {
            "purchaseEntryDetailId": 0,
            "purchaseEntryId": 0,
            "brandId": purchaseEntryModel.brandId,
            "productId": purchaseEntryModel.productId,
            "qty": purchaseEntryModel.qty,
            "unitPrice": purchaseEntryModel.unitPrice,
            "totalPrice": purchaseEntryModel.totalPrice,
            "totalPaid": purchaseEntryModel.totalPaid,
            "purchaseDate": purchaseEntryModel.purchaseDate,
            "description": purchaseEntryModel.description,
            "brandName": purchaseEntryModel.brandName,
            "productName": purchaseEntryModel.productName,
        }
        mainData.purchaseEntryDetails.push(common.cloneObject(item));
        setPurchaseEntryModel(mainData);
        resetPurchaseDetail();
    }

    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.dropdownController.suppliers));
        apiList.push(Api.Get(apiUrls.productController.getAll));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + `?masterDataTypes=brand`));

        Api.MultiCall(apiList)
            .then(res => {
                var products = res[1].data.data;
                products.forEach(ele => {
                    ele.productName = `${ele.productName}-${ele.width}-${ele.size}`;
                });
                setSupplierList(res[0].data);
                setProductList(products);
                setBrandList(res[2].data.filter(x => x.masterDataTypeCode.toLowerCase() === 'brand'));
            });
    }, []);

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.purchaseEntryController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.data.forEach(element => {
                addAdditionalField(element);
            });
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        Api.Get(apiUrls.purchaseEntryController.getPurchaseNo)
            .then(res => {

                setPurchaseEntryModel({ ...purchaseEntryModel, ["purchaseNo"]: res.data });
            });
    }, []);

    useEffect(() => {
        if (viewPurchaseEntryId === 0)
            return;
        tableOptionDetailTemplet.data = tableOption.data?.find(x => x.purchaseEntryId === viewPurchaseEntryId).purchaseEntryDetails;
        setTableOptionDetail(tableOptionDetailTemplet);
    }, [viewPurchaseEntryId])

    const selectBrandHandler = (data) => {
        setPurchaseEntryModel({ ...purchaseEntryModel, ["brandName"]: data.value })
    }

    const selectProductHandler = (data) => {
        setPurchaseEntryModel({ ...purchaseEntryModel, ["productName"]: data.productName })
    }
    // const selectSupplierHandler = (data) => {
    //     setPurchaseEntryModel({ ...purchaseEntryModel, ["companyName"]: data.data.companyName })
    // }

    const validateAddItem = () => {
        const { itemId, brandId, productId, fabricWidthId, qty, unitPrice } = purchaseEntryModel;
        const newError = {};
        if (!brandId || brandId === 0) newError.brandId = validationMessage.itemRequired;
        if (!productId || productId === 0) newError.productId = validationMessage.productRequired;
        if (!qty || qty === 0) newError.qty = validationMessage.quantityRequired;
        if (!unitPrice || unitPrice === 0) newError.unitPrice = validationMessage.unitPriceRequired;
        return newError;
    }

    const validateError = () => {
        const { supplierId, invoiceNo, invoiceDate, trn, purchaseNo, purchaseEntryDetails } = purchaseEntryModel;
        const newError = {};
        if (!supplierId || supplierId === 0) newError.supplierId = validationMessage.supplierRequired;
        if (!invoiceNo || invoiceNo === 0) newError.invoiceNo = validationMessage.invoiceNoRequired;
        if (!invoiceDate || invoiceDate === 0) newError.invoiceDate = validationMessage.invoiceDateRequired;
        if (!trn || trn === 0) newError.trn = validationMessage.trnRequired;
        if (!purchaseEntryDetails || purchaseEntryDetails.length === 0) newError.purchaseEntryDetails = validationMessage.purchaseEntryDetailsRequired;
        if (!purchaseNo || purchaseNo === 0) newError.purchaseNo = validationMessage.purchaseNoRequired;
        return newError;
    }

    const resetPurchaseDetail = () => {
        let data = purchaseEntryModel;
        data.brandId = 0;
        data.productId = 0;
        data.brandName = '';
        data.productName = '';
        data.qty = 0;
        data.totalPaid = 0;
        data.totalPrice = 0;
        data.description = '';
        data.unitPrice = 0;
        setPurchaseEntryModel(data);
    }

    const deleteNewAddedProduct = (index) => {
        var modal = purchaseEntryModel;
        var newDetails = [];
        purchaseEntryModel.purchaseEntryDetails.forEach((res, ind) => {
            if (ind !== index)
                newDetails.push(res);
        });
        modal.purchaseEntryDetails = newDetails;
        setPurchaseEntryModel({ ...modal });
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Purchase Entry</h6>
            <hr />
            <TableView option={tableOption}></TableView>
            {viewPurchaseEntryId > 0 && <TableView option={tableOptionDetail}></TableView>}
            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-purchase-entry" className="modal fade in" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Purchase Entry</h5>
                            <button type="button" id='closePopup' className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-3">
                                                <Label text="Purchase No" isRequired={true}></Label>
                                                <input disabled name="purchaseNo" value={purchaseEntryModel.purchaseNo} type="text" id='purchaseNo' className="form-control form-control-sm" />
                                                <ErrorLabel message={errors?.purchaseNo}></ErrorLabel>
                                            </div>
                                            <div className="col-md-3">
                                                <Label text="Invoice No" isRequired={true}></Label>
                                                <input name="invoiceNo" onChange={e => handleTextChange(e)} value={purchaseEntryModel.invoiceNo} type="text" id='invoiceNo' className="form-control form-control-sm" />
                                                <ErrorLabel message={errors?.invoiceNo}></ErrorLabel>
                                            </div>
                                            <div className="col-md-3">
                                                <Label text="Contact No" ></Label>
                                                <input name="contactNo" onChange={e => handleTextChange(e)} value={purchaseEntryModel.contactNo} type="text" id='contactNo' className="form-control form-control-sm" />
                                            </div>
                                            <div className="col-md-3">
                                                <Label text="Invoice Date" isRequired={true}></Label>
                                                <input name="invoiceDate" onChange={e => handleTextChange(e)} value={purchaseEntryModel.invoiceDate} max={common.getHtmlDate(new Date())} type="date" id='invoiceDate' className="form-control form-control-sm" />
                                                <ErrorLabel message={errors?.invoiceDate}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Supplier" isRequired={true} />
                                                <Dropdown className='form-control-sm' defaultValue='0' data={supplierList} name="supplierId" elementKey="id" searchable={true} onChange={handleTextChange} value={purchaseEntryModel.supplierId} defaultText="Select supplier"></Dropdown>
                                                <ErrorLabel message={errors?.supplierId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="TRN" isRequired={true}></Label>
                                                <input name="trn" onChange={e => handleTextChange(e)} value={purchaseEntryModel.trn} type="text" id='trn' className="form-control form-control-sm" />
                                                <ErrorLabel message={errors?.trn}></ErrorLabel>
                                            </div>
                                            <hr></hr>
                                            <h6>Purchase Item details</h6>
                                            <div className="row g-3" style={{ margin: '0' }}>
                                                <div className="col-md-5">
                                                    <Label text="Product" isRequired={true} />
                                                    <Dropdown className='form-control-sm' defaultValue='0' itemOnClick={selectProductHandler} data={productList} name="productId" text="productName" elementKey="id" searchable={true} onChange={handleTextChange} value={purchaseEntryModel.productId} defaultText="Select product"></Dropdown>
                                                    <ErrorLabel message={errors?.productId}></ErrorLabel>
                                                </div>
                                                <div className="col-md-5">
                                                    <Label text="Brand" isRequired={true} />
                                                    <Dropdown className='form-control-sm' defaultValue='0' itemOnClick={selectBrandHandler} data={brandList} name="brandId" elementKey="id" searchable={true} onChange={handleTextChange} value={purchaseEntryModel.brandId} defaultText="Select brand"></Dropdown>
                                                    <ErrorLabel message={errors?.brandId}></ErrorLabel>
                                                </div>
                                                <div className="col-md-2">
                                                    <Label text="Purchase Date" isRequired={true}></Label>
                                                    <input name="purchaseDate" onChange={e => handleTextChange(e)} max={common.getHtmlDate(new Date())} value={purchaseEntryModel.purchaseDate} type="date" id='purchaseDate' className="form-control form-control-sm" />
                                                    <ErrorLabel message={errors?.purchaseDate}></ErrorLabel>
                                                </div>
                                                <div className="col-md-3">
                                                    <Label text="Quantity" isRequired={true}></Label>
                                                    <input name="qty" onChange={e => handleTextChange(e)} min={0} value={purchaseEntryModel.qty} type="number" id='qty' className="form-control form-control-sm" />
                                                    <ErrorLabel message={errors?.qty}></ErrorLabel>
                                                </div>
                                                <div className="col-md-3">
                                                    <Label text="Unit Price" isRequired={true}></Label>
                                                    <input name="unitPrice" onChange={e => handleTextChange(e)} min={0} value={purchaseEntryModel.unitPrice} type="number" id='unitPrice' className="form-control form-control-sm" />
                                                    <ErrorLabel message={errors?.unitPrice}></ErrorLabel>
                                                </div>
                                                <div className="col-md-3">
                                                    <Label text="Total Price" isRequired={true}></Label>
                                                    <input disabled name="totalPrice" min={0} value={purchaseEntryModel.totalPrice?.toFixed(2)} type="number" id='totalPrice' className="form-control form-control-sm" />
                                                    <ErrorLabel message={errors?.totalPrice}></ErrorLabel>
                                                </div>
                                                <div className="col-md-3">
                                                    <Label text="Total Paid"></Label>
                                                    <input name="totalPaid" onChange={e => handleTextChange(e)} min={0} value={purchaseEntryModel.totalPaid} type="number" id='totalPaid' className="form-control form-control-sm" />
                                                </div>
                                                <div className="col-md-10">
                                                    <Label text="Description" ></Label>
                                                    <input name="description" onChange={e => handleTextChange(e)} value={purchaseEntryModel.description} type="text" id='description' className="form-control form-control-sm" />
                                                </div>
                                                <div className="col-md-2">
                                                    <Label text="." ></Label>
                                                    <button onClick={e => addItems(e)} className='btn btn-sm btn-success form-control form-control-sm'>Add</button>
                                                </div>
                                                <hr />
                                                <div className="table-responsive">
                                                    <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap5">
                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                <table id="example" className="table table-striped table-bordered fixTableHead" style={{ width: "100%" }} role="grid" aria-describedby="example_info">
                                                                    <thead>
                                                                        <tr role="row">
                                                                            <th>Sr#</th>
                                                                            {
                                                                                tableOptionDetailTemplet.headers.length > 0 && tableOptionDetailTemplet.headers.map((ele, index) => {
                                                                                    return <th className="sorting" tabIndex="0" aria-controls="example" key={index}>{ele.name}</th>
                                                                                })
                                                                            }
                                                                            <th>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            purchaseEntryModel.purchaseEntryDetails.length > 0 && (
                                                                                purchaseEntryModel.purchaseEntryDetails.map((dataEle, dataIndex) => {
                                                                                    return <tr key={dataIndex}>
                                                                                        <td>{dataIndex + 1}</td>
                                                                                        {
                                                                                            tableOptionDetailTemplet.headers.map((headerEle, headerIndex) => {
                                                                                                return <>
                                                                                                    {
                                                                                                        <td key={headerEle + headerIndex} title={headerEle?.title}>{common.formatTableData(dataEle[headerEle.prop], headerEle.action)}</td>
                                                                                                    }
                                                                                                </>
                                                                                            })
                                                                                        }
                                                                                        <td key={dataIndex + 100000}>
                                                                                            <div className="table-actions d-flex align-items-center gap-3 fs-6">
                                                                                                <div onClick={e => deleteNewAddedProduct(dataIndex)} className="text-primary" data-bs-placement="bottom" title="" data-bs-original-title="" aria-label=""><i className="bi bi-trash-fill"></i></div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                })
                                                                            )
                                                                        }

                                                                        {/* No record found when data length is zero */}
                                                                        {
                                                                            !errors.purchaseEntryDetails && purchaseEntryModel.purchaseEntryDetails.length === 0 && (
                                                                                <tr>
                                                                                    {!errors.orderDetails && <td style={{ textAlign: "center", height: "32px", verticalAlign: "middle" }} colSpan={tableOptionDetailTemplet.headers.length + 2}>No record found</td>}
                                                                                </tr>
                                                                            )
                                                                        }
                                                                        {
                                                                            errors.purchaseEntryDetails && (
                                                                                <tr>
                                                                                    {<td style={{ textAlign: "center", height: "32px", verticalAlign: "middle", color: 'red' }} colSpan={tableOptionDetailTemplet.headers.length + 2}>{errors.purchaseEntryDetails}</td>}
                                                                                </tr>
                                                                            )
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
