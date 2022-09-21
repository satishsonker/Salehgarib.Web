import React, { useState, useEffect, useMemo } from 'react'
import Dropdown from '../common/Dropdown';
import Label from '../common/Label';
import ErrorLabel from '../common/ErrorLabel';
import { toast } from 'react-toastify';
import RegexFormat from '../../utils/RegexFormat';
import { validationMessage } from '../../constants/validationMessage';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import CustomerOrderEdit from './CustomerOrderEdit';
import Barcode from 'react-barcode/lib/react-barcode';
import TableImageViewer from '../tables/TableImageViewer';

export default function CustomerOrderForm({ userData, orderSearch, setViewSampleImagePath }) {
    const customerOrderModelTemplate = {
        id: 0,
        customerRefName: '',
        orderDeliveryDate: '',
        firstname: "",
        customerId: 0,
        lastname: "",
        contact1: "",
        contact2: "",
        orderNo: "093423",
        employeeId: userData?.userId,
        designSampleId: 0,
        measurementStatus: '',
        orderStatus: '',
        categoryId: 0,
        city: "",
        poBox: "",
        preAmount: 0,
        orderDate: common.getHtmlDate(new Date()),
        orderDetails: [],
        chest: '',
        sleeveLoose: '',
        deep: '',
        backDown: '',
        bottom: '',
        length: '',
        hipps: '',
        sleeves: '',
        shoulder: '',
        neck: '',
        extra: '',
        cuff: '',
        price: 0.00,
        size: "",
        waist: "",
        crystal: '',
        crystalPrice: 1400,
        workType: "",
        workTypes: [],
        quantity: 0,
        description: "",
        totalAmount: 0,
        subTotalAmount: 0,
        advanceAmount: 0,
        balanceAmount: 0,
        paymentMode: "",
        VAT: 5,
        note: ''

    };
    const isFirstLoad = useMemo(() => true, []);
    const [selectedCustomerId, setSelectedCustomerId] = useState(0)
    const [customerOrderModel, setCustomerOrderModel] = useState(customerOrderModelTemplate);
    const [hasCustomer, setHasCustomer] = useState(false);
    const [customerList, setCustomerList] = useState();
    const [salesmanList, setSalesmanList] = useState();
    const [orderStatusList, setOrderStatusList] = useState();
    const [cityList, setCityList] = useState();
    const [workTypeList, setWorkTypeList] = useState();
    const [paymentModeList, setPaymentModeList] = useState();
    const [measurementStatusList, setMeasurementStatusList] = useState();
    const [designCategoryList, setDesignCategoryList] = useState();
    const [errors, setErrors] = useState({});
    const [selectedDesignSample, setSelectedDesignSample] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [designSample, setDesignSample] = useState([]);
    const [orderEditRow, setOrderEditRow] = useState(-1);
    const [selectedModelAvailableQty, setSelectedModelAvailableQty] = useState(100000);
    const handleTextChange = (e) => {
        var { value, type, name } = e.target;
        debugger;
        let mainData = customerOrderModel;
        if (name === 'customerId') {
            mainData.branch = "";
            mainData.contact1 = "";
            mainData.contact2 = "";
            mainData.poBox = "";
            mainData.customerId = 0;
            mainData.firstname = value;
            setSelectedCustomerId(mainData.customerId);
            setCustomerOrderModel({ ...mainData });
            setHasCustomer(false);
            return;
        }
        if (type === 'select-one' && name === "employeeId") {
            value = parseInt(value);
        }

        if (type === 'number') {
            value = isNaN(parseFloat(value))?0:parseFloat(value);

            if (name === "categoryId") {
                mainData.categoryId = value;
                mainData.designSampleId = 0;
                setCustomerOrderModel({ ...mainData });
                return;
            }
            if (name === "advanceAmount") {
                if (value > mainData.totalAmount) {
                    setErrors({ advanceAmount: validationMessage.advanceMoreThanTotalError });
                    return;
                }
                else {
                    setErrors({});
                }
                mainData.advanceAmount = value;
                mainData.balanceAmount = mainData.totalAmount - value;
                setCustomerOrderModel({ ...mainData });
                return;
            }
            if (name === "subTotalAmount" || name === "VAT") {
                mainData[name] = value;
                let { amountWithVat } = common.calculateVAT(mainData.subTotalAmount, mainData.VAT);
                mainData.totalAmount = amountWithVat
                mainData.balanceAmount = amountWithVat - mainData.advanceAmount
                setCustomerOrderModel({ ...mainData });
                return;
            }
        }


        if (name === 'workType') {
            mainData.workTypes = [];
            value.split(',').forEach(ele => {
                var workTypeData = workTypeList.find(x => x.value === ele);
                if (workTypeData !== undefined)
                    mainData.workTypes.push(workTypeData.id);
            });
        }
        setCustomerOrderModel({ ...customerOrderModel, [name]: value });
    }

    useEffect(() => {
        var apisList = [];
        apisList.push(Api.Get(apiUrls.customerController.getAll + `?pageNo=1&pageSize=1000000`));
        apisList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + `?masterDataTypes=Order_Status&masterDataTypes=Measurement_Status&masterDataTypes=city&masterDataTypes=payment_mode&masterDataTypes=work_type`));
        apisList.push(Api.Get(apiUrls.dropdownController.employee + `?SearchTerm=salesman`));
        apisList.push(Api.Get(apiUrls.dropdownController.designCategory));
        apisList.push(Api.Get(apiUrls.masterController.designSample.getAll + "?pageNo=1&PageSize=1000000"));
        apisList.push(Api.Get(apiUrls.orderController.getOrderNo));
        Api.MultiCall(apisList).then(res => {
            setCustomerList(res[0].data.data);
            setOrderStatusList(res[1].data.filter(x => x.masterDataTypeCode.toLowerCase() === 'order_status'));
            setMeasurementStatusList(res[1].data.filter(x => x.masterDataTypeCode.toLowerCase() === "measurement_status"));
            setCityList(res[1].data.filter(x => x.masterDataTypeCode.toLowerCase() === "city"));
            setWorkTypeList(res[1].data.filter(x => x.masterDataTypeCode.toLowerCase() === "work_type"));
            setPaymentModeList(res[1].data.filter(x => x.masterDataTypeCode.toLowerCase() === "payment_mode"));
            setSalesmanList(res[2].data);
            setDesignCategoryList(res[3].data);
            setDesignSample(res[4].data.data);
            setCustomerOrderModel({ ...customerOrderModel, "orderNo": res[5].data?.toString() })
        });
    }, [isFirstLoad]);

    useEffect(() => {
        if (selectedCustomerId === 0)
            return;
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.orderController.getPreviousAmount + `?customerId=${customerOrderModel.customerId}`));
        apiCalls.push(Api.Get(apiUrls.orderController.getCustomerMeasurement + `?customerId=${customerOrderModel.customerId}`));
        Api.MultiCall(apiCalls)
            .then(res => {
                let mainData = customerOrderModel;
                mainData.preAmount = res[0].data;
                mainData.chest = common.defaultIfEmpty(res[1].data.chest, 0);
                mainData.sleeveLoose = common.defaultIfEmpty(res[1].data.sleeveLoose, 0);
                mainData.deep = common.defaultIfEmpty(res[1].data.deep, 0);
                mainData.backDown = common.defaultIfEmpty(res[1].data.backDown, 0);
                mainData.bottom = common.defaultIfEmpty(res[1].data.bottom, 0);
                mainData.length = common.defaultIfEmpty(res[1].data.length, 0);
                mainData.hipps = common.defaultIfEmpty(res[1].data.hipps, 0);
                mainData.sleeves = common.defaultIfEmpty(res[1].data.sleeve, 0);
                mainData.shoulder = common.defaultIfEmpty(res[1].data.shoulder, 0);
                mainData.neck = common.defaultIfEmpty(res[1].data.neck, 0);
                mainData.extra = common.defaultIfEmpty(res[1].data.extra, 0);
                mainData.cuff = common.defaultIfEmpty(res[1].data.cuff, 0);
                mainData.size = common.defaultIfEmpty(res[1].data.size, 0);
                mainData.waist = common.defaultIfEmpty(res[1].data.waist, 0);
                setCustomerOrderModel({ ...mainData });
            })
            .catch(err => {

            });
    }, [selectedCustomerId])

    const validateAddCustomer = () => {
        var { firstname, contact1, lastname } = customerOrderModel;
        const newError = {};
        if (!firstname || firstname === "") newError.firstname = validationMessage.firstNameRequired;
        if (!lastname || lastname === "") newError.lastname = validationMessage.lastNameRequired;
        //if (contact1?.length === 0 || !RegexFormat.mobile.test(contact1)) newError.contact1 = validationMessage.invalidContact;
        return newError;
    }

    const addCustomerHandler = () => {
        var formError = validateAddCustomer();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        Api.Put(apiUrls.customerController.add, customerOrderModel)
            .then(res => {
                setCustomerOrderModel({ ...customerOrderModel, ["customerId"]: res.data.id });
                setHasCustomer(true);
            }).catch(err => {

            });
    }

    const getDesignSample = (designCategoryId) => {
        const sampleList = designSample?.filter(x => x.categoryId === designCategoryId);
        setCustomerOrderModel({ ...customerOrderModel, ['categoryId']: designCategoryId });
        setSelectedDesignSample(sampleList);
    }

    const customerDropdownClickHandler = (data) => {
        setHasCustomer(true);
        debugger;
        var mainData = customerOrderModel;
        mainData.branch = data.branch;
        mainData.contact1 = data.contact1;
        mainData.contact2 = data.contact2;
        mainData.poBox = data.poBox;
        mainData.customerId = data.id;
        mainData.firstname = data.firstname;
        mainData.lastname = data.lastname;
        mainData.lastSalesMan = data.lastSalesMan === null ? `${userData.firstName} ${userData.lastName}` : data.lastSalesMan;
        setCustomerOrderModel({ ...mainData });
        setSelectedCustomerId(data.id);
    }

    const handleEdit = (customerId) => {

        Api.Get(apiUrls.customerController.get + customerId).then(res => {
            if (res.data.id > 0) {
                setCustomerOrderModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    }
    const handleDelete = (id) => {
        Api.Delete(apiUrls.customerController.delete + id).then(res => {
            if (res.data === 1) {
                toast.success(toastMessage.deleteSuccess);
            }
        }).catch(err => {
            toast.error(toastMessage.deleteError);
        });
    }

    const handleSave = () => {
        debugger;
        let data = customerOrderModel;
        var formError = validateSaveOrder();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        setErrors({});
        Api.Put(apiUrls.orderController.add, data).then(res => {
            if (res.data.id > 0) {
                toast.success(toastMessage.saveSuccess);
                common.closePopup('closePopupCustomerOrderCreate');
                orderSearch('');
                handleClearForm();
            }
        }).catch(err => {
            toast.error(toastMessage.saveError);
        });
    }

    const tableOptionTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo" },
            { name: "Order Delivery Date", prop: "orderDeliveryDate" },
            { name: "Category", prop: "categoryName" },
            { name: "Model", prop: "designSampleName" },
            { name: "Length", prop: "length" },
            { name: "Chest", prop: "chest" },
            { name: "Waist", prop: "waist" },
            { name: "Hipps", prop: "hipps" },
            { name: "Bottom", prop: "bottom" },
            { name: "Sleeve", prop: "sleeve" },
            { name: "Sleeve Loose", prop: "sleeveLoose" },
            { name: "Shoulder", prop: "shoulder" },
            { name: "Neck", prop: "neck" },
            { name: "BackDown", prop: "backDown" },
            { name: "Extra", prop: "extra" },
            { name: "Size", prop: "size" },
            { name: "Deep", prop: "deep" },
            { name: "Cuff", prop: "cuff" },
            { name: "Description", prop: "description" },
            { name: "Note", prop: "note" },
            { name: "Work Type", prop: "workType" },
            { name: "Order Status", prop: "orderStatus" },
            { name: "Measurement Status", prop: "measurementStatus" },
            { name: "Crystal", prop: "crystal" },
            { name: "Crystal Price", prop: "crystalPrice", action: { decimal: true } },
            { name: "Price", prop: "price" },
            { name: "Sub Total Amount", prop: "subTotalAmount", action: { decimal: true } },
            { name: "VAT", prop: "VAT", action: { decimal: true } },
            { name: "VAT Amount", prop: "VATAmount", action: { decimal: true } },
            { name: "Total Amount", prop: "totalAmount", action: { decimal: true } }
        ],
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        actions: {
            showView: false,
            popupModelId: "add-customer-order",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    const createOrderHandler = () => {
        var formError = validateCreateOrder();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        else {
            setErrors({})
        }
        var existingData = customerOrderModel;
        var totalOrders = customerOrderModel.quantity + customerOrderModel.orderDetails.length;
        var totalCrystal = isNaN(parseFloat(customerOrderModel.crystal)) ? 0 : parseFloat(customerOrderModel.crystal);
        var subTotal = customerOrderModel.price + (totalCrystal * customerOrderModel.crystalPrice);
        var total = ((subTotal / 100) * customerOrderModel.VAT) + subTotal;
        var orderDetail = {
            id: 0,
            orderNo: "",
            price: customerOrderModel.price,
            categoryName: designCategoryList.find(x => x.id === customerOrderModel.categoryId).value,
            designSampleName: designSample.find(x => x.id === customerOrderModel.designSampleId).model,
            designSampleId: customerOrderModel.designSampleId,
            price: customerOrderModel.price,
            chest: customerOrderModel.chest?.toString(),
            sleeveLoose: customerOrderModel.sleeveLoose,
            deep: customerOrderModel.deep?.toString(),
            backDown: customerOrderModel.backDown?.toString(),
            bottom: customerOrderModel.bottom?.toString(),
            length: customerOrderModel.length?.toString(),
            hipps: customerOrderModel.hipps?.toString(),
            sleeve: customerOrderModel.sleeves?.toString(),
            shoulder: customerOrderModel.shoulder?.toString(),
            neck: customerOrderModel.neck?.toString(),
            extra: customerOrderModel.extra?.toString(),
            cuff: customerOrderModel.cuff?.toString(),
            size: customerOrderModel.size?.toString(),
            waist: customerOrderModel.waist?.toString(),
            crystal: customerOrderModel.crystal,
            crystalPrice: customerOrderModel.crystalPrice,
            orderDeliveryDate: customerOrderModel.orderDeliveryDate,
            workType: customerOrderModel.workType,
            description: customerOrderModel.description,
            note: customerOrderModel.note,
            measurementStatus: customerOrderModel.measurementStatus,
            orderStatus: customerOrderModel.orderStatus,
            subTotalAmount: subTotal,
            VAT: customerOrderModel.VAT,
            VATAmount: parseFloat(total - subTotal).toFixed(2),
            totalAmount: total,
            workTypes: customerOrderModel.workTypes
        }
        for (let item = 0; item < totalOrders; item++) {
            if (existingData.orderDetails[item])
                existingData.orderDetails[item].orderNo = `${existingData.orderNo}-${item + 1}`;
            else {
                orderDetail.orderNo = `${existingData.orderNo}-${item + 1}`;
                existingData.orderDetails.push(JSON.parse(JSON.stringify(orderDetail)));
            }
        }
        var crystal = existingData.crystal === "" ? "0" : existingData.crystal;
        var subTotalAmount = existingData.price * existingData.quantity + (parseFloat(crystal) * existingData.crystalPrice * existingData.quantity);
        var totalAmountWithVAT = ((subTotalAmount / 100) * existingData.VAT) + subTotalAmount;
        existingData.subTotalAmount = subTotalAmount + parseFloat(existingData.subTotalAmount);
        existingData.totalAmount = totalAmountWithVAT + parseFloat(existingData.totalAmount);
        existingData.balanceAmount = existingData.totalAmount - existingData.advanceAmount;
        tableOptionTemplet.data = existingData.orderDetails;
        tableOptionTemplet.totalRecords = existingData.orderDetails.length;
        setTableOption(tableOptionTemplet);
        existingData.quantity = 0;
        existingData.price = 0;
        existingData.workType = "";
        existingData.crystal = "";
        existingData.workTypes = [];
        setCustomerOrderModel(existingData);
        setWorkTypeList({ ...workTypeList })
    }

    const validateCreateOrder = () => {
        var { price, quantity, crystal, VAT, designSampleId, orderStatus, measurementStatus, orderDeliveryDate } = customerOrderModel;
        var errors = {};
        if (!price || price === 0) errors.price = validationMessage.priceRequired;
        if (crystal && (crystal.length > 0 && crystal !== '' && isNaN(parseFloat(crystal)))) errors.crystal = validationMessage.invalidCrystalQuantity;
        if (!VAT || VAT === 0) errors.VAT = validationMessage.invalidVAT;
        if (!designSampleId || designSampleId === 0) errors.designSampleId = validationMessage.invalidModel;
        if (!quantity || quantity === 0) errors.quantity = validationMessage.quantityRequired;
        if (!orderStatus || orderStatus === '') errors.orderStatus = validationMessage.orderStatusRequired;
        if (!orderDeliveryDate || orderDeliveryDate === '') errors.orderDeliveryDate = validationMessage.deliveryDateRequired;
        if (!measurementStatus || measurementStatus === '') errors.measurementStatus = validationMessage.measurementStatusRequired;
        return errors;
    }

    const validateSaveOrder = () => {
        var { orderDetails, totalAmount, subTotalAmount, VAT, paymentMode, employeeId, orderDate, customerId } = customerOrderModel;
        var errors = {};
        if (!orderDetails || orderDetails.length === 0) errors.orderDetails = validationMessage.noOrderDetailsError;
        if (!subTotalAmount || subTotalAmount === 0) errors.subTotalAmount = validationMessage.invalidSubTotal;
        if (!totalAmount || totalAmount === 0) errors.totalAmount = validationMessage.invalidTotalAmount;
        if (!employeeId || employeeId === 0) errors.employeeId = validationMessage.salesmanRequired;
        if (!customerId || customerId === 0) errors.customerId = validationMessage.customerRequired;
        if (!VAT || VAT === 0) errors.VAT = validationMessage.invalidVAT;
        if (!paymentMode || paymentMode === '') errors.paymentMode = validationMessage.paymentModeRequired;
        if (!orderDate || orderDate === '') errors.orderDate = validationMessage.deliveryDateRequired;
        return errors;
    }

    const removeOrderDetails = (orderNo) => {
        if (!orderNo || orderNo === "")
            return;

        var mainData = customerOrderModel;
        var subTotal = 0;
        var totalAmount = 0;
        mainData.orderDetails = mainData.orderDetails.filter(x => x.orderNo !== orderNo);
        for (let item = 0; item < mainData.orderDetails.length; item++) {
            mainData.orderDetails[item].orderNo = `${mainData.orderNo}-${item + 1}`;
            var totalCrystal = isNaN(parseFloat(mainData.orderDetails[item].crystal)) ? 0 : parseFloat(mainData.orderDetails[item].crystal);
            subTotal += mainData.orderDetails[item].price + (totalCrystal * customerOrderModel.crystalPrice);
        }
        mainData.subTotalAmount = subTotal.toFixed(2);
        totalAmount = ((subTotal / 100) * mainData.VAT) + subTotal;
        mainData.totalAmount = totalAmount;
        mainData.balanceAmount = totalAmount - mainData.advanceAmount;
        setCustomerOrderModel({ ...mainData });
        tableOptionTemplet.data = mainData.orderDetails;
        tableOptionTemplet.totalRecords = mainData.orderDetails.length;
        setTableOption(tableOptionTemplet);
    }

    const editOrderDetail = (index) => {
        setOrderEditRow(index);
        tableOptionTemplet.data = customerOrderModel.orderDetails;
        tableOptionTemplet.totalRecords = customerOrderModel.orderDetails.length;
        setTableOption(tableOptionTemplet);
    }

    const handleClearForm = () => {
        Api.Get(apiUrls.orderController.getOrderNo).then(res => {
            customerOrderModelTemplate.orderNo = res.data.toString();
            setCustomerOrderModel({ ...customerOrderModelTemplate });
            setTableOption(tableOptionTemplet);
            setSelectedDesignSample([])
        });
    }

    const customerSearchHandler = (data, searchTerm) => {
        return data.filter(x => searchTerm === "" || x.firstname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || x.contact1.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
    }
    return (
        <>
            <div className="modal-body">
                <form className="form-horizontal form-material">
                    <div className="card">
                        <div className="card-body">
                            <div className="row g-2">
                                <div className='col-12 col-lg-9 d-flex'>
                                    <div className='row g-1'>
                                        <div className="col-md-3">
                                            <Label fontSize='13px' text="Order No"></Label>
                                            <input type="text" className="form-control form-control-sm" value={customerOrderModel.orderNo} placeholder="4848548" disabled />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <Label fontSize='13px' text="Customer Name" isRequired={!hasCustomer}></Label>
                                            <Dropdown searchHandler={customerSearchHandler} className='form-control-sm' onChange={handleTextChange} data={customerList} elemenyKey="id" itemOnClick={customerDropdownClickHandler} text="firstname" defaultValue='' name="customerId" value={customerOrderModel.customerId} searchable={true} defaultText="Select Customer.." />
                                            {
                                                !hasCustomer &&
                                                <ErrorLabel message={errors?.customerId}></ErrorLabel>
                                            }
                                        </div>

                                        <div className="col-12 col-md-3">
                                            <Label fontSize='13px' text="Lastname" isRequired={!hasCustomer}></Label>
                                            <input type="text" className="form-control form-control-sm" onChange={e => handleTextChange(e)} value={customerOrderModel.lastname} name="lastname" placeholder="" disabled={hasCustomer ? 'disabled' : ''} />
                                            {
                                                !hasCustomer &&
                                                <ErrorLabel message={errors?.lastname}></ErrorLabel>
                                            }
                                        </div>
                                        {
                                            hasCustomer &&
                                            <div className="col-12 col-md-3">
                                                <Label fontSize='13px' text="Salasman"></Label>
                                                <input type="text" value={customerOrderModel.lastSalesMan} className="form-control form-control-sm" placeholder="" disabled />
                                            </div>
                                        }

                                        <div className="col-12 col-md-3">
                                            <Label fontSize='13px' text="Contact1" isRequired={!hasCustomer}></Label>
                                            <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.contact1} name="contact1" className="form-control form-control-sm" disabled={hasCustomer ? 'disabled' : ''} />
                                            {
                                                !hasCustomer &&
                                                <ErrorLabel message={errors?.contact1}></ErrorLabel>
                                            }
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <Label fontSize='13px' text="Contact2"></Label>
                                            <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.contact2} name="contact2" className="form-control form-control-sm" disabled={hasCustomer ? 'disabled' : ''} />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <Label fontSize='13px' text="P.O. Box"></Label>
                                            <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.poBox} name="poBox" className="form-control form-control-sm" disabled={hasCustomer ? 'disabled' : ''} />
                                        </div>
                                        {
                                            !hasCustomer &&
                                            <div className="col-12 col-md-3">
                                                <button type="button" className="btn btn-info btn-sm text-white waves-effect mt-4" onClick={e => addCustomerHandler()}>
                                                    Add Customer
                                                </button>
                                            </div>
                                        }
                                        {hasCustomer &&
                                            <div className="col-12 col-md-3">
                                                <Label fontSize='13px' text="Pre. Amount"></Label>
                                                <input type="number" min={0} onChange={e => handleTextChange(e)} name="preAmount" value={customerOrderModel.preAmount} className="form-control form-control-sm" disabled />
                                            </div>
                                        }
                                    </div>

                                </div>
                                <div className='col-12 col-lg-3 d-flex'>

                                    <div className='col-12 col-md-12'>
                                        <Barcode value={customerOrderModel.orderNo} width={3} height={50}></Barcode>
                                    </div>
                                </div>


                                <div className="clearfix"></div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Length"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.length} name="length" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Chest"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.chest} name="chest" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Waist"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.waist} name="waist" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Hipps"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.hipps} name="hipps" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Bottom"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.bottom} name="bottom" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Sleeves"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.sleeves} name="sleeves" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Sleeves Loo."></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.sleeveLoose} name="sleeveLoose" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Shoulder"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.shoulder} name="shoulder" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Neck"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.neck} name="neck" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Back Down"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.backDown} name="backDown" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Extra"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.extra} name="extra" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Size"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.size} name="size" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Deep"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.deep} name="deep" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Cuff"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.cuff} name="cuff" className="form-control form-control-sm" />
                                </div>
                                <div className="clearfix"></div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Name" helpText="Customer reference name"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} className="form-control form-control-sm" name='customerRefName' value={customerOrderModel.customerRefName} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Measu. Status" isRequired={true}></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={measurementStatusList} defaultValue='' elemenyKey="value" name="measurementStatus" value={customerOrderModel.measurementStatus} defaultText="Select measurement status.." />
                                    <ErrorLabel message={errors.measurementStatus} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Delivery Date" isRequired={true}></Label>
                                    <input type="date" min={common.getHtmlDate(new Date())} name='orderDeliveryDate' onChange={e => handleTextChange(e)} value={customerOrderModel.orderDeliveryDate} className="form-control form-control-sm" />
                                    <ErrorLabel message={errors.orderDeliveryDate} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Order Stat." isRequired={true}></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={orderStatusList} defaultValue='' elemenyKey='value' name="orderStatus" value={customerOrderModel.orderStatus} defaultText="Select measurement status.." />
                                    <ErrorLabel message={errors.orderStatus} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Salesman" isRequired={true}></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={salesmanList} defaultValue='0' name="employeeId" value={customerOrderModel.employeeId} defaultText="Select salesman.." />
                                    <ErrorLabel message={errors.employeeId} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="City"></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={cityList} defaultValue='' elemenyKey="value" name="city" value={customerOrderModel.city} defaultText="Select city.." />
                                </div>
                                <div className="clearfix"></div>
                                {/* <div className="col-12 col-md-3 mt-auto">
                                    <button type="button" className="btn btn-info text-white waves-effect mt-4" data-bs-dismiss="modal">Add
                                        me</button>
                                </div> */}


                                <div className="clearfix"></div>

                                <div className="d-flex justify-content-start bd-highlight mb-3 example-parent sampleBox" style={{ flexWrap: "wrap" }}>
                                    {
                                        designCategoryList?.map((ele, index) => {
                                            return <div key={index}
                                                onClick={e => { getDesignSample(ele.id); handleTextChange({ target: { name: "categoryId", type: "number", value: ele.id } }); setSelectedModelAvailableQty(100000) }}
                                                className={"p-2 bd-highlight col-example btnbr" + (customerOrderModel.categoryId === ele.id ? " activeSample" : "")}>{ele.value}</div>
                                        })
                                    }
                                </div>
                                <ErrorLabel message={errors.designSampleId} />
                                {
                                    selectedDesignSample?.length > 0 &&
                                    <div className="d-flex justify-content-start bd-highlight mb-3 example-parent sampleBox">
                                        {
                                            selectedDesignSample?.map((ele, index) => {
                                                return <>
                                                    <div key={index}
                                                        className={"btn-group btnbr position-relative" + (customerOrderModel.designSampleId === ele.id ? (ele.quantity < 1 ? " activeZeroSample" : " activeSample") : "")}
                                                        role="group"
                                                        aria-label="Basic example"
                                                        style={{ marginRight: "20px", marginBottom: '10px' }}
                                                        title={ele.quantity < 1 ? "You do not have enough quantity of butter paper." : `${ele.quantity} butter paper is available`}
                                                    >
                                                        <div
                                                            onClick={e => { handleTextChange({ target: { name: "designSampleId", type: "number", value: ele.id } }); setCustomerOrderModel({ ...customerOrderModel, ['designSampleId']: ele.id }); setSelectedModelAvailableQty(ele.quantity) }}
                                                            type="button"
                                                            style={{ width: '83%' }}
                                                            className=" p-2 bd-highlight col-example">
                                                            {ele.model}
                                                        </div>
                                                        <div
                                                            style={{ width: "26px" }}
                                                            className="" title='View Image'
                                                        >
                                                            <img
                                                                src={process.env.REACT_APP_API_URL + ele.picturePath}
                                                                style={{ height: '25px', width: '25px' }}
                                                                className='img-fluid'
                                                                data-bs-target="#table-image-viewer-sample-design" data-bs-toggle="modal" data-bs-dismiss="modal"
                                                                onClick={e => setViewSampleImagePath(ele.picturePath)}></img>
                                                        </div>
                                                        {/* <img src={process.env.REACT_APP_API_URL + ele.picturePath} style={{ width: "150px" }}></img> */}
                                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                            {ele.quantity}
                                                            <span className="visually-hidden">unread messages</span>
                                                        </span>
                                                    </div>
                                                </>
                                            })
                                        }
                                        {selectedModelAvailableQty <= 0 && <div className='text-danger' style={{ width: '100%', textAlign: 'center' }}>You do not have enough quantity of butter paper</div>}

                                    </div>
                                }
                                {
                                    selectedDesignSample?.length === 0 &&
                                    <div className="d-flex bd-highlight mb-3 example-parent sampleBox" style={{ justifyContent: 'space-around', fontSize: '1.1rem', color: '#ff00008f' }}>
                                        <div>No models are available for selected category</div>
                                    </div>
                                }

                                {/* <TableView option={tableOption} ></TableView> */}
                                <div className="table-responsive">
                                    <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap5">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <table id="example" className="table table-striped table-bordered dataTable" style={{ width: "100%" }} role="grid" aria-describedby="example_info">
                                                    <thead>
                                                        <tr role="row">
                                                            {
                                                                tableOption.headers.length > 0 && tableOption.headers.map((ele, index) => {
                                                                    return <th className="sorting" tabIndex="0" aria-controls="example" key={index}>{ele.name}</th>
                                                                })
                                                            }
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            tableOption.data.length > 0 && (
                                                                tableOption.data.map((dataEle, dataIndex) => {
                                                                    return <tr key={dataIndex}>
                                                                        {

                                                                            tableOption.headers.map((headerEle, headerIndex) => {
                                                                                return <>
                                                                                    {
                                                                                        orderEditRow !== dataIndex && <td key={headerEle + headerIndex} title={headerEle.title}>{common.formatTableData(dataEle[headerEle.prop], headerEle.action)}</td>
                                                                                    }
                                                                                </>
                                                                            })

                                                                        }
                                                                        {
                                                                            orderEditRow === dataIndex && <CustomerOrderEdit data={dataEle} customerModel={customerOrderModel} setData={setCustomerOrderModel} index={dataIndex} parentTextChange={handleTextChange}></CustomerOrderEdit>
                                                                        }
                                                                        <td key={dataIndex + 100000}>
                                                                            <div className="table-actions d-flex align-items-center gap-3 fs-6">
                                                                                {orderEditRow !== dataIndex && <div onClick={e => editOrderDetail(dataIndex)} className="text-warning" data-bs-placement="bottom" title="" data-bs-original-title="" aria-label=""><i className="bi bi-pencil-fill"></i></div>}
                                                                                {orderEditRow === dataIndex && <div onClick={e => setOrderEditRow(-1)} className="text-success" data-bs-placement="bottom" title="" data-bs-original-title="" aria-label=""><i className="bi bi-check-circle"></i></div>}
                                                                                {orderEditRow === dataIndex && <div onClick={e => setOrderEditRow(-1)} className="text-danger" data-bs-placement="bottom" title="" data-bs-original-title="" aria-label=""><i className="bi bi-x-circle"></i></div>}
                                                                                <div className="text-primary" onClick={e => removeOrderDetails(dataEle.orderNo)} data-bs-placement="bottom" title="" data-bs-original-title="" aria-label=""><i className="bi bi-trash-fill"></i></div>

                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                })
                                                            )
                                                        }

                                                        {/* No record found when data length is zero */}
                                                        {
                                                            tableOption.data.length === 0 && (
                                                                <tr>
                                                                    {!errors.orderDetails && <td style={{ textAlign: "center", height: "32px", verticalAlign: "middle" }} colSpan={tableOption.headers.length + 1}>No record found</td>}
                                                                    {errors.orderDetails && <td style={{ textAlign: "center", height: "32px", verticalAlign: "middle" }} colSpan={tableOption.headers.length + 1}><ErrorLabel message={errors.orderDetails} /></td>}
                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Price" helpText="Price of the single unit" isRequired={true}></Label>
                                    <input type="number" min={0} onChange={e => handleTextChange(e)} className="form-control form-control-sm" name='price' value={customerOrderModel.price} />
                                    <ErrorLabel message={errors.price} />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Crystal"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} className="form-control form-control-sm" name='crystal' value={customerOrderModel.crystal} />
                                    <ErrorLabel message={errors.crystal} />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Quantity" isRequired={true}></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} min={0} className="form-control form-control-sm" name='quantity' value={customerOrderModel.quantity} />
                                    <ErrorLabel message={errors.quantity} />
                                </div>
                                <div className="col-12 col-md-6">
                                    <Label fontSize='13px' text="Work Type"></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} multiSelect={true} data={workTypeList} defaultValue='' name="workType" value={customerOrderModel.workType} defaultText="Select work Type" />
                                    <ErrorLabel message={errors.workType} />
                                </div>
                                <div className="col-12 col-md-2 mt-auto">
                                    <button type="button" className="btn btn-info btn-sm text-white waves-effect mt-4" onClick={e => createOrderHandler()} disabled={customerOrderModel.quantity > 0 ? "" : "disabled"}>
                                        Add Quantity
                                    </button>
                                </div>
                                <div className="clearfix"></div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Payment Mode" isRequired={true}></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={paymentModeList} defaultValue='' elemenyKey="value" name="paymentMode" value={customerOrderModel.paymentMode} defaultText="Select payment mode" />
                                    <ErrorLabel message={errors.paymentMode} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Sub Total Amount" helpText="Total amount without VAT"></Label>
                                    <input type="number" min={0} disabled onChange={e => handleTextChange(e)} className="form-control form-control-sm" name='subTotalAmount' value={common.printDecimal(customerOrderModel.subTotalAmount)} />
                                    <ErrorLabel message={errors.subTotalAmount} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="VAT"></Label>
                                    <input type="number" min={0} onChange={e => handleTextChange(e)} disabled className="form-control form-control-sm" name='VAT' value={common.printDecimal(customerOrderModel.VAT)} />
                                    <ErrorLabel message={errors.VAT} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Total Amount" helpText="Total amount with VAT"></Label>
                                    <input disabled type="number" min={0} onChange={e => handleTextChange(e)} className="form-control form-control-sm" name='totalAmount' value={common.printDecimal(customerOrderModel.totalAmount)} />
                                    <ErrorLabel message={errors.totalAmount} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Advance"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} min={0} className="form-control form-control-sm" name='advanceAmount' value={customerOrderModel.advanceAmount} />
                                    <ErrorLabel message={errors.advanceAmount} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Balance" helpText="Total payable amount by customer"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} min={0} className="form-control form-control-sm" name='balanceAmount' value={common.printDecimal(customerOrderModel.balanceAmount)} disabled />
                                    <ErrorLabel message={errors.quantity} />
                                </div>

                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" onClick={e => handleSave()} className="btn btn-info text-white waves-effect">Save</button>
                <button type="button" className="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
                <button type="button" onClick={e => handleClearForm()} className="btn btn-danger waves-effect">Reset Form</button>
            </div>
        </>
    )
}
