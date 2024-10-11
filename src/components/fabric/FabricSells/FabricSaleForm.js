import React, { useState, useEffect } from 'react'
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

export default function FabricSaleForm({ isOpen, onClose }) {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const saleModelTemplate = {
        saleMode: 'general',
        invoiceNo: '00001',
        contactNo: '',
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
        salesmandId: 0,
        imagePath: '',
        fabricColorCode: '',
        saleMode: 'GENERAL',
        minSaleAmount: 0,
        fabricSaleDetails: []
    }
    const [fabricImageClass, setFabricImageClass] = useState("fabricImage")
    const [saleModeList, setSaleModeList] = useState([]);
    const [refreshInvoiceNo, setRefreshInvoiceNo] = useState(0);
    const [selectedSaleMode, setSelectedSaleMode] = useState({ name: 'GENERAL', minSaleAmount: 0 });
    const [invoiceNo, setInvoiceNo] = useState(0);
    const [customerList, setCustomerList] = useState([]);
    const [cityList, setCityList] = useState([])
    const [paymentModeList, setPaymentModeList] = useState([]);
    const [discountTypeList, setDiscountTypeList] = useState([]);
    const [salesmanList, setSalesmanList] = useState([]);
    const [fabricCodeList, setFabricCodeList] = useState([])
    const [saleModel, setSaleModel] = useState(saleModelTemplate);
    const [error, setError] = useState();
    const [hasCustomer, setHasCustomer] = useState(false);

    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.fabricMasterController.saleMode.getAllSaleMode));
        apiList.push(Api.Get(apiUrls.fabricMasterController.Customer.getAll + `?pageNo=1&pageSize=1000000`));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + `?masterDataTypes=city&masterDataTypes=payment_mode`));
        apiList.push(Api.Get(apiUrls.dropdownController.employee + `?SearchTerm=salesman`));
        apiList.push(Api.Get(apiUrls.dropdownController.fabricCodes));
        Api.MultiCall(apiList)
            .then(res => {
                setSaleModeList(res[0]?.data?.data);
                setCustomerList(res[1]?.data?.data)
                setCityList(res[2]?.data?.filter(x => x.masterDataTypeCode === 'city'));
                setPaymentModeList(res[2]?.data?.filter(x => x.masterDataTypeCode === 'payment_mode'));
                setSalesmanList(res[3]?.data);
                setFabricCodeList(res[4].data);
            })
    }, []);

    useEffect(() => {
        Api.Get(apiUrls.fabricSaleController.getSaleInvoiceNumber)
            .then(res => {
                setInvoiceNo(res.data);
            })
    }, [refreshInvoiceNo])

    useEffect(() => {
        Api.Get(apiUrls.fabricMasterController.fabric.getFabricByCode + saleModel.fabricCode)
            .then(res => {
                var modal = saleModel;
                modal.fabricBrand = res?.data?.brandName;
                modal.fabricType = res?.data?.fabricTypeName;
                modal.fabricSize = res?.data?.fabricSizeName;
                modal.fabricPrintType = res?.data?.fabricPrintType;
                modal.imagePath = res?.data?.fabricImagePath;
                modal.fabricColor = res?.data?.fabricColorName;
                modal.fabricColorCode = res?.data?.fabricColorCode;
                modal.fabricId = res?.data?.id;
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
        debugger;
        var model = saleModel;
        if (name === 'contactNo' && value.length > 6) {
            var customer = customerList.find(x => x.primaryContact === value);
            if (customer !== undefined) {
                setHasCustomer(true);
                model.firstName = customer?.firstName;
                model.lastName = customer?.lastName;
                model.trn = customer.trn;
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
        }
        else if (type === 'select-one' && name !== 'fabricCode') {
            value = parseInt(value);
        }
        if (name === 'salePrice' || name === 'qty') {
            model.subTotalAmount = name === 'qty' ? model.salePrice * value : model.qty * value;
            var vatCalculate = common.calculateVAT(model.subTotalAmount, VAT);
            model.vatAmount = vatCalculate.vatAmount;
            model.totalAmount = vatCalculate.amountWithVat
        }
        setSaleModel({ ...saleModel, [name]: value });
    }

    const saveCustomer = () => {
        var err = {};
        if (saleModel.contactNo?.length < 1)
            err.contactNo = validationMessage.contactRequired;
        else if (saleModel.contactNo?.length < 6)
            err.contactNo = validationMessage.invalidContact;

        if (saleModel.firstName?.length < 1)
            err.firstName = validationMessage.firstNameRequired;

        if (Object.keys(err).length > 0)
            return;
        Api.Post(apiUrls.fabricMasterController.Customer.add, saleModel)
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
    return (
        <>
            {isOpen && <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style={{ backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className='row' >
                                <div className='col-12 text-center '>
                                    <div><strong>Sale Mode </strong> {
                                        saleModeList?.map((ele, index) => {
                                            return <span key={index} onClick={e => { selectSaleModeHandler(ele.name); setSelectedSaleMode({ ...ele }) }} className={saleModel.saleMode === ele.name ? 'salemode salemodeselected' : 'salemode'}>{ele.name}-{ele?.minSaleAmount?.toFixed(2)}</span>
                                        })
                                    }</div>
                                </div>
                            </div>
                            <hr />

                            <div className='row'>
                                <div className='col-10'>
                                    <div className='row'>
                                        <div className="col-md-2">
                                            <Label fontSize='13px' text="Order No"></Label>
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control form-control-sm" name='invoiceNo' onChange={e => textChangeHandler(e)} value={saleModel.invoiceNo} placeholder="" />
                                                <div className="input-group-append">
                                                    <button onClick={e => setRefreshInvoiceNo(refreshInvoiceNo + 1)} className="btn btn-sm btn-outline-secondary" type="button"><i className='bi bi-arrow-clockwise' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-2'>
                                            <Inputbox labelText="Contact No." isRequired={true} value={saleModel.contactNo} name="contactNo" errorMessage={error?.contactNo} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                        </div>
                                        <div className='col-2'>
                                            <Inputbox labelText="Firstname" disabled={hasCustomer} value={saleModel.firstName} name="firstName" errorMessage={error?.firstName} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                        </div>
                                        <div className='col-2'>
                                            <Inputbox labelText="Lastname" disabled={hasCustomer} value={saleModel.lastName} name="lastName" errorMessage={error?.lastName} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                        </div>
                                        <div className={hasCustomer || saleModel.contactNo?.length < 6 ? 'col-4' : 'col-3'}>
                                            <Inputbox labelText="Cust. TRN" disabled={hasCustomer} value={saleModel.trn} name="trn" errorMessage={error?.trn} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                        </div>
                                        {!hasCustomer && saleModel.contactNo?.length > 6 && <div className="col-1" style={{ marginTop: '-3px' }}>
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
                                            <SearchableDropdown data={cityList} elementKey="value" text="value" value={saleModel.city} onChange={textChangeHandler} />
                                        </div>
                                        <div className='col-4'>
                                            <Label text="Salesman" />
                                            <SearchableDropdown data={salesmanList} elementKey="value" name="salesmandId" value={saleModel.salesmandId} onChange={textChangeHandler} />
                                            <ErrorLabel message={error?.salesmandId} />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-2'>
                                    <img className={fabricImageClass} onClick={() => { setFabricImageClass(fabricImageClass === "fabricImage" ? "fabricImageHover" : "fabricImage") }} src={saleModel.imagePath !== "" && saleModel.imagePath !== null && saleModel.imagePath !== undefined ? process.env.REACT_APP_API_URL + saleModel.imagePath : "/assets/images/default-image.jpg"}></img>
                                    <small className='text-danger' style={{ cursor: 'pointer' }} onClick={() => { setFabricImageClass(fabricImageClass === "fabricImage" ? "fabricImageHover" : "fabricImage") }}>Click on image to zoom</small>
                                </div>
                            </div>
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
                                <div className='col-2'>
                                    <Inputbox labelText="Size" isRequired={true} disabled={true} value={saleModel.fabricSize} name="fabricSize" errorMessage={error?.fabricSize} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                </div>
                                <div className='col-2'>
                                    <Inputbox labelText="Color" style={{ border: '3px solid ' + saleModel.fabricColorCode }} isRequired={true} disabled={true} value={saleModel.fabricColor} name="fabricColor" errorMessage={error?.fabricColor} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
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
                                <div className='col-2'>
                                    <Inputbox labelText="Total" type="number" disabled={true} min={1} value={saleModel?.totalAmount?.toFixed(2)} name="totalAmount" errorMessage={error?.totalAmount} onChangeHandler={textChangeHandler} className="form-control form-control-sm" />
                                </div>
                                <div className='col-2' style={{ marginTop: '-3px' }}>
                                    <ButtonBox type="add" className="btn btn-sm mt-4 w-100"></ButtonBox>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Understood</button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    )
}
