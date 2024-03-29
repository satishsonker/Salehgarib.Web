import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toastMessage } from '../../../constants/ConstantValues';
import { validationMessage } from '../../../constants/validationMessage';
import { common } from '../../../utils/common';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import Breadcrumb from '../../common/Breadcrumb';
import ButtonBox from '../../common/ButtonBox';
import Dropdown from '../../common/Dropdown';
import ErrorLabel from '../../common/ErrorLabel';
import Inputbox from '../../common/Inputbox';
import Label from '../../common/Label';
import TableView from '../../tables/TableView';

export default function PurchaseEntry() {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const purchaseEntryModelTemplate = {
        purchaseEntryId: 0,
        purchaseNo: 0,
        supplierId: 0,
        invoiceNo: "",
        invoiceDate: common.getHtmlDate(new Date()),
        purchaseEntryDetailId: 0,
        purchaseEntryId: 0,
        productId: 0,
        productName: "",
        qty: 0,
        trn: '',
        companyName: '',
        contactNo: '',
        unitPrice: 0,
        vatAmount: 0,
        totalPrice: 0,
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
            });
        }
        else {
            Api.Post(apiUrls.purchaseEntryController.update, purchaseEntryModel).then(res => {
                if (res.data.purchaseEntryId > 0) {
                    common.closePopup('add-purchase-entry');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            });
        }
    }

    const handleEdit = (id, data) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.purchaseEntryController.get + data.purchaseEntryId).then(res => {
            let data = res.data;
            if (data.purchaseEntryId > 0) {
                data.productId = 0;
                data.fabricWidthId = 0;
                data.productName = '';
                data.qty = 0;
                data.totalPrice = 0;
                data.description = '';
                data.unitPrice = 0;
                setPurchaseEntryModel(res.data);
            }
        });
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
        headers: headerFormat.purchaseEntry,
        showTableTop: true,
        showFooter: true,
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
        headers: headerFormat.purchaseEntryDetail,
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
            var subTotal = data.unitPrice * value;
            var vatAmount = common.calculatePercent(subTotal, VAT);
            data.totalPrice = subTotal + vatAmount;
            data.vatAmount = vatAmount;
            data.totalPaid = data.totalPrice;
        }

        if (name === 'unitPrice') {
            value = isNaN(value) ? 0 : value;
            var subTotal = data.qty * value;
            var vatAmount = common.calculatePercent(subTotal, VAT);
            data.totalPrice = subTotal + vatAmount;
            data.vatAmount = vatAmount;
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
        if (mainData.purchaseEntryDetails.find(x => x.productId === purchaseEntryModel.productId) !== undefined) {
            toast.warning('You have already added the this product!');
            return;
        }
        let item = {
            purchaseEntryDetailId: 0,
            purchaseEntryId: 0,
            brandId: purchaseEntryModel.brandId,
            productId: purchaseEntryModel.productId,
            qty: purchaseEntryModel.qty,
            unitPrice: purchaseEntryModel.unitPrice,
            totalPrice: purchaseEntryModel.totalPrice,
            totalPaid: purchaseEntryModel.totalPaid,
            vatAmount:purchaseEntryModel.vatAmount,
            purchaseDate: purchaseEntryModel.purchaseDate,
            description: purchaseEntryModel.description,
            brandName: purchaseEntryModel.brandName,
            productName: purchaseEntryModel.productName,
        }
        mainData.purchaseEntryDetails.push(common.cloneObject(item));
        mainData = resetPurchaseDetail(mainData);
        setPurchaseEntryModel({ ...mainData });
    }

    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.dropdownController.suppliers));
        apiList.push(Api.Get(apiUrls.productController.getAll));

        Api.MultiCall(apiList)
            .then(res => {
                var products = res[1].data.data;
                products.forEach(ele => {
                    ele.productName = `${ele.productName}-${ele.width}-${ele.size}`;
                });
                setSupplierList(res[0].data);
                setProductList(products);
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
           ;
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

    const selectProductHandler = (data) => {
        setPurchaseEntryModel({ ...purchaseEntryModel, ["productName"]: data.productName })
    }
    const selectSupplierHandler = (data) => {
        var modal = purchaseEntryModel;
        modal.trn = data.data?.trn;
        modal.companyName = data.data?.companyName;
        modal.contactNo = data.data?.contact;
        setPurchaseEntryModel({ ...modal });
    }

    const validateAddItem = () => {
        const { productId, vatAmount, qty, unitPrice } = purchaseEntryModel;
        const newError = {};
        if (!productId || productId === 0) newError.productId = validationMessage.productRequired;
        if (!qty || qty === 0) newError.qty = validationMessage.quantityRequired;
        if (!vatAmount || vatAmount === 0) newError.vatAmount = validationMessage.invalidVAT;
        if (!unitPrice || unitPrice === 0) newError.unitPrice = validationMessage.unitPriceRequired;
        return newError;
    }

    const validateError = () => {
        const {supplierId,invoiceNo,invoiceDate,purchaseEntryDetails,purchaseNo}=purchaseEntryModel
        const newError = {};
        if (!supplierId || supplierId === 0) newError.supplierId = validationMessage.supplierRequired;
        if (!invoiceNo || invoiceNo === 0) newError.invoiceNo = validationMessage.invoiceNoRequired;
        if (!invoiceDate || invoiceDate === 0) newError.invoiceDate = validationMessage.invoiceDateRequired;
        if (!purchaseEntryDetails || purchaseEntryDetails.length === 0) newError.purchaseEntryDetails = validationMessage.purchaseEntryDetailsRequired;
        if (!purchaseNo || purchaseNo === 0) newError.purchaseNo = validationMessage.purchaseNoRequired;
        return newError;
    }

    const resetPurchaseDetail = (data) => {
        data.productId = 0;
        data.productName = '';
        data.qty = 0;
        data.vatAmount = 0;
        data.totalPrice = 0;
        data.description = '';
        data.unitPrice = 0;
        return data;
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
                            <h5 className="modal-title">New Purchase : </h5>  <h5 className="modal-title">{purchaseEntryModel.purchaseNo}</h5>
                            <button type="button" id='closePopup' className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-2">
                                                <Inputbox labelText="Purchase No." errorMessage={errors?.purchaseNo} isRequired={true} disabled={true} name="invoiceNo" onChangeHandler={handleTextChange} type="text" value={purchaseEntryModel.purchaseNo} className="form-control-sm" />
                                            </div>
                                            <div className="col-md-2">
                                                <Inputbox labelText="Invoice No." errorMessage={errors?.invoiceNo} isRequired={true} name="invoiceNo" onChangeHandler={handleTextChange} type="text" value={purchaseEntryModel.invoiceNo} className="form-control-sm" />
                                            </div>
                                            <div className="col-md-2">
                                                <Inputbox labelText="Invoice Date" errorMessage={errors?.invoiceDate} isRequired={true} name="invoiceDate" onChangeHandler={handleTextChange} type="date" value={purchaseEntryModel.invoiceDate} className="form-control-sm" />
                                            </div>
                                            <div className="col-md-4">
                                                <Label text="Supplier" isRequired={true} />
                                                <Dropdown className='form-control-sm' defaultValue='0' itemOnClick={selectSupplierHandler} data={supplierList} name="supplierId" elementKey="id" searchable={true} onChange={handleTextChange} value={purchaseEntryModel.supplierId} defaultText="Select supplier"></Dropdown>
                                                <ErrorLabel message={errors?.supplierId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-2">
                                                <Inputbox labelText="Contact No." errorMessage={errors?.contactNo} disabled={true} name="contactNo" onChangeHandler={handleTextChange} type="text" value={purchaseEntryModel.contactNo} className="form-control-sm" /></div>
                                            <div className="col-md-12">
                                                <Inputbox labelText="TRN" errorMessage={errors?.trn} disabled={true} name="trn" onChangeHandler={handleTextChange} type="text" value={purchaseEntryModel.trn} className="form-control-sm" /></div>
                                            <hr></hr>
                                            <h6 className='my-0'>Purchase Item Details</h6>
                                            <div className="row g-3" style={{ margin: '0' }}>
                                                <div className="col-md-4">
                                                    <Label text="Product" isRequired={true} />
                                                    <Dropdown className='form-control-sm' defaultValue='0' searchPattern="_%" itemOnClick={selectProductHandler} data={productList} name="productId" text="productName" elementKey="id" searchable={true} onChange={handleTextChange} value={purchaseEntryModel.productId} defaultText="Select product"></Dropdown>
                                                    <ErrorLabel message={errors?.productId}></ErrorLabel>
                                                </div>
                                                <div className="col-md-2">
                                                    <Inputbox labelText="Purchase Date" errorMessage={errors?.purchaseDate} isRequired={true} name="purchaseDate" onChangeHandler={handleTextChange} type="date" value={purchaseEntryModel.purchaseDate} className="form-control-sm" />
                                                </div>
                                                <div className="col-md-2">
                                                    <Inputbox labelText="Quantity" errorMessage={errors?.qty} isRequired={true} name="qty" onChangeHandler={handleTextChange} type="number" value={purchaseEntryModel.qty} className="form-control-sm" />
                                                </div>
                                                <div className="col-md-2">
                                                    <Inputbox labelText="Unit Price" errorMessage={errors?.unitPrice} isRequired={true} name="unitPrice" onChangeHandler={handleTextChange} type="number" value={purchaseEntryModel.unitPrice} className="form-control-sm" />
                                                </div>
                                                <div className="col-md-2">
                                                    <Inputbox labelText={`VAT ${VAT}%`} disabled={true} errorMessage={errors?.vatAmount} isRequired={true} name="vatAmount" onChangeHandler={handleTextChange} type="number" value={common.printDecimal(purchaseEntryModel.vatAmount)} className="form-control-sm" />
                                                </div>
                                                <div className="col-md-2">
                                                    <Inputbox labelText="Total Price" disabled={true} errorMessage={errors?.totalPrice} isRequired={true} name="totalPrice" onChangeHandler={handleTextChange} type="number" value={common.printDecimal(purchaseEntryModel.totalPrice)} className="form-control-sm" />
                                                </div>
                                                <div className="col-md-8">
                                                    <Inputbox labelText="Description" name="description" onChangeHandler={handleTextChange} value={purchaseEntryModel.description} className="form-control-sm" />
                                                </div>
                                                <div className="col-md-2" style={{ paddingTop: '20px' }}>
                                                    <ButtonBox type="add" onClickHandler={addItems} className="btn-sm" />
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
                            <ButtonBox type="save" onClickHandler={handleSave} className="btn-sm" text={isRecordSaving ? 'Save' : 'Update'}></ButtonBox>
                            <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
