import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView';
import { headerFormat } from '../../utils/tableHeaderFormat';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import { validationMessage } from '../../constants/validationMessage';
import Inputbox from '../common/Inputbox';
import Dropdown from '../common/Dropdown';
import Label from '../common/Label';
import ErrorLabel from '../common/ErrorLabel';
import { Button } from 'react-bootstrap';
import ButtonBox from '../common/ButtonBox';
import InputModelBox from '../common/InputModelBox';

export default function FabricPurchaseDetails() {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const purchaseModelTemplete = {
        id: 0,
        fabricId: 0,
        fabricSizeId: 0,
        fabricBrandId: 0,
        fabricTypeId: 0,
        fabricSubTypeId: 0,
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
        totalVatAmount: 0
    }
    const [purchaseModel, setPurchaseModel] = useState(purchaseModelTemplete);
    const [purchaseNumber, setPurchaseNumber] = useState("");
    const [isRecordSaving, setIsRecordSaving] = useState(false);
    const [fabricTypeList, setFabricTypeList] = useState([])
    const [fabricSubTypeList, setFabricSubTypeList] = useState([])
    const [fabricBrandList, setFabricBrandList] = useState([])
    const [fabricSizeList, setFabricSizeList] = useState([])
    const [fabricList, setFabricList] = useState([])
    const [errors, setErrors] = useState();
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [cancelPurchaseState, setCancelPurchaseState] = useState({ orderId: 0, handler: () => { } });
    const [cancelPurchaseDetailsState, setCancelPurchaseDetailsState] = useState({ orderId: 0, handler: () => { } });
    const [deletePurchaseState, setDeletePurchaseState] = useState({ orderId: 0, handler: () => { } });

    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.fabricMasterController.brand.getAllBrand + "?pageNo=1&pageSize=10000000"))
        apiList.push(Api.Get(apiUrls.fabricMasterController.size.getAllSize + "?pageNo=1&pageSize=10000000"))
        apiList.push(Api.Get(apiUrls.fabricMasterController.type.getAllType + "?pageNo=1&pageSize=10000000"))
        apiList.push(Api.Get(apiUrls.fabricMasterController.subType.getAllSubType + "?pageNo=1&pageSize=10000000"))
        apiList.push(Api.Get(apiUrls.fabricPurchaseController.getPurchaseNo))
        apiList.push(Api.Get(apiUrls.fabricMasterController.fabric.getAllFabric));
        Api.MultiCall(apiList)
            .then(res => {
                setFabricBrandList([...res[0].data.data]);
                setFabricSizeList([...res[1].data.data]);
                setFabricTypeList([...res[2].data.data]);
                setFabricSubTypeList([...res[3].data.data]);
                setPurchaseNumber(res[4].data);
                setFabricList([...res[5].data.data]);
            });
    }, []);

    useEffect(() => {
        Api.Get(apiUrls.fabricPurchaseController.getAllPurchase)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption(tableOptionTemplet);
            })
    }, [pageNo, pageSize])



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
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, type, name } = e.target;
        let data = purchaseModel;

        if (type === 'select-one') {
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
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (employeeId) => {

        Api.Get(apiUrls.employeeController.get + employeeId).then(res => {
            if (res.data.id > 0) {
                setIsRecordSaving(false);
                setErrors({});
                var data = res.data;
                Object.keys(data).forEach(x => {
                    if (typeof data[x] === "string")
                        data[x] = data[x].replace("0001-01-01T00:00:00", "").replace("T00:00:00", "");
                });
                setPurchaseModel({ ...res.data });
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
        const { fabricBrandId, fabricSubTypeId, purchasePrice, sellPrice, qty, fabricId } = purchaseModel;
        const newError = {};
        if (!fabricBrandId || fabricBrandId === 0) newError.fabricBrandId = validationMessage.fabricBrandNameRequired;
        if (!fabricSubTypeId || fabricSubTypeId === 0) newError.fabricSubTypeId = validationMessage.fabricSubTypeNameRequired;
        if (!purchasePrice || purchasePrice < 1) newError.purchasePrice = validationMessage.fabricPurchasePriceRequired;
        if (!sellPrice || sellPrice < 1) newError.sellPrice = validationMessage.fabricSellPriceRequired;
        if (!qty || qty < 1) newError.qty = validationMessage.fabricQtyRequired;
        if (!fabricId || fabricId === 0) newError.fabricId = validationMessage.fabricRequired;
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
                Api.Get(apiUrls.fabricPurchaseController.cancelPurchase + `/${id}?note=${note}`).then(res => {
                    if (res.data > 0) {
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
        }
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
    const addFabricInPurchaseList = () => {
        var formError = validateAddFabricInPurchaseListError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        var _subTotal = purchaseModel.qty * purchaseModel.purchasePrice;
        var _vatAmount = common.calculateVAT(_subTotal, VAT).vatAmount;
        _vatAmount = isNaN(_vatAmount) ? 0 : _vatAmount;
        var newData = {
            id: 0,
            brandName: fabricBrandList.find(x => x.id === purchaseModel.fabricBrandId)?.name ?? "",
            fabricSizeName: fabricSizeList.find(x => x.id === purchaseModel.fabricSizeId)?.name ?? "",
            fabricSubTypeName: fabricSubTypeList.find(x => x.id === purchaseModel.fabricSubTypeId)?.name ?? "",
            fabricCode: fabricList.find(x => x.id === purchaseModel.fabricId)?.fabricCode ?? "",
            fabricTypeName: fabricTypeList.find(x => x.id === purchaseModel.fabricTypeId)?.name ?? "",
            fabricPurchaseId: 0,
            fabricId: purchaseModel.fabricId,
            sizeId: purchaseModel.fabricSizeId,
            qty: purchaseModel.qty,
            purchasePrice: purchaseModel.purchasePrice,
            vat: VAT,
            sellPrice: purchaseModel.sellPrice,
            subTotalAmount: _subTotal,
            vatAmount: _vatAmount,
            totalAmount: (_subTotal) + _vatAmount
        }
        var modal = purchaseModel;
        modal.fabricPurchaseDetails.push(newData);
        modal.fabricId = 0;
        modal.fabricBrandId = 0;
        modal.fabricSizeId = 0;
        modal.fabricSubTypeId = 0;
        modal.fabricTypeId = 0;
        modal.totalQty += modal.qty;
        modal.qty = 0;
        modal.purchasePrice = 0.00;
        modal.sellPrice = 0;
        modal.totalSubTotal += _subTotal;
        modal.totalTotal += _subTotal + _vatAmount;
        modal.totalVatAmount += _vatAmount;
        modal.purchaseNo = purchaseNumber;
        setPurchaseModel({ ...modal });
        fabricPurchaseDetailsTableOptionTemplet.data = modal.fabricPurchaseDetails;
        fabricPurchaseDetailsTableOptionTemplet.totalRecords = modal.fabricPurchaseDetails.length;
        setFabricPurchaseDetailsTableOption({ ...fabricPurchaseDetailsTableOptionTemplet });
    }
    const getFilteredFabric = () => {
        return fabricList?.filter(x => x.fabricSubTypeId === purchaseModel.fabricSubTypeId && x.brandId === purchaseModel.fabricBrandId);
    }
    const [detailsTableOption, setDetailsTableOption] = useState(detailsTableOptionTemplet);
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [fabricPurchaseDetailsTableOption, setFabricPurchaseDetailsTableOption] = useState(fabricPurchaseDetailsTableOptionTemplet)
    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <h6 className="mb-0 text-uppercase">Fabric Purchase Deatils</h6>
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
                                        <div className="row g-3">
                                            <div className="col-2">
                                                <Inputbox labelText="Purchase No." value={purchaseNumber} errorMessage={errors?.purchaseNo} disabled={true} className="form-control-sm" />
                                            </div>
                                            <div className="col-2">
                                                <Inputbox isRequired={true} type="date" max={common.getHtmlDate(new Date())} labelText="Purchase Date" name="purchaseDate" value={purchaseModel.purchaseDate} errorMessage={errors?.purchaseDate} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox isRequired={true} labelText="Invoice No." name="invoiceNo" value={purchaseModel.invoiceNo} errorMessage={errors?.invoiceNo} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-5">
                                                <Inputbox isRequired={false} labelText="TRN No." name="trn" value={purchaseModel.trn} errorMessage={errors?.trn} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-12">
                                                <Inputbox labelText="Description" name="description" value={purchaseModel.description} errorMessage={errors?.description} className="form-control-sm" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-3">
                                                <Label fontSize="12px" text="Brand" isRequired={true}></Label>
                                                <Dropdown data={fabricBrandList} text="name" name="fabricBrandId" value={purchaseModel.fabricBrandId} className="form-control-sm" onChange={handleTextChange} />
                                                <ErrorLabel message={errors?.fabricBrandId} />
                                            </div>
                                            <div className="col-3">
                                                <Label fontSize="12px" text="Fabric Type" isRequired={true}></Label>
                                                <Dropdown data={fabricTypeList} text="name" name="fabricTypeId" value={purchaseModel.fabricTypeId} className="form-control-sm" onChange={handleTextChange} />
                                                <ErrorLabel message={errors?.fabricTypeId} />
                                            </div>
                                            <div className="col-3">
                                                <Label fontSize="12px" text="Fabric Sub Type" isRequired={true}></Label>
                                                <Dropdown data={fabricSubTypeList.filter(x => x?.fabricTypeId === purchaseModel?.fabricTypeId)} text="name" name="fabricSubTypeId" value={purchaseModel.fabricSubTypeId} className="form-control-sm" onChange={handleTextChange} />
                                                <ErrorLabel message={errors?.fabricSubTypeId} />
                                            </div>
                                            <div className="col-3">
                                                <Label fontSize="12px" text="Fabric Size" isRequired={true}></Label>
                                                <Dropdown data={fabricSizeList} text="name" name="fabricSizeId" value={purchaseModel.fabricSizeId} className="form-control-sm" onChange={handleTextChange} />
                                                <ErrorLabel message={errors?.fabricSizeId} />
                                            </div>
                                            <div className="col-3">
                                                <Label fontSize="12px" text="Fabric" isRequired={true}></Label>
                                                <Dropdown data={getFilteredFabric()} text="fabricCode" name="fabricId" value={purchaseModel.fabricId} className="form-control-sm" onChange={handleTextChange} />
                                                <ErrorLabel message={errors?.fabricId} />
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
                                                <Inputbox isRequired={false} disabled={true} labelText="Sub Total" value={purchaseModel.totalSubTotal} className="form-control-sm" />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox isRequired={false} disabled={true} labelText="Total VAT" value={purchaseModel.totalVatAmount} className="form-control-sm" />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox isRequired={false} disabled={true} labelText="Total Amount" value={purchaseModel.totalTotal} className="form-control-sm" />
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
                message="Are you sure want to cancel the order!"
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
