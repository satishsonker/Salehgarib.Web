import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import Inputbox from '../../common/Inputbox';
import { common } from '../../../utils/common';
import Label from '../../common/Label';
import ButtonBox from '../../common/ButtonBox';
import { validationMessage } from '../../../constants/validationMessage';
import { toast } from 'react-toastify';
import { toastMessage } from '../../../constants/ConstantValues';
import SearchableDropdown from '../../common/SearchableDropdown/SearchableDropdown';
import ErrorLabel from '../../common/ErrorLabel';
import TableView from '../../tables/TableView';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import Dropdown from '../../common/Dropdown';
import ReactToPrint from 'react-to-print';
import PrintFabricSaleInvoice from '../Print/PrintFabricSaleInvoice';
import ImageWithFallback from '../../common/ImageWithFallback';

export default function FabricSaleForm({ isOpen, onClose, refreshParentGrid }) {
    var printRef = useRef();
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const saleModelTemplate = {
        saleMode: 'general',
        invoiceNo: '00001',
        primaryContact: '',
        firstName: '',
        lastName: '',
        trn: '',
        fabricCode: '',
        fabricColor: '',
        fabricSize: '',
        fabricType: '',
        fabricPrintType: '',
        fabricBrand: '',
        qty: '',
        salePrice: 0,
        totalAmount: 0,
        subTotalAmount: 0,
        vatAmount: 0,
        customerId: 0,
        saleDate: common.getHtmlDate(new Date()),
        deliveryDate: common.getHtmlDate(new Date()),
        city: '',
        fabricId: 0,
        salesmanId: 0,
        fabricImagePath: '',
        fabricColorCode: '',
        saleMode: '',
        minSaleAmount: 0,
        paymentMode: 'Cash',
        discountType: 'NO',
        paidAmount: 0,
        discount: 0,
        balanceAmount: 0,
        discountAmount: 0,
        description: '',
        fabricSaleDetails: []
    }
    const [fabricImageClass, setFabricImageClass] = useState("fabricImage")
    const [refreshInvoiceNo, setRefreshInvoiceNo] = useState(0);
    const [customerList, setCustomerList] = useState([]);
    const [cityList, setCityList] = useState([])
    const [paymentModeList, setPaymentModeList] = useState([]);
    const [discountTypeList, setDiscountTypeList] = useState([]);
    const [salesmanList, setSalesmanList] = useState([]);
    const [fabricList, setFabricList] = useState([])
    const [saleModel, setSaleModel] = useState(saleModelTemplate);
    const [error, setError] = useState();
    const [hasCustomer, setHasCustomer] = useState(false);
    const [contentIndex, setContentIndex] = useState(0);

    const onCloseForm = (resetOnly) => {
        setContentIndex(0);
        setSaleModel({ ...saleModelTemplate });
        if (!resetOnly)
            onClose();
        refreshParentGrid(pre => pre + 1);
        setRefreshInvoiceNo(pre => pre + 1);
        setTableOption({ ...tableOptionTemplate });
    }

    const calculateGrandTotal = () => {
        if (!saleModel?.fabricSaleDetails?.length) return {};
    
        // Step 1: Calculate subtotal
        const subtotal = saleModel.fabricSaleDetails.reduce((sum, { subTotalAmount }) => sum + subTotalAmount, 0);
    
        // Step 2: Calculate discount amount based on discount type
        const discountAmount = saleModel.discount > 0 
            ? saleModel.discountType?.toLowerCase() === "percent" 
                ? common.calculatePercent(subtotal, saleModel.discount) 
                : saleModel.discount 
            : 0;
    
        // Step 3: Calculate VAT on discounted subtotal
        const discountedSubtotal = subtotal - discountAmount;
        const { vatAmount, amountWithVat: totalAmount } = common.calculateVAT(discountedSubtotal, VAT);
    
        // Step 4: Calculate balance amount
        const paidAmount = isNaN(saleModel.paidAmount) ? 0 : saleModel.paidAmount;
        const balanceAmount = totalAmount - paidAmount;
    
        // Step 5: Calculate total quantity
        const qty = saleModel.fabricSaleDetails.reduce((sum, { qty }) => sum + qty, 0);
    
        return {
            subtotal,
            discountAmount,
            discountedSubtotal,
            vatAmount,
            totalAmount,
            afterDiscount: totalAmount,
            balanceAmount,
            qty,
            paidAmount: totalAmount,
        };
    };
    
    useEffect(() => {
        if (customerList?.length === 0) {
            var apiList = [];
            apiList.push(Api.Get(apiUrls.fabricMasterController.Customer.getAll + `?pageNo=1&pageSize=1000000`));
            apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + `?masterDataTypes=city&masterDataTypes=payment_mode`));
            apiList.push(Api.Get(apiUrls.dropdownController.employee + `?SearchTerm=salesman`));
            apiList.push(Api.Get(apiUrls.fabricMasterController.fabric.getAllFabric + `?pageNo=1&pageSize=1000000`));
            apiList.push(Api.Get(apiUrls.fabricMasterController.discountType.getAllDiscountType));
            Api.MultiCall(apiList)
                .then(res => {
                    setCustomerList(res[0]?.data?.data)
                    setCityList(res[1]?.data?.filter(x => x.masterDataTypeCode === 'city'));
                    setPaymentModeList(res[1]?.data?.filter(x => x.masterDataTypeCode === 'payment_mode'));
                    setSalesmanList(res[2]?.data);
                    setFabricList(res[3].data.data);
                    setDiscountTypeList(res[4].data.data);
                });
        }
    }, []);

    useEffect(() => {
        Api.Get(apiUrls.fabricSaleController.getSaleInvoiceNumber)
            .then(res => {
                setSaleModel({ ...saleModel, ["invoiceNo"]: res.data });
            })
    }, [refreshInvoiceNo])

    useEffect(() => {
        if(!saleModel.fabricId || saleModel.fabricId<=0)
            return;
       var filteredFabric= fabricList?.find(x=>x.id===saleModel.fabricId);
        var modal = saleModel;
        modal.fabricBrand = filteredFabric?.brandName;
        modal.fabricType = filteredFabric?.fabricTypeName;
        modal.fabricSize = filteredFabric?.fabricSizeName;
        modal.fabricPrintType = filteredFabric?.fabricPrintType;
        modal.fabricImagePath = filteredFabric?.fabricImagePath;
        modal.fabricColor = filteredFabric?.fabricColorName;
        modal.fabricColorCode = filteredFabric?.fabricColorCode;
        modal.fabricId = filteredFabric?.id;
        modal.minSaleAmount=filteredFabric?.fabricSaleModeMapper?.minSaleAmount??0;
        modal.saleMode=filteredFabric?.fabricSaleModeMapper?.shortName??"GEN";
        modal.qty = 0;
        modal.salePrice = 0;
        modal.subTotalAmount = 0;
        modal.vatAmount = 0;
        modal.totalAmount = 0;
        setSaleModel({ ...saleModel });
    }, [saleModel.fabricId]);

    const textChangeHandler = (e) => {
        var { name, type, value } = e.target;
        var model = saleModel;
        if (name === 'primaryContact' && value.length > 6) {
            var customer = customerList.find(x => x.primaryContact === value);
            if (customer !== undefined) {
                setHasCustomer(true);
                model.firstName = customer?.firstName;
                model.lastName = customer?.lastName;
                model.trn = customer.trn;
                model.primaryContact = customer?.primaryContact;
                model.customerId = customer?.id;
            }
            else {
                setHasCustomer(false);
                model.firstName = '';
                model.lastName = '';
                model.trn = '';
                model.customerId = 0;
            }
        }

        if (type === 'number') {
            value = parseFloat(value);
            value = isNaN(value) ? 0 : value;
        }
        else if (type === 'select-one' && name !== 'fabricCode' && name !== 'city' && name !== 'paymentMode' && name !== 'discountType') {
            value = parseInt(value);
        }
        if (name === 'salePrice' || name === 'qty') {
            model.subTotalAmount = name === 'qty' ? model.salePrice * value : model.qty * value;
            var vatCalculate = common.calculateVAT(model.subTotalAmount, VAT);
            model.vatAmount = vatCalculate.vatAmount;
            model.totalAmount = vatCalculate.amountWithVat
            model.paidAmount = vatCalculate.amountWithVat - saleModel.discountAmount
        }


        if (name === 'salesmanId') {
            var salesman = salesmanList.find(x => x.id === value);
            if (salesman !== undefined) {
                model.salesman = `${salesman.value}`;
            }
        }
        setSaleModel({ ...saleModel, [name]: value });
    }

    const saveCustomer = () => {
        var err = {};
        if (saleModel.primaryContact?.length < 1)
            err.primaryContact = validationMessage.contactRequired;
        else if (saleModel.primaryContact?.length < 6)
            err.primaryContact = validationMessage.invalidContact;

        if (saleModel.firstName?.length < 1)
            err.firstName = validationMessage.firstNameRequired;

        setError({ ...err });
        if (Object.keys(err).length > 0)
            return;

        Api.Put(apiUrls.fabricMasterController.Customer.add, saleModel)
            .then(res => {
                if (res.data?.id > 0) {
                    var modal = saleModel;
                    modal.firstName = res?.data?.firstName;
                    modal.lastName = res?.data?.lastName;
                    modal.trn = res?.data?.trn;
                    setSaleModel({ ...modal });
                    setHasCustomer(true);
                }
                else
                    setHasCustomer(false);
            }).catch(er => {
                toast.warn(toastMessage.saveError);
            });
    }

    const validateAddFabric = () => {
        var err = {};
        
        if (saleModel.fabricId < 1 || isNaN(saleModel.fabricId)) err.fabricCode = validationMessage.fabricRequired;
        if (saleModel.salePrice < 1) err.salePrice = validationMessage.fabricSalePriceRequired;
        if (saleModel.qty < 1) err.qty = validationMessage.quantityRequired;
        if (saleModel.salePrice > 0 && (saleModel.salePrice < saleModel.minSaleAmount)) err.salePrice = validationMessage.fabricSalePriceInvalidAsPerSaleMode(saleModel.minSaleAmount, saleModel.saleMode);
        var selectedFabric=fabricList.find(x=>x.id===saleModel.fabricId);
        if(!selectedFabric)
        {
            err.fabricCode = validationMessage.fabricNotFound;
        }
        else{
            //selectedFabric
        }
        setError({ ...err });
        return err;
    }

    const validateSaveSale = () => {
        var err = {};
        var invoiceNo = parseInt(saleModel.invoiceNo);
        if (isNaN(invoiceNo) || saleModel.invoiceNo < 1) err.invoiceNo = validationMessage.fabricSaleInvoiceNoRequired;
        if (isNaN(saleModel.customerId) || saleModel.customerId < 1) err.primaryContact = validationMessage.customerRequired;
        if (saleModel.saleDate === "") err.saleDate = validationMessage.fabricSaleDateRequired;
        if (saleModel.deliveryDate === "") err.deliveryDate = validationMessage.deliveryDateRequired;
        if (isNaN(saleModel.salesmanId) || saleModel.salesmanId < 1) err.salesmanId = validationMessage.salesmanRequired;
        setError({ ...err });
        return err;
    }

    const deleteFabricFromListHandler = (id, data) => {
        var filterData = saleModel.fabricSaleDetails.filter(x => x.fabricId !== data?.fabricId);
        var modal = saleModel;
        modal.fabricCode = '';
        modal.fabricId = 0;
        modal.fabricSaleDetails = filterData;
        setSaleModel({ ...modal });
        tableOptionTemplate.data = filterData;
        tableOptionTemplate.totalRecords = filterData?.length;
        setTableOption({ ...tableOptionTemplate });
    }

    const handleSave = useCallback(() => {
        var err = validateSaveSale();
        if (Object.keys(err).length > 0)
            return;
        var dataModel = saleModel;
        var calculateTotals = calculateGrandTotal();
        dataModel.subTotalAmount = calculateTotals?.subtotal;
        dataModel.vatAmount = calculateTotals?.vatAmount;
        dataModel.totalAmount=calculateTotals?.totalAmount;
        dataModel.balanceAmount = calculateTotals.balanceAmount;
        dataModel.discountAmount = calculateTotals.discountAmount;
        dataModel.qty = calculateTotals.qty;
        dataModel.fabricCustomerId = saleModel.customerId;
        Api.Put(apiUrls.fabricSaleController.add, dataModel)
            .then(res => {
                if (res?.data?.length > 3) {
                    toast.success(toastMessage.saveSuccess);
                    setContentIndex(1);
                }
            });
    }, [saleModel])

    const addFabricInListHandler = () => {
        var err = validateAddFabric();
        if (Object.keys(err).length > 0)
            return;

        var isFabricExist = saleModel.fabricSaleDetails.find(x => x.fabricId === saleModel.fabricId);
        if (isFabricExist !== undefined) {
            toast.warning(validationMessage.fabricAlreadyAdded);
            return;
        }
        var modal = saleModel;
        modal.fabricSaleDetails.push(common.cloneObject(saleModel));
        modal.saleMode = '';
        modal.minSaleAmount = 0;
        modal.fabricCode = '';
        modal.fabricId = 0;
        modal = resetFabricInModel(modal);
        //saleModelTemplate.fabricSaleDetails = modal.fabricSaleDetails;
        setSaleModel({ ...modal });
        tableOptionTemplate.data = saleModel.fabricSaleDetails;
        tableOptionTemplate.totalRecords = saleModel.fabricSaleDetails?.length;
        setTableOption({ ...tableOptionTemplate });
    }

    const resetFabricInModel = (modal) => {
        modal.fabricBrand = '';
        modal.fabricType = '';
        modal.fabricSize = '';
        modal.fabricPrintType = '';
        modal.fabricImagePath = '';
        modal.fabricColor = '';
        modal.fabricColorCode = '';
        modal.fabricId = 0;
        modal.qty = 0;
        modal.salePrice = 0;
        modal.subTotalAmount = 0;
        modal.vatAmount = 0;
        modal.totalAmount = 0;
        return modal;
    }

    const tableOptionTemplate = {
        headers: headerFormat.fabricSaleAddTableFormat,
        showTableTop: false,
        showFooter: true,
        data: [],
        totalRecords: 0,
        showPagination: false,
        changeRowClassHandler: (data) => {
            return data?.isCancelled ? "bg-danger text-white" : "";
        },
        actions: {
            showView: false,
            showEdit: false,
            popupModelId: "",
            delete: {
                handler: deleteFabricFromListHandler,
                icon: "bi bi-x-circle",
                title: "Delete fabric qty!",
                showModel: false
            }
        }
    };

    const [tableOption, setTableOption] = useState(tableOptionTemplate);
    return (
        <>
            {isOpen && <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style={{ backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-xl" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Fabric Sale</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => onCloseForm(false)}></button>
                        </div>
                        <div className="modal-body">
                            {contentIndex === 0 && <>
                                <div className='row'>
                                    <div className='col-10'>
                                        <div className='row'>
                                            <div className="col-md-2">
                                                <Label fontSize='13px' text="Invoice No"></Label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control form-control-sm" name='invoiceNo' onChange={e => textChangeHandler(e)} value={saleModel.invoiceNo} placeholder="" />
                                                    <div className="input-group-append">
                                                        <button onClick={e => setRefreshInvoiceNo(refreshInvoiceNo + 1)} className="btn btn-sm btn-outline-secondary" type="button"><i className='bi bi-arrow-clockwise' /></button>
                                                    </div>
                                                </div>
                                                <ErrorLabel message={error?.invoiceNo} />
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox labelText="Contact No." isRequired={true} value={saleModel.primaryContact} name="primaryContact" errorMessage={error?.primaryContact} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox labelText="Firstname" disabled={hasCustomer} value={saleModel.firstName} name="firstName" errorMessage={error?.firstName} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox labelText="Lastname" disabled={hasCustomer} value={saleModel.lastName} name="lastName" errorMessage={error?.lastName} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className={hasCustomer || saleModel.primaryContact?.length < 6 ? 'col-4' : 'col-3'}>
                                                <Inputbox labelText="Cust. TRN" disabled={hasCustomer} value={saleModel.trn} name="trn" errorMessage={error?.trn} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            {!hasCustomer && saleModel.primaryContact?.length > 6 && <div className="col-1" style={{ marginTop: '-3px' }}>
                                                <ButtonBox type="save" onClickHandler={saveCustomer} title="Add Customer" text="Add" className="btn-sm mt-4" />
                                            </div>
                                            }
                                            <div className='col-2'>
                                                <Inputbox type="date" max={common.getHtmlDate(new Date())} labelText="Sale Date" isRequired={true} value={saleModel.saleDate} name="saleDate" errorMessage={error?.saleDate} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox type="date" min={common.getHtmlDate(new Date())} labelText="Delivery Date" isRequired={true} value={saleModel.deliveryDate} name="deliveryDate" errorMessage={error?.deliveryDate} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-4'>
                                                <Label text="City" />
                                                <SearchableDropdown data={cityList} elementKey="value" text="value" name="city" value={saleModel.city} onChange={textChangeHandler} />
                                            </div>
                                            <div className='col-4'>
                                                <Label text="Salesman" />
                                                <SearchableDropdown data={salesmanList} name="salesmanId" value={saleModel.salesmanId} onChange={textChangeHandler} />
                                                <ErrorLabel message={error?.salesmanId} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-2'>
                                        <ImageWithFallback style={{maxHeight:'100px',width:'150px'}} src={process.env.REACT_APP_API_URL + saleModel.fabricImagePath}/>
                                        <small className='text-danger' style={{ cursor: 'pointer' }} onClick={() => { setFabricImageClass(fabricImageClass === "fabricImage" ? "fabricImageHover" : "fabricImage") }}>Click on image to zoom</small>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-10'>
                                        <div className='row'>
                                            <div className='col-2'>
                                                <Label text="F. Code" />
                                                <SearchableDropdown data={fabricList} elementKey="id" text="fabricCode" className="form-control-sm" value={saleModel.fabricId} name="fabricId" onChange={textChangeHandler} />
                                                <ErrorLabel message={error?.fabricId} />
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox labelText="Brand" isRequired={true} disabled={true} value={saleModel.fabricBrand} name="fabricBrand" errorMessage={error?.fabricBrand} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox labelText="F. Type" isRequired={true} disabled={true} value={saleModel.fabricType} name="fabricType" errorMessage={error?.fabricType} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox labelText="F. Print Type" isRequired={true} disabled={true} value={saleModel.fabricPrintType} name="fabricPrintType" errorMessage={error?.fabricPrintType} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-4'>
                                                <Inputbox labelText="Size" isRequired={true} disabled={true} value={saleModel.fabricSize} name="fabricSize" errorMessage={error?.fabricSize} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>

                                            <div className='col-2'>
                                                <Inputbox labelText="Sale Price" type="number" min={saleModel?.minSaleAmount} value={saleModel.salePrice} name="salePrice" errorMessage={error?.salePrice} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox labelText="Qty" type="number" isRequired={true} min={1} value={saleModel.qty} name="qty" errorMessage={error?.qty} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox labelText="Subtotal" type="number" disabled={true} min={1} value={saleModel?.subTotalAmount?.toFixed(2)} name="subTotalAmount" errorMessage={error?.subTotalAmount} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox labelText="Vat Amount" type="number" disabled={true} min={1} value={saleModel?.vatAmount?.toFixed(2)} name="vatAmount" errorMessage={error?.vatAmount} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-4'>
                                                <Inputbox labelText="Total" type="number" disabled={true} min={1} value={saleModel?.totalAmount?.toFixed(2)} name="totalAmount" errorMessage={error?.totalAmount} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-2'>
                                        <Inputbox labelText="Color" style={{ background: saleModel.fabricColorCode, border: '3px solid ' + saleModel.fabricColorCode, height: '83px', textAlign: 'center' }} isRequired={true} disabled={true} value={saleModel.fabricColor} name="fabricColor" errorMessage={error?.fabricColor} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                    </div>
                                    <div className='col-10'>
                                        <Inputbox labelText="Description" type="text" value={saleModel?.description} name="description" errorMessage={error?.description} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                    </div>
                                    <div className='col-2' style={{ marginTop: '-3px' }}>
                                        <ButtonBox type="add" onClickHandler={addFabricInListHandler} className="btn btn-sm mt-4 w-100"></ButtonBox>
                                    </div>
                                </div>
                                <hr />
                                <TableView option={tableOption}></TableView>
                                <hr />
                                <div className='row'>
                                    <div className='col-2'>
                                        <Label text="Payment Mode" />
                                        <Dropdown data={paymentModeList} elementKey="value" className="form-control-sm" value={saleModel.paymentMode} name="paymentMode" onChange={textChangeHandler} />
                                        <ErrorLabel message={error?.paymentMode} />
                                    </div>
                                    <div className='col-1'>
                                        <Inputbox labelText="Sub Total" type="number" style={{ padding: '0px 4px' }} disabled={true} min={1} value={calculateGrandTotal()?.subtotal?.toFixed(2)} className="form-control form-control-sm" />
                                    </div>
                                    <div className='col-1'>
                                        <Inputbox labelText="VAT" type="number" style={{ padding: '0px 4px' }} disabled={true} min={1} value={calculateGrandTotal()?.vatAmount?.toFixed(2)} className="form-control form-control-sm" />
                                    </div>
                                    <div className='col-1'>
                                        <Inputbox labelText="Total" type="number" style={{ padding: '0px 4px' }} disabled={true} min={1} value={calculateGrandTotal()?.totalAmount?.toFixed(2)} className="form-control form-control-sm" />
                                    </div>
                                    <div className='col-2'>
                                        <Label text="Discount Type" />
                                        <Dropdown data={discountTypeList} elementKey="name" text="name" className="form-control-sm" value={saleModel.discountType} name="discountType" onChange={textChangeHandler} />
                                        <ErrorLabel message={error?.discountType} />
                                    </div>
                                    {saleModel.discountType !== "NO" && <>
                                        <div className='col-1'>
                                            <Inputbox labelText="Discount" type="number" min={0} value={saleModel?.discount} name="discount" errorMessage={error?.discount} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                        </div>
                                        <div className='col-2'>
                                            <Inputbox labelText="Total After Discount" type="number" disabled={true} min={1} value={calculateGrandTotal()?.afterDiscount?.toFixed(2)} className="form-control form-control-sm" />
                                        </div>
                                    </>}
                                    <div className={saleModel.discountType !== "NO" ? 'col-1' : "col-3"}>
                                        <Inputbox labelText="Paid" style={{ padding: '0px 4px' }} type="number" min={0} value={saleModel.paidAmount} name="paidAmount" errorMessage={error?.paidAmount} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                    </div>
                                    <div className={saleModel.discountType !== "NO" ? 'col-1' : "col-2"}>
                                        <Inputbox labelText="Balance" style={{ padding: '0px 4px' }} type="number" disabled={true} min={0} value={calculateGrandTotal()?.balanceAmount?.toFixed(2)} name="balanceAmount" errorMessage={error?.balanceAmount} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                    </div>
                                </div>
                            </>}
                            {contentIndex === 1 && <>
                                <PrintFabricSaleInvoice mainData={saleModel} printRef={printRef} />
                            </>}
                        </div>
                        <div className="modal-footer">
                            {contentIndex === 0 &&
                                <>
                                    <ButtonBox type="save" onClickHandler={handleSave} className="btn-sm" />
                                </>
                            }
                            {contentIndex === 1 && <>
                                <ReactToPrint
                                    trigger={() => {
                                        return <button className='btn btn-sm btn-success' data-bs-dismiss="modal"><i className='bi bi-printer'></i> Print</button>
                                    }}
                                    content={(el) => (printRef.current)}
                                />
                                <ButtonBox type="add" text="New Sale" onClickHandler={() => onCloseForm(true)} className="btn-sm" />
                            </>}

                            <ButtonBox type="cancel" onClickHandler={() => onCloseForm(false)} className="btn-sm" />
                        </div>
                    </div>
                </div>
            </div>
            }

            {contentIndex === 1 && <>
                <div >

                </div>
            </>}
        </>
    )
}
