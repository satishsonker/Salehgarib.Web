import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import TableView from '../../tables/TableView';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toast } from 'react-toastify';
import { toastMessage } from '../../../constants/ConstantValues';
import { common } from '../../../utils/common';
import { validationMessage } from '../../../constants/validationMessage';
import Inputbox from '../../common/Inputbox';
import SearchableDropdown from '../../common/SearchableDropdown/SearchableDropdown';
import Label from '../../common/Label';
import ErrorLabel from '../../common/ErrorLabel';
import ButtonBox from '../../common/ButtonBox';
import InputModelBox from '../../common/InputModelBox';

export default function FabricPurchaseDetails({ userData, accessLogin }) {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const purchaseModelTemplete = {
        id: 0,
        fabricId: 0,
        fabricCode: '',
        fabricSize: '',
        brandName: '',
        fabricType: '',
        fabricPrintType: '',
        fabricColor: '',
        fabricColorCode: '',
        purchaseNo: '',
        invoiceNo: '',
        trn: '',
        purchaseDate: common.getHtmlDate(new Date()),
        qty: 0,
        vat: VAT,
        subTotalAmount: 0.0,
        totalAmount: 0.0,
        description: '',
        purchasePrice: 0.0,
        sellPrice: 0.0,
        fabricPurchaseDetails: [],
        totalQty: 0,
        totalSubTotal: 0,
        totalTotal: 0,
        totalVatAmount: 0,
        supplierId: 0,
        contactNo: ''
    }
    const [purchaseModel, setPurchaseModel] = useState(purchaseModelTemplete);
    const [purchaseNumber, setPurchaseNumber] = useState("");
    const [isRecordSaving, setIsRecordSaving] = useState(false);
    const [fabricImageClass, setFabricImageClass] = useState("fabricImage")
    const [fabricCodeList, setFabricCodeList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const [errors, setErrors] = useState();
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [cancelPurchaseState, setCancelPurchaseState] = useState({ orderId: 0, handler: () => { } });
    const [cancelPurchaseDetailsState, setCancelPurchaseDetailsState] = useState({ orderId: 0, handler: () => { } });
    const [deletePurchaseState, setDeletePurchaseState] = useState({ orderId: 0, handler: () => { } });
    const [filter, setFilter] = useState({
        fromDate: common.getHtmlDate(common.addMonthInCurrDate(-12)),
        toDate: common.getHtmlDate(new Date())
    })
    const [fetchData, setFetchData] = useState(0);
    const filterDataChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    }
    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.dropdownController.fabricCodes))
        apiList.push(Api.Get(apiUrls.fabricPurchaseController.getPurchaseNo))
        apiList.push(Api.Get(apiUrls.dropdownController.suppliers))
        Api.MultiCall(apiList)
            .then(res => {
                setFabricCodeList([...res[0].data]);
                setPurchaseNumber(res[1].data);
                setSupplierList([...res[2].data]);
            });
    }, []);

    useEffect(() => {
        Api.Get(apiUrls.fabricPurchaseController.getAllPurchase+ `?pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${filter.fromDate}&toDate=${filter.toDate}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            })
    }, [pageNo, pageSize,fetchData])

    const saveButtonHandler = () => {
        setPurchaseModel({ ...purchaseModelTemplete });
        setErrors({});
        setIsRecordSaving(true);
    }

    const breadcrumbOption = {
        title: 'Fabric Purchase Details',
        items: [
            {
                title: "Fabric Purchase Details",
                icon: "bi bi-broadcast-pin",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Add New Purchase",
                icon: 'bi bi-people',
                modelId: 'add-fabricPurchase',
                handler: saveButtonHandler
            }
        ]
    }
    const hasAdminLogin = () => {
        return accessLogin?.roleName?.toLowerCase() === "superadmin" || accessLogin?.roleName?.toLowerCase() === "admin";
    }
    const handleDelete = (id) => {
        Api.Delete(apiUrls.employeeController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.fabricPurchaseController.searchPurchase + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }

    const handleTextChange = (e) => {
        var { value, type, name } = e.target;
        let data = purchaseModel;

        if (type === 'select-one' && name !== 'fabricCode') {
            value = parseInt(value);
        }
        else if (type === 'number')
            value = parseFloat(value);

        data[name] = value;
        setPurchaseModel({ ...data });

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
        var model = purchaseModel;
        model.totalAmount = common.calculateSum(model.fabricPurchaseDetails, "totalAmount");
        model.vatAmount = common.calculateSum(model.fabricPurchaseDetails, "vatAmount");
        model.qty = common.calculateSum(model.fabricPurchaseDetails, "qty");
        model.subTotalAmount = common.calculateSum(model.fabricPurchaseDetails, "subTotalAmount");
        if (isRecordSaving) {
            Api.Put(apiUrls.fabricPurchaseController.addPurchase, model).then(res => {
                if (res.data) {
                    common.closePopup('closePopupAddFabricPurchase');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.fabricPurchaseController.updatePurchase, model).then(res => {
                if (res.data) {
                    common.closePopup('closePopupAddFabricPurchase');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('all');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (purchaseId) => {

        Api.Get(apiUrls.fabricPurchaseController.getPurchaseById + purchaseId).then(res => {
            if (res.data.id > 0) {
                setIsRecordSaving(false);
                setErrors({});
                var data = res.data;
                Object.keys(data).forEach(x => {
                    if (typeof data[x] === "string")
                        data[x] = data[x].replace("0001-01-01T00:00:00", "").replace("T00:00:00", "");
                });
                res.data.contactNo = res.data.supplier.contact;
                res.data.trn = res.data.supplier.trn;
                res.data.purchaseNo=res.data.purchaseNo;
                setPurchaseModel({ ...res.data });
                selectSupplierHandler(res.data?.supplier?.id);
                fabricPurchaseDetailsTableOptionTemplet.data=res.data?.fabricPurchaseDetails;
                fabricPurchaseDetailsTableOptionTemplet.totalRecords=res.data?.fabricPurchaseDetails?.length;
                setFabricPurchaseDetailsTableOption({ ...fabricPurchaseDetailsTableOptionTemplet });
            }
        });
    };
    const validateError = () => {
        const { invoiceNo, purchaseDate, fabricPurchaseDetails, purchaseNo } = purchaseModel;
        const newError = {};
        if (!purchaseNo || purchaseNo === "") newError.purchaseNo = validationMessage.fabricPurchaseNoRequired;
        if (!invoiceNo || invoiceNo === "") newError.invoiceNo = validationMessage.fabricPurchaseInvoiceNoRequired;
        if (!purchaseDate || purchaseDate === "") newError.purchaseDate = validationMessage.fabricPurchaseDateRequired;
        if (!fabricPurchaseDetails || fabricPurchaseDetails?.length === 0) newError.fabricPurchaseDetails = validationMessage.fabricPurchaseDetailsRequired;
        return newError;
    }
    const validateAddFabricInPurchaseListError = () => {
        const { purchasePrice, sellPrice, qty, fabricId } = purchaseModel;
        const newError = {};
        if (!fabricId || fabricId < 1) newError.brandName = validationMessage.fabricRequired;
        if (!purchasePrice || purchasePrice < 1) newError.purchasePrice = validationMessage.fabricPurchasePriceRequired;
        if (!sellPrice || sellPrice < 1) newError.sellPrice = validationMessage.fabricSellPriceRequired;
        if (!qty || qty < 1) newError.qty = validationMessage.fabricQtyRequired;
        if (sellPrice < purchasePrice) newError.sellPrice = validationMessage.fabricSellPriceCantBeLessThanPurchasePrice;
        return newError;
    }
    const handleView = (id, data) => {
        detailsTableOptionTemplet.data = data?.fabricPurchaseDetails;
        detailsTableOptionTemplet.totalRecords = data?.fabricPurchaseDetails?.length;
        setDetailsTableOption({ ...detailsTableOptionTemplet });
    }
    const handleCancelPurchaseDetails = (id, data) => {

    }
    const handleCancelPurchase = (id, data) => {
        if (data?.isCancelled) {
            toast.warn(toastMessage.alreadyCancelled);
            return;
        }
        var ele = document.getElementById('cancelPurchaseOpener');
        ele.click();
        var note = "";
        let state = {
            id,
            handler: (id, note) => {
                debugger;
                Api.Post(apiUrls.fabricPurchaseController.cancelPurchase + `${id}?note=${note}`, {}).then(res => {
                    if (res.data) {
                        handleSearch('');
                        toast.success("Cancelled successfully!");
                    }
                }).catch(err => {
                    toast.error(toastMessage.getError);
                })
            },
            note: note
        }
        setCancelPurchaseState({ ...state })
    }
    const changeRowClassHandler = (data, prop, rIndex, hIndex) => {
        if (data?.fabricPurchaseDetails.filter(x => x.isCancelled)?.length > 0) {
            return " bg-warning";
        }
    }
    const tableOptionTemplet = {
        headers: headerFormat.fabricPurchase,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showPrint: true,
            popupModelId: "add-fabricPurchase",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            },
            view: {
                handler: handleView
            },
            print: {
                //handler: printOrderReceiptHandlerMain,
                title: "Print Order Receipt",
                modelId: 'printOrderReceiptPopupModal'
            },
            buttons: [
                {
                    modelId: "kandoora-photo-popup-model",
                    icon: "bi bi-x-circle",
                    title: 'Cancel Purchase',
                    handler: handleCancelPurchase,
                    showModel: true
                }
            ]
        },
        changeRowClassHandler: changeRowClassHandler
    };
    const detailsTableOptionTemplet = {
        headers: headerFormat.fabricPurchaseDetails,
        data: [],
        showPagination: false,
        showTableTop: false,
        totalRecords: 0,
        actions: {
            showView: false,
            edit: {
                handler: handleCancelPurchaseDetails,
                icon: "bi bi-x-circle",
                title: "Cancel Fabric"
            },
            showDelete: false
        }
    };
    const deleteFabricInPurchaseList = (id, data, index) => {
        var model = purchaseModel;
        var newDetail = [];
        model.fabricPurchaseDetails.forEach((element, ind) => {
            if (index != ind) {
                newDetail.push(element);
            }
        });
        model.fabricPurchaseDetails = newDetail;
        fabricPurchaseDetailsTableOptionTemplet.data = newDetail;
        fabricPurchaseDetailsTableOptionTemplet.totalRecords = newDetail.length;
        setFabricPurchaseDetailsTableOption({ ...fabricPurchaseDetailsTableOptionTemplet });
        setPurchaseModel({ ...model });
    }
    const fabricPurchaseDetailsTableOptionTemplet = {
        headers: headerFormat.fabricPurchaseDetails,
        data: [],
        showPagination: false,
        showTableTop: false,
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        tableInCard: false,
        actions: {
            showView: false,
            showEdit: false,
            delete: {
                handler: deleteFabricInPurchaseList,
                showModel: false
            },
        }
    };
    const selectFabricCodeHandler = (data) => {
        if (data.value !== null && data.value !== '') {
            Api.Get(apiUrls.fabricMasterController.fabric.getFabricByCode + data.value)
                .then(res => {
                    if (res.data) {
                        var fabric = res.data;
                        var modal = purchaseModel;
                        modal.brandName = fabric.brandName;
                        modal.fabricType = fabric.fabricTypeName;
                        modal.fabricSize = fabric.fabricSizeName;
                        modal.fabricPrintType = fabric.fabricPrintType;
                        modal.imagePath = fabric.fabricImagePath;
                        modal.fabricColor = fabric.fabricColorName;
                        modal.fabricColorCode = fabric.fabricColorCode;
                        modal.fabricId = fabric.id;
                        modal.fabricCode = data.value;
                        setPurchaseModel({ ...modal });
                    }
                })
        }
    }

    const selectSupplierHandler = (data) => {
        if (data.value !== null && data.value !== '') {
            var modal = purchaseModel;
            var supplier = supplierList.find(x => x.id === data?.id);
            if (supplier !== undefined) {
                modal.contactNo = supplier.data.contact;
                modal.trn = supplier.data.trn;
                setPurchaseModel({ ...modal });
            }
        }
    }
    const addFabricInPurchaseList = () => {
        var formError = validateAddFabricInPurchaseListError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        var _subTotal = purchaseModel.qty * purchaseModel.purchasePrice;
        var _vatAmount = common.calculateVAT(_subTotal, VAT).vatAmount;
        var modal = purchaseModel;

        _vatAmount = isNaN(_vatAmount) ? 0 : _vatAmount;

        if (modal.fabricPurchaseDetails.filter(x => x.fabricId === purchaseModel.fabricId).length > 0) {
            toast.warning(validationMessage.fabricAlreadyAdded)
            return;
        }

        var newData = {
            id: 0,
            brandName: purchaseModel.brandName,
            fabricTypeName: purchaseModel.fabricType,
            fabricSizeName: purchaseModel.fabricSize,
            fabricPrintType: purchaseModel.fabricPrintType,
            imagePath: purchaseModel.fabricImagePath,
            fabricColorName: purchaseModel.fabricColor,
            fabricColorCode: purchaseModel.fabricColorCode,
            fabricPurchaseId: 0,
            description: purchaseModel.description,
            fabricCode: purchaseModel.fabricCode,
            fabricId: purchaseModel.fabricId,
            qty: purchaseModel.qty,
            purchasePrice: purchaseModel.purchasePrice,
            vat: VAT,
            sellPrice: purchaseModel.sellPrice,
            subTotalAmount: _subTotal,
            vatAmount: _vatAmount,
            totalAmount: (_subTotal) + _vatAmount
        }
        modal.fabricPurchaseDetails.push(newData);
        modal.brandName = '';
        modal.fabricType = '';
        modal.fabricSize = '';
        modal.fabricPrintType = '';
        modal.fabricImagePath = '';
        modal.fabricColor = '';
        modal.fabricColorCode = '';
        modal.fabricCode = "";
        modal.fabricId = 0;
        modal.totalQty += modal.qty;
        modal.qty = 0;
        modal.purchasePrice = 0.00;
        modal.sellPrice = 0;
        modal.totalSubTotal += _subTotal;
        modal.totalTotal += _subTotal + _vatAmount;
        modal.totalVatAmount += _vatAmount;
        modal.purchaseNo = purchaseNumber;
        modal.description = "";
        setPurchaseModel({ ...modal });
        fabricPurchaseDetailsTableOptionTemplet.data = modal.fabricPurchaseDetails;
        fabricPurchaseDetailsTableOptionTemplet.totalRecords = modal.fabricPurchaseDetails.length;
        setFabricPurchaseDetailsTableOption({ ...fabricPurchaseDetailsTableOptionTemplet });
    }
    // const getFilteredFabric = () => {
    //     return fabricList?.filter(x => x.fabricSubTypeId === purchaseModel.fabricSubTypeId && x.brandId === purchaseModel.fabricBrandId);
    // }
    const [detailsTableOption, setDetailsTableOption] = useState(detailsTableOptionTemplet);
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [fabricPurchaseDetailsTableOption, setFabricPurchaseDetailsTableOption] = useState(fabricPurchaseDetailsTableOptionTemplet)
    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div className="d-flex justify-content-between">
                <div>
                    <h6 className="mb-0 text-uppercase">Fabric Purchase Details</h6>
                </div>
                {hasAdminLogin() && <>
                    <div className="d-flex justify-content-end">
                        <div className='mx-2'>
                            <span> From Date</span>
                            <Inputbox type="date" name="fromDate" value={filter.fromDate} max={filter.toDate} onChangeHandler={filterDataChangeHandler} className="form-control-sm" showLabel={false} />
                        </div>
                        <div className='mx-2'>
                            <span> To Date</span>
                            <Inputbox type="date" name="toDate" min={filter.fromDate} value={filter.toDate} onChangeHandler={filterDataChangeHandler} className="form-control-sm" showLabel={false} />
                        </div>
                        <div className='mx-2 my-3 py-1'>
                            <ButtonBox type="go" onClickHandler={e => { setFetchData(x => x + 1) }} className="btn-sm"></ButtonBox>
                        </div>
                    </div>
                </>}
            </div>
            <hr />
            <TableView option={tableOption}></TableView>
            {detailsTableOption.totalRecords > 0 && <TableView option={detailsTableOption}></TableView>}
            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-fabricPurchase" className="modal fade in" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Fabric Purchase</h5>
                            <button type="button" id='closePopupAddFabricPurchase' className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body" style={{ paddingBottom: 0 }}>
                            <div className="form-horizontal form-material" style={{ paddingBottom: 0 }}>
                                <div className="card" style={{ paddingBottom: 0 }}>
                                    <div className="card-body" style={{ paddingBottom: 0 }}>
                                        <div className='row'>
                                            <div className='col-10'>
                                                <div className='row'>
                                                    <div className="col-4">
                                                        <Inputbox labelText="Purchase No." value={purchaseNumber} errorMessage={errors?.purchaseNo} disabled={true} className="form-control-sm" />
                                                    </div>
                                                    <div className="col-4">
                                                        <Inputbox isRequired={true} type="date" max={common.getHtmlDate(new Date())} labelText="Purchase Date" name="purchaseDate" value={purchaseModel.purchaseDate} errorMessage={errors?.purchaseDate} className="form-control-sm" onChangeHandler={handleTextChange} />
                                                    </div>
                                                    <div className="col-4">
                                                        <Inputbox isRequired={true} labelText="Invoice No." name="invoiceNo" value={purchaseModel.invoiceNo} errorMessage={errors?.invoiceNo} className="form-control-sm" onChangeHandler={handleTextChange} />
                                                    </div>
                                                    <div className='col-4'>
                                                        <Label fontSize="12px" text="Supplier" isRequired={true}></Label>
                                                        <SearchableDropdown data={supplierList} text="value" name="supplierId" value={purchaseModel.supplierId} className="form-control-sm" itemOnClick={selectSupplierHandler} onChange={handleTextChange} />
                                                        <ErrorLabel message={errors?.supplierId} />
                                                    </div>
                                                    <div className="col-4">
                                                        <Inputbox disabled={true} isRequired={false} labelText="TRN No." name="trn" value={purchaseModel.trn} errorMessage={errors?.trn} className="form-control-sm" onChangeHandler={handleTextChange} />
                                                    </div>
                                                    <div className="col-4">
                                                        <Inputbox disabled={true} labelText="Contact No." name="contactNo" value={purchaseModel.contactNo} errorMessage={errors?.description} className="form-control-sm" onChangeHandler={handleTextChange} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-2'>
                                                <img className={fabricImageClass} onClick={() => { setFabricImageClass(fabricImageClass === "fabricImage" ? "fabricImageHover" : "fabricImage") }} src={purchaseModel.imagePath !== "" && purchaseModel.imagePath !== undefined ? process.env.REACT_APP_API_URL + purchaseModel.imagePath : "/assets/images/default-image.jpg"}></img>
                                                <small className='text-danger' style={{ cursor: 'pointer' }} onClick={() => { setFabricImageClass(fabricImageClass === "fabricImage" ? "fabricImageHover" : "fabricImage") }}>Click on image to zoom</small>
                                            </div>
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-3">
                                                <Label fontSize="12px" text="Fabric Code" isRequired={true}></Label>
                                                <SearchableDropdown data={fabricCodeList} text="value" elementKey="value" name="fabricCode" value={purchaseModel.fabricCode} className="form-control-sm" itemOnClick={selectFabricCodeHandler} onChange={handleTextChange} />
                                                <ErrorLabel message={errors?.fabricBrandId} />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox disabled={true} isRequired={false} labelText="Brand" name="brand" value={purchaseModel.brandName} errorMessage={errors?.brandName} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox disabled={true} isRequired={false} labelText="F. Type" name="fabricType" value={purchaseModel.fabricType} errorMessage={errors?.fabricType} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox disabled={true} isRequired={false} labelText="F. Color" name="fabricColor" value={purchaseModel.fabricColor} errorMessage={errors?.fabricColor} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox disabled={true} isRequired={false} labelText="F. Size" name="fabricSize" value={purchaseModel.fabricSize} errorMessage={errors?.fabricSize} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox disabled={true} isRequired={false} labelText="F. Print Type" name="fabricPrintType" value={purchaseModel.fabricPrintType} errorMessage={errors?.fabricPrintType} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-2">
                                                <Inputbox isRequired={true} min={1} max={999999} type="number" labelText="Qty" name="qty" value={purchaseModel.qty} errorMessage={errors?.qty} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-2">
                                                <Inputbox isRequired={true} min={1} max={999999} type="number" labelText="Purchase Price" name="purchasePrice" value={purchaseModel.purchasePrice} errorMessage={errors?.purchasePrice} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-2">
                                                <Inputbox isRequired={true} min={1} max={999999} type="number" labelText="Sell Price" name="sellPrice" value={purchaseModel.sellPrice} errorMessage={errors?.sellPrice} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className='col-10'>
                                                <Inputbox labelText="Description" name="description" value={purchaseModel.description} errorMessage={errors?.description} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-2 py-4">
                                                <ButtonBox type='add' onClickHandler={addFabricInPurchaseList} className='btn-sm' style={{ width: "100%" }}></ButtonBox>
                                            </div>
                                            <div className="col-12" style={{ paddingTop: 0, marginTop: 0 }}>
                                                <ErrorLabel message={errors?.fabricPurchaseDetails} />
                                                <TableView option={fabricPurchaseDetailsTableOption} />
                                            </div>
                                            <div className="col-3" style={{ marginBottom: '20px' }}>
                                                <Inputbox isRequired={false} disabled={true} labelText="Total Qty" value={purchaseModel.totalQty} className="form-control-sm" />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox isRequired={false} disabled={true} labelText="Sub Total" value={purchaseModel.totalSubTotal?.toFixed(2)} className="form-control-sm" />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox isRequired={false} disabled={true} labelText="Total VAT" value={purchaseModel.totalVatAmount?.toFixed(2)} className="form-control-sm" />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox isRequired={false} disabled={true} labelText="Total Amount" value={purchaseModel.totalTotal?.toFixed(2)} className="form-control-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? 'Save' : 'Update'} text={isRecordSaving ? 'Save' : 'Update'} onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} modalId="closePopupAddFabricPurchase" className="btn-sm" />
                        </div>
                    </div>
                </div>
            </div>
            <div id='cancelPurchaseOpener' data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#cancelPurchaseConfirmModel" style={{ display: 'none' }} />
            <InputModelBox
                modelId="cancelPurchaseConfirmModel"
                title="Cancel Purchase Confirmation"
                message="Are you sure want to cancel the purchase!"
                dataId={cancelPurchaseState.id}
                labelText="Cancel Reason"
                handler={cancelPurchaseState.handler}
                buttonText="Cancel Purchase"
                cancelButtonText="Close"
                note={cancelPurchaseState.note}
                isInputRequired={true}
            ></InputModelBox>
        </>
    )
}
