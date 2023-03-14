import React, { useState, useEffect, Fragment, useRef } from 'react'
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
import HelpText from '../common/HelpText';
import CustomerStatement from './CustomerStatement';
import ButtonBox from '../common/ButtonBox';
import PrintOrderReceiptPopup from '../print/orders/PrintOrderReceiptPopup';
import Inputbox from '../common/Inputbox';

export default function CustomerOrderForm({ userData, orderSearch, setViewSampleImagePath }) {
    const customerOrderModelTemplate = {
        id: 0,
        customerRefName: '',
        orderDeliveryDate: '',
        firstname: "",
        customerId: 0,
        lastname: "",
        contact1: "+97150",
        contact2: "",
        orderNo: "093423",
        employeeId: userData?.userId,
        designSampleId: 0,
        measurementStatus: 'Ok',
        orderStatus: 'Normal',
        categoryId: 0,
        city: "Dubai",
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
        sleeve: '',
        shoulder: '',
        neck: '',
        extra: '',
        cuff: '',
        price: '',
        size: "",
        waist: "",
        measurementCustomerName: '',
        crystal: '0',
        crystalPrice: 0,
        workType: "",
        workTypes: [],
        workTypesHelpText: [],
        quantity: '',
        description: "",
        totalAmount: 0,
        subTotalAmount: 0,
        advanceAmount: 0,
        balanceAmount: 0,
        paymentMode: "Cash",
        lastSalesMan: '',
        qty: 0

    };
    const [designFilter, setDesignFilter] = useState({
        modelSearch: "",
        designSearch: "",
    });
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const [customerMeasurementList, setCustomerMeasurementList] = useState([]);
    const [preSampleCount, setPreSampleCount] = useState(0);
    const [viewMeasurements, setViewMeasurements] = useState(false);
    const [viewCustomers, setViewCustomers] = useState(false);
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
    const [pageSize, setPageSize] = useState(20);
    const [designSample, setDesignSample] = useState([]);
    const [orderEditRow, setOrderEditRow] = useState(-1);
    const [selectedModelAvailableQty, setSelectedModelAvailableQty] = useState(100000);
    const [showCustomerStatement, setShowCustomerStatement] = useState(false);
    const [customerWithSameMobileNo, setCustomerWithSameMobileNo] = useState([]);
    const [orderDataToPrint, setOrderDataToPrint] = useState({ orderNo: "00000", id: 0 });
    const [designImagePath, setDesignImagePath] = useState("");
    const [preOrderWithModels, setPreOrderWithModels] = useState([]);
    const [selectdPreModelByCustomer, setSelectdPreModelByCustomer] = useState(0);
    const handleTextChange = (e) => {
        var { value, type, name } = e.target;
        setErrors({});
        let mainData = customerOrderModel;
        if (name === 'contact1') {
            debugger;
            let isExist = customerList?.find(x => x.contact1 === value);
            if (isExist !== undefined) {
                setHasCustomer(true);
                mainData.firstname = isExist.firstname;
                mainData.lastname = isExist.lastName;
                mainData.contact2 = isExist.contact2;
                mainData.poBox = isExist.poBox;
                mainData.customerId = isExist.id;
                mainData.lastSalesMan = isExist.lastSalesMan === null ? `${userData.firstName} ${userData.lastName}` : isExist.lastSalesMan;
                setSelectedCustomerId(mainData.customerId);
            }
            else {
                setHasCustomer(false);
                mainData.branch = "";
                mainData.contact1 = value === '' ? '+97150' : value;
                mainData.contact2 = "";
                mainData.poBox = "";
                mainData.customerId = 0;
                mainData.firstname = "";
                mainData.preAmount = 0;
                setSelectedCustomerId(mainData.customerId);
                setCustomerOrderModel({ ...mainData });
                setHasCustomer(false);
                return;
            }
        }
        if (name === 'customerId') {
            mainData.branch = "";
            mainData.contact1 = value;
            mainData.contact2 = "";
            mainData.poBox = "";
            mainData.customerId = 0;
            mainData.firstname = "";
            setSelectedCustomerId(mainData.customerId);
            setCustomerOrderModel({ ...mainData });
            setHasCustomer(false);
            return;
        }
        if (type === 'select-one' && name === "employeeId") {
            value = parseInt(value);
        }

        if (type === 'number') {
            value = isNaN(parseFloat(value)) ? 0 : parseFloat(value);

            if (name === 'price') {
                value = value === 0 ? "" : value;
            }
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
                mainData.advanceAmount = value === 0 ? '' : value;
                mainData.balanceAmount = mainData.totalAmount - value;
                setCustomerOrderModel({ ...mainData });
                return;
            }
            if (name === "subTotalAmount") {
                mainData[name] = value;
                let { amountWithVat } = common.calculateVAT(mainData.subTotalAmount, common.vat);
                mainData.totalAmount = amountWithVat
                mainData.balanceAmount = amountWithVat - mainData.advanceAmount
                setCustomerOrderModel({ ...mainData });
                return;
            }
        }


        if (name === 'workType' && value.trim() !== '' && value.length > 0) {
            mainData.workTypes = [];
            mainData.workTypesHelpText = [];
            value.split('').forEach(ele => {
                var workTypeData;
                if (Array.isArray(workTypeList)) {
                    workTypeData = workTypeList.find(x => x.code === ele);
                }
                else {
                    Object.keys(workTypeList).forEach(key => {
                        if (workTypeList[key].code === ele) {
                            workTypeData = workTypeList[key];
                        }
                    })
                }
                if (workTypeData !== undefined) {
                    mainData.workTypes.push(workTypeData.id);
                    mainData.workTypesHelpText.push(`${workTypeData.code}-${workTypeData.value}`)
                }
            });
        }
        else
            mainData.workTypesHelpText = [];
        setCustomerOrderModel({ ...customerOrderModel, [name]: value });
    }

    const modifyCustomerData = data => {
        if (Array.isArray(data)) {
            data.forEach(ele => {
                ele.firstname = `${ele.firstname}`;
            })
        }
        setCustomerList(data);
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
            modifyCustomerData(res[0].data.data);
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
    }, []);

    const refreshOrderNo = () => {
        Api.Get(apiUrls.orderController.getOrderNo)
            .then(res => {
                setCustomerOrderModel({ ...customerOrderModel, "orderNo": res.data?.toString() })
            });
    }

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
                mainData.sleeve = common.defaultIfEmpty(res[1].data.sleeve, 0);
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
        var { firstname, contact1 } = customerOrderModel;
        const newError = {};
        if (!firstname || firstname === "") newError.firstname = validationMessage.firstNameRequired;
        if (contact1?.length === 0) newError.contact1 = validationMessage.contactRequired;
        return newError;
    }

    const addCustomerHandler = (e) => {
        e.preventDefault();
        var formError = validateAddCustomer();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        Api.Put(apiUrls.customerController.add, customerOrderModel)
            .then(res => {
                debugger;
                if (res.data.id > 0) {
                    toast.success(toastMessage.saveSuccess);
                    setCustomerOrderModel({ ...customerOrderModel, ["customerId"]: res.data.id });
                    setHasCustomer(true);
                }
            }).catch(err => {
                debugger;
            });
    }

    const getDesignSample = (designCategoryId) => {
        const sampleList = designSample?.filter(x => x.categoryId === designCategoryId);
        setCustomerOrderModel({ ...customerOrderModel, ['categoryId']: designCategoryId });
        setSelectedDesignSample(sampleList);
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
    const printButtonRef = useRef();
    const handleSave = (e) => {
        e.preventDefault();
        let data = customerOrderModel;
        data.advanceAmount = common.defaultIfEmpty(data.advanceAmount, 0);
        var formError = validateSaveOrder();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        data.qty = data.orderDetails.length; // Order quntity
        setErrors({});
        Api.Put(apiUrls.orderController.add, data).then(res => {
            if (res.data.id > 0) {
                toast.success(toastMessage.saveSuccess);
                common.closePopup('closePopupCustomerOrderCreate', () => { setCustomerOrderModel({ ...customerOrderModelTemplate }) });
                orderSearch('');
                handleClearForm();
                Api.Get(apiUrls.orderController.get + res.data.id)
                    .then(orderRes => {
                        setOrderDataToPrint({ ...orderRes.data });
                        printButtonRef.current.click();
                        printButtonRef.current.click();
                    })
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
            { name: "Deep", prop: "deep" },
            { name: "BackDown", prop: "backDown" },
            { name: "Extra", prop: "extra" },
            { name: "Size", prop: "size" },
            { name: 'Customer Name', prop: 'measurementCustomerName' },
            { name: "Description", prop: "description" },
            { name: "Work Type", prop: "workType" },
            { name: "Order Status", prop: "orderStatus" },
            { name: "Measurement Status", prop: "measurementStatus" },
            { name: "Crystal", prop: "crystal", action: { decimal: true } },
            { name: "Price", prop: "price", action: { decimal: true } },
            { name: "Sub Total Amount", prop: "subTotalAmount", action: { decimal: true } },
            { name: `VAT ${common.vat}%`, prop: "VATAmount", action: { decimal: true } },
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
        var total = ((subTotal / 100) * common.vat) + subTotal;
        var catName = designCategoryList.find(x => x.id === customerOrderModel.categoryId);
        var sampleName = designSample.find(x => x.id === customerOrderModel.designSampleId);
        var orderDetail = {
            id: 0,
            orderNo: "",
            price: customerOrderModel.price,
            categoryName: catName === undefined ? '' : catName.value,
            designSampleName: sampleName === undefined ? '' : sampleName.model,
            designSampleId: customerOrderModel.designSampleId,
            chest: customerOrderModel.chest?.toString(),
            sleeveLoose: customerOrderModel.sleeveLoose.toString(),
            deep: customerOrderModel.deep?.toString(),
            backDown: customerOrderModel.backDown?.toString(),
            bottom: customerOrderModel.bottom?.toString(),
            length: customerOrderModel.length?.toString(),
            hipps: customerOrderModel.hipps?.toString(),
            sleeve: customerOrderModel.sleeve?.toString(),
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
            VATAmount: parseFloat(total - subTotal).toFixed(2),
            totalAmount: total,
            workTypes: customerOrderModel.workTypes,
            measurementCustomerName: customerOrderModel.measurementCustomerName
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
        var totalAmountWithVAT = ((subTotalAmount / 100) * common.vat) + subTotalAmount;
        existingData.subTotalAmount = subTotalAmount + parseFloat(existingData.subTotalAmount);
        existingData.totalAmount = totalAmountWithVAT + parseFloat(existingData.totalAmount);
        existingData.balanceAmount = existingData.totalAmount - existingData.advanceAmount;
        tableOptionTemplet.data = existingData.orderDetails;
        tableOptionTemplet.totalRecords = existingData.orderDetails.length;
        setTableOption(tableOptionTemplet);
        existingData.quantity = '';
        existingData.price = 0;
        existingData.workType = "";
        existingData.crystal = "";
        existingData.workTypes = [];
        existingData.workTypesHelpText = [];
        setCustomerOrderModel({ ...existingData });
        setWorkTypeList({ ...workTypeList })
    }

    const validateWorkType = (workType) => {
        if (workType === undefined || workType === '')
            return false;
        var workArray = workType.split('');
        const toFindDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index)
        if (workType !== '' && !RegexFormat.digitOnly.test(workType))
            return false;
        if (workType.indexOf('8') > -1 || workType.indexOf('9') > -1 || workType.indexOf('0') > -1 || workType.indexOf('.') > -1)
            return false;
        if (toFindDuplicates(workArray).length > 0)
            return false;
        return true;
    }

    const validateCreateOrder = () => {
        var { price, quantity, crystal, orderStatus, workType, measurementStatus, orderDeliveryDate, orderDate } = customerOrderModel;
        var errors = {};
        if (!validateWorkType(workType)) errors.workType = "Invalid work type";
        if (!price || price === 0 || price === '') errors.price = validationMessage.priceRequired;
        if (crystal && (crystal.length > 0 && crystal !== '' && isNaN(parseFloat(crystal)))) errors.crystal = validationMessage.invalidCrystalQuantity;
        if (!quantity || quantity === '' || quantity === 0) errors.quantity = validationMessage.quantityRequired;
        if (!orderStatus || orderStatus === '') errors.orderStatus = validationMessage.orderStatusRequired;
        if (!orderDeliveryDate || orderDeliveryDate === '') errors.orderDeliveryDate = validationMessage.deliveryDateRequired;
        if (!measurementStatus || measurementStatus === '') errors.measurementStatus = validationMessage.measurementStatusRequired;
        if (!orderDate || orderDate === '') errors.orderDate = validationMessage.orderDateRequired;
        if (new Date(orderDate) > new Date()) errors.orderDate = validationMessage.orderFutureDateIsNotAllowed;
        return errors;
    }

    const validateSaveOrder = () => {
        var { orderDetails, totalAmount, subTotalAmount, paymentMode, employeeId, orderDate, customerId } = customerOrderModel;
        var errors = {};
        if (!orderDetails || orderDetails.length === 0) errors.orderDetails = validationMessage.noOrderDetailsError;
        if (!subTotalAmount || subTotalAmount === 0) errors.subTotalAmount = validationMessage.invalidSubTotal;
        if (!totalAmount || totalAmount === 0) errors.totalAmount = validationMessage.invalidTotalAmount;
        if (!employeeId || employeeId === 0) errors.employeeId = validationMessage.salesmanRequired;
        if (!customerId || customerId === 0) errors.customerId = validationMessage.customerRequired;
        if (!paymentMode || paymentMode === '') errors.paymentMode = validationMessage.paymentModeRequired;
        if (!orderDate || orderDate === '') errors.orderDate = validationMessage.orderDateRequired;
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
        totalAmount = ((subTotal / 100) * common.vat) + subTotal;
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
            setHasCustomer(false);
            setSelectedDesignSample([])
        });
    }

    useEffect(() => {
        if (customerOrderModel.customerId === 0)
            return;
        let encodeContactNo = common.contactNoEncoder(customerOrderModel.contact1);
        let apiList = [];
        apiList.push(Api.Get(apiUrls.customerController.getByContactNo + `?contactNo=${encodeContactNo}`));
        apiList.push(Api.Get(apiUrls.orderController.getCustomerMeasurements + `?contactNo=${encodeContactNo}`))

        Api.MultiCall(apiList)
            .then(res => {
                setCustomerWithSameMobileNo(res[0].data);
                res[1].data.forEach(ele => {
                    ele.measurementCustomerName = common.defaultIfEmpty(ele.measurementCustomerName, customerOrderModel.firstname)
                })
                setCustomerMeasurementList(res[1].data);
            });
    }, [customerOrderModel.customerId]);

    useEffect(() => {
        if (customerOrderModel.designSampleId === 0 || customerOrderModel.customerId === 0)
            return;
        Api.Get(apiUrls.orderController.getSampleCountInPreOrder + `${customerOrderModel.customerId}&sampleId=${customerOrderModel.designSampleId}`)
            .then(res => {
                setPreSampleCount(res.data);
            })
    }, [customerOrderModel.designSampleId])

    useEffect(() => {
        if(customerList?.find(x=>x.contact1===customerOrderModel.contact1)!==undefined)
        {
            Api.Get(apiUrls.orderController.getUsedModalByContact+common.contactNoEncoder(customerOrderModel.contact1))
            .then(res=>{
                setPreOrderWithModels(res.data);
            })
        }
    }, [customerOrderModel.contact1])
    

    const measurementCustomerNameSelectHandler = (data) => {
        let mainData = customerOrderModel;
        mainData.chest = common.defaultIfEmpty(data.chest, '');
        mainData.sleeveLoose = common.defaultIfEmpty(data.sleeveLoose, '');
        mainData.deep = common.defaultIfEmpty(data.deep, '');
        mainData.backDown = common.defaultIfEmpty(data.backDown, '');
        mainData.bottom = common.defaultIfEmpty(data.bottom, '');
        mainData.length = common.defaultIfEmpty(data.length, '');
        mainData.hipps = common.defaultIfEmpty(data.hipps, '');
        mainData.sleeve = common.defaultIfEmpty(data.sleeve, '');
        mainData.shoulder = common.defaultIfEmpty(data.shoulder, '');
        mainData.neck = common.defaultIfEmpty(data.neck, '');
        mainData.extra = common.defaultIfEmpty(data.extra, '');
        mainData.cuff = common.defaultIfEmpty(data.cuff, '');
        mainData.size = common.defaultIfEmpty(data.size, '');
        mainData.waist = common.defaultIfEmpty(data.waist, '');
        mainData.measurementCustomerName = common.defaultIfEmpty(data.measurementCustomerName, '');
        setCustomerOrderModel({ ...mainData });
    }

    const existingCustomerNameSelectHandler = (data) => {
        let mainData = customerOrderModel;
        mainData.customerId = common.defaultIfEmpty(data.id, '');
        mainData.firstname = common.defaultIfEmpty(data.firstname, '');
        mainData.lastname = common.defaultIfEmpty(data.lastName, '');
        mainData.contact2 = common.defaultIfEmpty(data.contact2, '');

        setCustomerOrderModel({ ...mainData });
    }
    const handleDesignFilterChange = (e) => {
        var { name, value } = e.target;
        setDesignFilter({ ...designFilter, [name]: value });
    }

    return (
        <>
            <div className="modal-body">
                <form className="form-horizontal form-material">
                    <div className="card">
                        <div className="card-body">
                            <div className="row g-2">
                                <div className='col-12 col-lg-10 d-flex'>
                                    <div className='row g-1'>
                                        <div className="col-md-2">
                                            <Label fontSize='13px' text="Order No"></Label>
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control form-control-sm" name='orderNo' onChange={e => handleTextChange(e)} value={customerOrderModel.orderNo} placeholder="" />
                                                <div className="input-group-append">
                                                    <button onClick={e => refreshOrderNo()} className="btn btn-sm btn-outline-secondary" type="button"><i className='bi bi-arrow-clockwise' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <Label fontSize='13px' text="Contact" isRequired={!hasCustomer}></Label>
                                            <input type="text" name="contact1" onChange={e => handleTextChange(e)} value={customerOrderModel.contact1} className="form-control form-control-sm" />
                                            <ErrorLabel message={errors?.customerId}></ErrorLabel>
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <Label fontSize='13px' text="FirstName" isRequired={!hasCustomer}></Label>

                                            <div className="input-group mb-3">
                                                <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.firstname} name="firstname" className="form-control form-control-sm" />
                                                {customerWithSameMobileNo.length > 0 && <button className="btn btn-outline-secondary btn-sm" onClick={e => setViewCustomers(!viewCustomers)} type="button" id="button-addon2"><i className='bi bi-eye' /></button>}
                                            </div>
                                            {
                                                !hasCustomer &&
                                                <ErrorLabel message={errors?.firstname}></ErrorLabel>
                                            }
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <Label fontSize='13px' text="Lastname"></Label>
                                            <input type="text" className="form-control form-control-sm" onChange={e => handleTextChange(e)} value={customerOrderModel.lastname} name="lastname" placeholder="" />
                                            {
                                                !hasCustomer &&
                                                <ErrorLabel message={errors?.lastname}></ErrorLabel>
                                            }
                                        </div>
                                        {
                                            hasCustomer &&
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='13px' text="Salasman"></Label>
                                                <input type="text" value={customerOrderModel.lastSalesMan} className="form-control form-control-sm" placeholder="" disabled />
                                            </div>
                                        }

                                        {(!hasCustomer || common.defaultIfEmpty(customerOrderModel.contact2, '').length > 0) &&
                                            <div className="col-12 col-md-2">
                                                <Label fontSize='13px' text="Contact2"></Label>
                                                <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.contact2} name="contact2" className="form-control form-control-sm" disabled={hasCustomer ? 'disabled' : ''} />
                                            </div>
                                        }
                                        <div className="col-12 col-md-2" style={{ marginTop: '1px' }}>
                                            <ButtonBox type="save" text="Add Customer" onClickHandler={addCustomerHandler} className="btn-sm mt-4" />
                                        </div>
                                        {hasCustomer &&

                                            <div className="col-12 col-md-2">
                                                <Label fontSize='13px' text="Pre. Amount"></Label>
                                                <div className="input-group mb-3">
                                                    <input type="number" min={0} onChange={e => handleTextChange(e)} name="preAmount" value={customerOrderModel.preAmount} className="form-control form-control-sm" disabled />

                                                    <div className="input-group-append">
                                                        <button onClick={e => setShowCustomerStatement(!showCustomerStatement)} className="btn btn-sm btn-outline-secondary" type="button"><i className='bi bi-eye' /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            preOrderWithModels.length>0 &&    <div className="col-12 col-md-4">
                                            <Label fontSize='13px' text="Pre. Modals By Customer"></Label> 
                                            <Dropdown data={preOrderWithModels} className="form-control-sm" value={selectdPreModelByCustomer} onChange={(e)=>{setSelectdPreModelByCustomer(e.target.value)}} />
                                            </div>
                                        }
                                        <div className="col-9">
                                            {viewCustomers && <>
                                                <Label fontSize='13px' text="Select Customer Name" helpText="Select Customer name"></Label>
                                                <div className='kan-list'>{
                                                    customerWithSameMobileNo?.map((ele, index) => {
                                                        return <div key={index} className="item active" onClick={e => { setViewCustomers(false); existingCustomerNameSelectHandler(ele) }} >
                                                            {ele.firstname}
                                                        </div>
                                                    })
                                                }
                                                </div>
                                            </>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-lg-2 d-flex'>

                                    <div className='col-12 col-md-12'>
                                        <Barcode value={customerOrderModel.orderNo} width={2} height={50}></Barcode>
                                    </div>
                                </div>
                                {
                                    showCustomerStatement && <>
                                        <div className="clearfix"></div>
                                        <CustomerStatement contactNo={customerOrderModel.contact1} />
                                    </>
                                }
                                <div className="clearfix"></div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Order Date"></Label>
                                    <input type="date" onChange={e => handleTextChange(e)} max={common.getHtmlDate(new Date())} className="form-control form-control-sm" name='orderDate' value={customerOrderModel.orderDate} />
                                    <ErrorLabel message={errors.orderDate} />
                                </div>

                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Delivery Date" isRequired={true}></Label>
                                    <input type="date" min={common.getHtmlDate(customerOrderModel.orderDate)} name='orderDeliveryDate' onChange={e => handleTextChange(e)} value={customerOrderModel.orderDeliveryDate} className="form-control form-control-sm" />
                                    <ErrorLabel message={errors.orderDeliveryDate} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Salesman" isRequired={true}></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={salesmanList} defaultValue='0' name="employeeId" value={customerOrderModel.employeeId} defaultText="Select salesman.." />
                                    <ErrorLabel message={errors.employeeId} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Measu. Status" isRequired={true}></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={measurementStatusList} defaultValue='' elementKey="value" name="measurementStatus" value={customerOrderModel.measurementStatus} defaultText="Select measurement status.." />
                                    <ErrorLabel message={errors.measurementStatus} />
                                </div>

                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Order Stat." isRequired={true}></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={orderStatusList} defaultValue='Normal' elementKey='value' name="orderStatus" value={customerOrderModel.orderStatus} defaultText="Select order status.." />
                                    <ErrorLabel message={errors.orderStatus} />
                                </div>

                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="City"></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={cityList} defaultValue='' elementKey="value" name="city" value={customerOrderModel.city} defaultText="Select city.." />
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
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.sleeve} name="sleeve" className="form-control form-control-sm" />
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
                                    <Label fontSize='13px' text="Deep"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.deep} name="deep" className="form-control form-control-sm" />
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
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Customer Name" helpText="Customer name for measurement"></Label>
                                    <div className="input-group mb-3">
                                        <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.measurementCustomerName} name="measurementCustomerName" className="form-control form-control-sm" />
                                        {customerMeasurementList.length > 0 && <button className="btn btn-outline-secondary btn-sm" onClick={e => setViewMeasurements(!viewMeasurements)} type="button" id="button-addon2"><i className='bi bi-eye' /></button>}
                                    </div>
                                </div>
                                <div className="col-9">
                                    {viewMeasurements && <>
                                        <Label fontSize='13px' text="Select Customer Name" helpText="Select Customer name to apply measurement"></Label>
                                        <div className='kan-list'>{
                                            customerMeasurementList?.map((ele, index) => {
                                                return <div key={index} className="item active" onClick={e => { setViewMeasurements(false); measurementCustomerNameSelectHandler(ele) }} >
                                                    {ele.measurementCustomerName}
                                                </div>
                                            })
                                        }
                                        </div>
                                    </>
                                    }
                                </div>
                                <div className="clearfix"></div>
                                {/* {designCategoryList?.length > 0 &&
                                    <div className='row'>
                                        <div className='col-4'>
                                            <div className='text-center fw-bold'>Model category</div>
                                            <Inputbox type="text" className="form-control-sm" showLabel={false} placeholder="Search Model" name="modelSearch" value={designFilter.modelSearch} onChangeHandler={handleDesignFilterChange} />
                                            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                <ErrorLabel message={errors.designSampleId} />
                                                <ul className="list-group">
                                                    {
                                                        designCategoryList?.filter(x => designFilter.modelSearch === "" || x.value?.indexOf(designFilter.modelSearch?.toUpperCase()) > -1)?.map((ele, index) => {
                                                            return <li key={ele.id}
                                                                onClick={e => { getDesignSample(ele.id); handleTextChange({ target: { name: "categoryId", type: "number", value: ele.id } }); setSelectedModelAvailableQty(100000) }}
                                                                className={"list-group-item d-flex justify-content-between align-items-center" + (customerOrderModel.categoryId === ele.id ? " activeSample" : "")}>
                                                                {ele.value}
                                                                <span className="badge badge-danger badge-pill text-dark">
                                                                    {designSample?.filter(x => x.categoryId === ele.id).length} Models
                                                                </span>
                                                            </li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className='col-4'>
                                            <div className='text-center fw-bold'>Model design</div>
                                            <Inputbox type="text" className="form-control-sm" showLabel={false} placeholder="Search Design" name="designSearch" value={designFilter.designSearch} onChangeHandler={handleDesignFilterChange} />
                                            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                {selectedDesignSample?.length > 0 && <>
                                                    <ul className="list-group">
                                                        {
                                                            selectedDesignSample?.filter(x => designFilter.designSearch === "" || x.model?.indexOf(designFilter.designSearch?.toUpperCase()) > -1)?.map((ele, index) => {
                                                                return <li style={{ padding: '0 15px' }} key={ele.id}
                                                                    onClick={e => { handleTextChange({ target: { name: "designSampleId", type: "number", value: ele.id } }); setCustomerOrderModel({ ...customerOrderModel, ['designSampleId']: ele.id }); setDesignImagePath(ele.picturePath) }}
                                                                    className={"list-group-item d-flex justify-content-between align-items-center" + (customerOrderModel.designSampleId === ele.id ? " activeSample" : "")}>
                                                                    {ele.model}
                                                                    <span className="badge badge-danger badge-pill">
                                                                        <img alt={ele.model} onError={(e) => { e.target.src = "/assets/images/default-image.jpg" }} title="Click on image to zoom" src={ele.thumbPath === "" ? "/assets/images/default-image.jpg" : process.env.REACT_APP_API_URL + ele.thumbPath} style={{ width: '30px', height: '30px', cursor: "zoom-in", border: "2px solid black" }} />
                                                                    </span>
                                                                </li>
                                                            })
                                                        }
                                                    </ul>
                                                </>
                                                }
                                                <ErrorLabel message={errors.designSampleId}></ErrorLabel>
                                                {selectedDesignSample?.length === 0 &&
                                                    <div className="d-flex bd-highlight mb-3 example-parent sampleBox" style={{ justifyContent: 'space-around', fontSize: '1rem', color: '#ff00008f' }}>
                                                        <div>No models are available for selected category</div>
                                                    </div>}
                                            </div>
                                        </div>
                                        <div className='col-4'>
                                            {designImagePath !== undefined &&
                                                <div className='card'>
                                                    <div className='card-body'>
                                                        <img onError={(e) => { e.target.src = "/assets/images/default-image.jpg" }} src={designImagePath === "" ? "/assets/images/default-image.jpg" : process.env.REACT_APP_API_URL + designImagePath} className='img-fluid' style={{ height: '150px', width: '100%' }}></img>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                } */}
                                {designCategoryList === 0 && <div className='text-danger' style={{ width: '100%', textAlign: 'center' }}>No Designs are available at this moment. Please Add some designs from master data page.</div>}
                                {/* <div className="d-flex justify-content-start bd-highlight mb-3 example-parent sampleBox" style={{ flexWrap: "wrap" }}>
                                    {
                                        designCategoryList?.map((ele, index) => {
                                            return <div key={ele.id}
                                                onClick={e => { getDesignSample(ele.id); handleTextChange({ target: { name: "categoryId", type: "number", value: ele.id } }); setSelectedModelAvailableQty(100000) }}
                                                className={"p-2 bd-highlight col-example btnbr" + (customerOrderModel.categoryId === ele.id ? " activeSample" : "")}>{ele.value}</div>
                                        })
                                    }
                                </div> */}
                                <>
                                    {
                                        selectedDesignSample?.length > 0 &&
                                        <div className="d-flex justify-content-start bd-highlight mb-3 example-parent">
                                            {
                                                selectedDesignSample?.map((ele, index) => {
                                                    // return <Fragment key={ele.id}>
                                                    //     <div
                                                    //         className={"btn-group btnbr position-relative" + (customerOrderModel.designSampleId === ele.id ? (ele.quantity < 1 ? " activeZeroSample" : " activeSample") : "")}
                                                    //         role="group"
                                                    //         aria-label="Basic example"
                                                    //         style={{ marginRight: "20px", marginBottom: '10px' }}
                                                    //         title={ele.quantity < 1 ? "You do not have enough quantity of butter paper." : `${ele.quantity} butter paper is available`}
                                                    //     >
                                                    //         <div
                                                    //             onClick={e => { handleTextChange({ target: { name: "designSampleId", type: "number", value: ele.id } }); setCustomerOrderModel({ ...customerOrderModel, ['designSampleId']: ele.id }); setSelectedModelAvailableQty(ele.quantity) }}
                                                    //             type="button"
                                                    //             style={{ width: '83%' }}
                                                    //             className=" p-2 bd-highlight col-example">
                                                    //             {ele.model}
                                                    //         </div>
                                                    //         <div
                                                    //             style={{ width: "26px" }}
                                                    //             className="" title='View Image'
                                                    //         >
                                                    //             <img
                                                    //                 src={process.env.REACT_APP_API_URL + ele.picturePath}
                                                    //                 style={{ height: '25px', width: '25px' }}
                                                    //                 className='img-fluid'
                                                    //                 data-bs-target="#table-image-viewer-sample-design" data-bs-toggle="modal" data-bs-dismiss="modal"
                                                    //                 onClick={e => setViewSampleImagePath(ele.picturePath)}></img>
                                                    //         </div>
                                                    //         {/* <img src={process.env.REACT_APP_API_URL + ele.picturePath} style={{ width: "150px" }}></img> */}
                                                    //     </div>
                                                    // </Fragment>
                                                })
                                            }
                                            {selectedModelAvailableQty && customerOrderModel.categoryId > 0 <= 0 && <div className='text-danger' style={{ width: '100%', textAlign: 'center' }}>You do not have enough quantity of butter paper</div>}


                                        </div>
                                    }
                                </>
                                {preSampleCount > 0 && <div className='text-danger' style={{ width: '100%', textAlign: 'center' }}>This Model is used {preSampleCount} time(s) before for this cutomer</div>}
                                {/* {
                                    selectedDesignSample?.length === 0 &&
                                    <div className="d-flex bd-highlight mb-3 example-parent sampleBox" style={{ justifyContent: 'space-around', fontSize: '1.1rem', color: '#ff00008f' }}>
                                        <div>No models are available for selected category</div>
                                    </div>
                                } */}

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
                                <div className="col-12 col-md-6">
                                    <Label fontSize='13px' text="Work Type"></Label>
                                    <input type="text" maxLength={7} value={customerOrderModel.workType} className='form-control form-control-sm' onChange={handleTextChange} placeholder="Work Type" name='workType' />
                                    <ErrorLabel message={errors.workType} />
                                    <HelpText text={customerOrderModel.workTypesHelpText?.join(',')} />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Quantity" isRequired={true}></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} min={0} className="form-control form-control-sm" name='quantity' value={customerOrderModel.quantity} />
                                    <ErrorLabel message={errors.quantity} />
                                </div>
                                <div className="col-12 col-md-2 mt-auto">
                                    <ButtonBox type="save" text="Add Quantity" onClickHandler={createOrderHandler} className="btn-sm mt-4" disabled={customerOrderModel.quantity > 0 ? "" : "disabled"} />
                                </div>
                                <div className="clearfix"></div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Payment Mode" isRequired={true}></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={paymentModeList} defaultValue='Cash' elementKey="value" name="paymentMode" value={customerOrderModel.paymentMode} defaultText="Select payment mode" />
                                    <ErrorLabel message={errors.paymentMode} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Inputbox labelText="Sub Total Amount" disabled={true} errorMessage={errors.subTotalAmount} labelTextHelp="Total amount without VAT" onChangeHandler={handleTextChange} name='subTotalAmount' value={common.printDecimal(customerOrderModel.subTotalAmount)} className="form-control-sm" />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Inputbox labelText={`VAT ${VAT}%`} disabled={true} errorMessage={errors.VAT} onChangeHandler={handleTextChange} name='VAT' value={common.printDecimal(customerOrderModel.totalAmount - customerOrderModel.subTotalAmount)} className="form-control-sm" />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Inputbox labelText="Total Amount" disabled={true} errorMessage={errors.totalAmount} labelTextHelp="Total amount with VAT" onChangeHandler={handleTextChange} name='totalAmount' value={common.printDecimal(customerOrderModel.totalAmount)} className="form-control-sm" />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Advance"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} min={0} className="form-control form-control-sm" name='advanceAmount' value={customerOrderModel.advanceAmount} />
                                    <ErrorLabel message={errors.advanceAmount} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Balance" helpText="Total payable amount by customer"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} min={0} className="form-control form-control-sm" name='balanceAmount' value={common.printDecimal(customerOrderModel.balanceAmount)} disabled />
                                    <ErrorLabel message={errors.balanceAmount} />
                                </div>

                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <ButtonBox className="btn-sm" type="save" onClickHandler={handleSave} style={{ marginRight: "10px" }} />
                <ButtonBox className="btn-sm" type="cancel" modelDismiss={true} style={{ marginRight: "10px" }} />
                <ButtonBox className="btn-sm" type="update" text="Reset Form" onClickHandler={handleClearForm} style={{ marginRight: "10px" }} />
                <div className='d-none'>
                    <button ref={printButtonRef} data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target={"#printOrderReceiptPopupModal" + orderDataToPrint?.id}>Text</button>
                </div>
                <PrintOrderReceiptPopup orderId={orderDataToPrint?.id} modelId={orderDataToPrint?.id} />
            </div>
        </>
    )
}
