import React, { useState, useEffect, useRef } from 'react'
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

export default function FabricSaleForm({ isOpen, onClose }) {
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
        saleMode: 'GENERAL',
        minSaleAmount: 0,
        paymentMode: 'Cash',
        discountType: 'NO',
        paidAmount: 0,
        discount: 0,
        balanceAmount: 0,
        discountAmount: 0,
        description:'',
        fabricSaleDetails: []
    }
    const [fabricImageClass, setFabricImageClass] = useState("fabricImage")
    const [saleModeList, setSaleModeList] = useState([]);
    const [refreshInvoiceNo, setRefreshInvoiceNo] = useState(0);
    const [selectedSaleMode, setSelectedSaleMode] = useState({ name: 'GENERAL', minSaleAmount: 0 });
    const [customerList, setCustomerList] = useState([]);
    const [cityList, setCityList] = useState([])
    const [paymentModeList, setPaymentModeList] = useState([]);
    const [discountTypeList, setDiscountTypeList] = useState([]);
    const [salesmanList, setSalesmanList] = useState([]);
    const [fabricCodeList, setFabricCodeList] = useState([])
    const [saleModel, setSaleModel] = useState(saleModelTemplate);
    const [error, setError] = useState();
    const [hasCustomer, setHasCustomer] = useState(false);
    const [saveSuccessFromAPI, setSaveSuccessFromAPI] = useState('');
    const [contentIndex, setContentIndex] = useState(0);

    const onCloseForm=(resetOnly)=>{
        setContentIndex(0);
        setSaleModel({...saleModelTemplate});
        if(!resetOnly)
        onClose();
    setRefreshInvoiceNo(pre=>pre+1);
    setTableOption({...tableOptionTemplate});
    }

    const calculateGrandTotal = () => {
        if (saleModel?.fabricSaleDetails?.length === 0)
            return {};
        var subtotal = saleModel?.fabricSaleDetails.reduce((sum, ele) => {
            return sum += ele.subTotalAmount;
        }, 0);
        var vatCalculate = common.calculateVAT(subtotal, VAT);
        var res = {
            subtotal: subtotal,
            vatAmount: vatCalculate.vatAmount,
            totalAmount: vatCalculate.amountWithVat,
            afterDiscount: vatCalculate.amountWithVat,
            discountAmount: 0,
            balanceAmount: vatCalculate.amountWithVat - (isNaN(saleModel.paidAmount)?0:saleModel.paidAmount),
            qty: 0,
        }
        if (saleModel.discountType?.toLocaleLowerCase() === "flat discount" && saleModel.discount > 0) {
            res.afterDiscount -= saleModel.discount;
            res.balanceAmount = res.afterDiscount - (isNaN(saleModel.paidAmount)?0:saleModel.paidAmount);
            res.discountAmount = saleModel.discount;
            res.paidAmount= res.afterDiscount;
        }
        else if (saleModel.discountType?.toLocaleLowerCase() === "percent" && saleModel.discount > 0) {
            debugger;
            res.afterDiscount -= common.calculatePercent(res.totalAmount, saleModel.discount);
            res.balanceAmount = res.afterDiscount - (isNaN(saleModel.paidAmount)?0:saleModel.paidAmount);
            res.discountAmount = common.calculatePercent(res.totalAmount, saleModel.discount);
            res.paidAmount= res.afterDiscount;
        }
        res.qty = saleModel?.fabricSaleDetails?.reduce((sum, ele) => {
            return sum += ele?.qty;
        }, 0)
        return res;
    }
    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.fabricMasterController.saleMode.getAllSaleMode));
        apiList.push(Api.Get(apiUrls.fabricMasterController.Customer.getAll + `?pageNo=1&pageSize=1000000`));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + `?masterDataTypes=city&masterDataTypes=payment_mode`));
        apiList.push(Api.Get(apiUrls.dropdownController.employee + `?SearchTerm=salesman`));
        apiList.push(Api.Get(apiUrls.dropdownController.fabricCodes));
        apiList.push(Api.Get(apiUrls.fabricMasterController.discountType.getAllDiscountType));
        Api.MultiCall(apiList)
            .then(res => {
                setSaleModeList(res[0]?.data?.data);
                setCustomerList(res[1]?.data?.data)
                setCityList(res[2]?.data?.filter(x => x.masterDataTypeCode === 'city'));
                setPaymentModeList(res[2]?.data?.filter(x => x.masterDataTypeCode === 'payment_mode'));
                setSalesmanList(res[3]?.data);
                setFabricCodeList(res[4].data);
                setDiscountTypeList(res[5].data.data);

                var generalSaleMode = res[0]?.data?.data?.find(x => x.code === 'general');
                if (generalSaleMode !== undefined) {
                    setSelectedSaleMode({ ...generalSaleMode });
                }
            })
    }, []);

    useEffect(() => {
        Api.Get(apiUrls.fabricSaleController.getSaleInvoiceNumber)
            .then(res => {
                setSaleModel({ ...saleModel, ["invoiceNo"]: res.data });
            })
    }, [refreshInvoiceNo])

    useEffect(() => {
        if (saleModel.fabricCode === '')
            return;
        Api.Get(apiUrls.fabricMasterController.fabric.getFabricByCode + saleModel.fabricCode)
            .then(res => {
                var modal = saleModel;
                modal.fabricBrand = res?.data?.brandName;
                modal.fabricType = res?.data?.fabricTypeName;
                modal.fabricSize = res?.data?.fabricSizeName;
                modal.fabricPrintType = res?.data?.fabricPrintType;
                modal.fabricImagePath = res?.data?.fabricImagePath;
                modal.fabricColor = res?.data?.fabricColorName;
                modal.fabricColorCode = res?.data?.fabricColorCode;
                modal.fabricId = res?.data?.id;
                modal.qty = 0;
                modal.salePrice = 0;
                modal.subTotalAmount = 0;
                modal.vatAmount = 0;
                modal.totalAmount = 0;
                setSaleModel({ ...saleModel });
            })
    }, [saleModel.fabricCode]);

    const selectSaleModeHandler = (saleMode) => {
        var model = saleModel;
        model.saleMode = saleMode;
        setSaleModel({ ...model });
    }

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
            value=isNaN(value)?0:value;
        }
        else if (type === 'select-one' && name !== 'fabricCode' && name !== 'city' && name !== 'paymentMode' && name !== 'discountType') {
            value = parseInt(value);
        }
        if (name === 'salePrice' || name === 'qty') {
            model.subTotalAmount = name === 'qty' ? model.salePrice * value : model.qty * value;
            var vatCalculate = common.calculateVAT(model.subTotalAmount, VAT);
            model.vatAmount = vatCalculate.vatAmount;
            model.totalAmount = vatCalculate.amountWithVat
            model.paidAmount = vatCalculate.amountWithVat-saleModel.discountAmount
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
        if (selectedSaleMode?.minSaleAmount <= 0) err.saleMode = validationMessage.fabricSaleModeRequired;
        if (saleModel.fabricId < 1 || isNaN(saleModel.fabricId)) err.fabricCode = validationMessage.fabricRequired;
        if (saleModel.salePrice < 1) err.salePrice = validationMessage.fabricSalePriceRequired;
        if (saleModel.qty < 1) err.qty = validationMessage.quantityRequired;
        if (saleModel.salePrice > 0 && (saleModel.salePrice < selectedSaleMode.minSaleAmount)) err.salePrice = validationMessage.fabricSalePriceInvalidAsPerSaleMode(selectedSaleMode.minSaleAmount, selectedSaleMode.name);
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

    const handleSave = () => {
        var err = validateSaveSale();
        if (Object.keys(err).length > 0)
            return;
        var dataModel = saleModel;
        var calculateTotals = calculateGrandTotal();
        dataModel.subTotalAmount = calculateTotals?.subtotal;
        dataModel.totalAmount = calculateTotals?.afterDiscount;
        dataModel.vatAmount = calculateTotals?.vatAmount;
        dataModel.balanceAmount = calculateTotals.balanceAmount;
        dataModel.discountAmount = calculateTotals.discountAmount;
        dataModel.qty = calculateTotals.qty;
        dataModel.fabricCustomerId = saleModel.customerId;
        Api.Put(apiUrls.fabricSaleController.add, dataModel)
            .then(res => {
                if (res?.data?.length > 3) {
                    setSaveSuccessFromAPI(res.data);
                    toast.success(toastMessage.saveSuccess);
                    setContentIndex(1);
                }
            });
    }

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
        modal.saleMode = selectedSaleMode?.name;
        modal.minSaleAmount = selectedSaleMode?.minSaleAmount;
        modal.fabricSaleDetails.push(common.cloneObject(saleModel));
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
                                <div className='row' >
                                    <div className='col-12 text-center '>
                                        <div><strong>Sale Mode </strong> {
                                            saleModeList?.map((ele, index) => {
                                                return <span title={ele?.title} key={index} onClick={e => { selectSaleModeHandler(ele.name); setSelectedSaleMode({ ...ele }) }} className={saleModel.saleMode === ele.name ? 'salemode salemodeselected' : 'salemode'}>{ele.name}-{ele?.minSaleAmount?.toFixed(2)}</span>
                                            })
                                        }</div>
                                        <ErrorLabel message={error?.saleMode} />
                                    </div>
                                </div>
                                <hr />
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
                                        <img className={fabricImageClass} onClick={() => { setFabricImageClass(fabricImageClass === "fabricImage" ? "fabricImageHover" : "fabricImage") }} src={saleModel.fabricImagePath !== "" && saleModel.fabricImagePath !== null && saleModel.fabricImagePath !== undefined ? process.env.REACT_APP_API_URL + saleModel.fabricImagePath : "/assets/images/default-image.jpg"}></img>
                                        <small className='text-danger' style={{ cursor: 'pointer' }} onClick={() => { setFabricImageClass(fabricImageClass === "fabricImage" ? "fabricImageHover" : "fabricImage") }}>Click on image to zoom</small>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-10'>
                                        <div className='row'>
                                            <div className='col-2'>
                                                <Label text="F. Code" />
                                                <SearchableDropdown data={fabricCodeList} elementKey="value" className="form-control-sm" value={saleModel.fabricCode} name="fabricCode" onChange={textChangeHandler} />
                                                <ErrorLabel message={error?.fabricCode} />
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
                                                <Inputbox labelText="Sale Price" type="number" min={selectedSaleMode?.minSaleAmount} value={saleModel.salePrice} name="salePrice" errorMessage={error?.salePrice} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
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
                                        <Inputbox labelText="Color" style={{background:saleModel.fabricColorCode, border: '3px solid ' + saleModel.fabricColorCode,height:'83px',textAlign:'center'}} isRequired={true} disabled={true} value={saleModel.fabricColor} name="fabricColor" errorMessage={error?.fabricColor} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
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
                                <ButtonBox type="add" text="New Sale" onClickHandler={()=>onCloseForm(true)} className="btn-sm" />
                            </>}

                            <ButtonBox type="cancel" onClickHandler={()=>onCloseForm(false)} className="btn-sm" />
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
