import React, { useState, useEffect } from 'react'
import Dropdown from '../common/Dropdown';
import Label from '../common/Label';
import ErrorLabel from '../common/ErrorLabel';
import TableView from '../tables/TableView';
import { toast } from 'react-toastify';
import RegexFormat from '../../utils/RegexFormat';
import { validationMessage } from '../../constants/validationMessage';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import TableImageViewer from '../tables/TableImageViewer';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';

export default function CustomerOrderForm() {
    const customerOrderModelTemplate = {
        id: 0,
        firstname: "",
        customerId: 0,
        lastname: "",
        contact1: "",
        contact2: "",
        orderNo: 0,
        branch: "",
        accountId: "",
        customerName: "",
        salesmanId: 0,
        designSampleId: 0,
        measurementStatusId: 0,
        orderStatusId: 0,
        categoryId: 0,
        cityId: 0,
        poBox: "",
        preAmount: 0,
        deliveryDate: "",
        chest: 0,
        sleevesLoose: 0,
        deep: 0,
        backDown: 0,
        bottom: 0,
        length: 0,
        hipps: 0,
        sleeves: 0,
        shoulder: 0,
        neck: 0,
        extra: 0

    };
    const [customerOrderModel, setCustomerOrderModel] = useState(customerOrderModelTemplate);
    const [hasCustomer, setHasCustomer] = useState(false); const [customerList, setCustomerList] = useState();
    const [salesmanList, setSalesmanList] = useState();
    const [orderStatusList, setOrderStatusList] = useState();
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [measurementStatusList, setMeasurementStatusList] = useState();
    const [designCategoryList, setDesignCategoryList] = useState();
    const [errors, setErrors] = useState({});
    const [selectedDesignSample, setSelectedDesignSample] = useState([]); const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [designSample, setDesignSample] = useState([]);
    const [imageViewerPath, setImageViewerPath] = useState("");
    const handleTextChange = (e) => {
        var { value, type, name } = e.target;
        let mainData = {};
        if (type === 'number' || type === 'select-one') {
            value = parseInt(value);

            if (name === 'firstname') {
                mainData = customerOrderModel;
                mainData.branch = "";
                mainData.contact1 = "";
                mainData.contact2 = "";
                mainData.poBox = "";
                mainData.customerId = 0;
                mainData.firstname = e.target.value;
                mainData.lastname = "";
                setCustomerOrderModel({ ...mainData });
                setHasCustomer(false);
                return;
            }
            if (name === "categoryId") {
                mainData = customerOrderModel;
                mainData.categoryId = value;
                mainData.designSampleId = 0;
                setCustomerOrderModel({ ...mainData });
                return;
            }
        }
        setCustomerOrderModel({ ...customerOrderModel, [name]: value });
    }
   
    useEffect(() => {
        var apisList = [];
        apisList.push(Api.Get(apiUrls.customerController.getAll + `?pageNo=1&pageSize=10000`));
        apisList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + `?masterDataTypes=OrderStatus&masterDataTypes=MeasurementStatus`));
        apisList.push(Api.Get(apiUrls.dropdownController.employee + `?SearchTerm=salesman`));
        apisList.push(Api.Get(apiUrls.dropdownController.designCategory));
        apisList.push(Api.Get(apiUrls.masterController.designSample.getAll + "?pageNo=1&PageSize=100000"));
        Api.MultiCall(apisList).then(res => {
            setCustomerList(res[0].data.data);
            setOrderStatusList(res[1].data.filter(x => x.masterDataType === 'OrderStatus'));
            setMeasurementStatusList(res[1].data.filter(x => x.masterDataType === "MeasurementStatus"));
            setSalesmanList(res[2].data);
            setDesignCategoryList(res[3].data);
            setDesignSample(res[4].data.data);
        });
        console.log('Order Rerender');
    }, []);
    const validateAddCustomer = () => {
        var { firstname, contact1, lastname } = customerOrderModel;
        const newError = {};
        if (!firstname || firstname === "") newError.firstname = validationMessage.firstNameRequired;
        if (!lastname || lastname === "") newError.lastname = validationMessage.lastNameRequired;
        if (contact1?.length === 0 || !RegexFormat.mobile.test(contact1)) newError.contact1 = validationMessage.invalidContact;
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
                setHasCustomer(true);
            }).catch(err => {

            });
    }

    const getDesignSample = (designCategoryId) => {
        const sampleList = designSample?.filter(x => x.categoryId === designCategoryId);
        setSelectedDesignSample(sampleList);
    }
    const viewSampleImage = (imagePath) => { setImageViewerPath(imagePath) };
    const customerDropdownClickHandler = (data) => {
        setHasCustomer(true);
        var mainData = customerOrderModel;
        mainData.branch = data.branch;
        mainData.contact1 = data.contact1;
        mainData.contact2 = data.contact2;
        mainData.poBox = data.poBox;
        mainData.customerId = data.id;
        mainData.firstname = data.firstname;
        mainData.lastname = data.lastname;
        setCustomerOrderModel({ ...mainData });
        console.log(data);
    }

    const handleEdit = (customerId) => {

        Api.Get(apiUrls.customerController.get + customerId).then(res => {
            if (res.data.id > 0) {
                setCustomerOrderModel(res.data);
                setIsRecordSaving(false);
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
        let data = common.assignDefaultValue(customerOrderModelTemplate, customerOrderModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.customerController.add, data).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.saveSuccess);
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.customerController.update, data).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.updateSuccess);
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const tableOptionTemplet = {
        headers: [
            { name: "Category", prop: "categoryName" },
            { name: "Model", prop: "designSampleName" },
            { name: "Chest", prop: "chest" },
            { name: "SleevesLoose", prop: "sleevesLoose" },
            { name: "Deep", prop: "deep" },
            { name: "BackDown", prop: "backDown" },
            { name: "Bottom", prop: "bottom" },
            { name: "Length", prop: "length" },
            { name: "SleevesLoose", prop: "sleevesLoose" },
            { name: "Hipps", prop: "hipps" },
            { name: "Sleeves", prop: "sleeves" },
            { name: "Shoulder", prop: "shoulder" },
            { name: "Neck", prop: "neck" },
            { name: "Extra", prop: "extra" }
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

    return (
        <>
            <div className="modal-body">
                <form className="form-horizontal form-material">
                    <div className="card">
                        <div className="card-body">
                            <div className="row g-2">
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Order No"></Label>
                                    <input type="text" className="form-control form-control-sm" placeholder="4848548" disabled />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Customer Name" isRequired={!hasCustomer}></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={customerList} elemenyKey="firstname" itemOnClick={customerDropdownClickHandler} text="firstname" defaultValue='' name="firstname" value={customerOrderModel.firstname} searchable={true} defaultText="Select Customer.." />
                                    {
                                        !hasCustomer &&
                                        <ErrorLabel message={errors?.firstname}></ErrorLabel>
                                    }
                                </div>
                               
                                                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Lastname" isRequired={!hasCustomer}></Label>
                                    <input type="text" className="form-control form-control-sm" onChange={e => handleTextChange(e)} value={customerOrderModel.lastname} name="lastname" placeholder="" disabled={hasCustomer ? 'disabled' : ''} />
                                    {
                                        !hasCustomer &&
                                        <ErrorLabel message={errors?.lastname}></ErrorLabel>
                                    }
                                </div>
                                {
                                    hasCustomer &&
                                    <div className="col-12 col-md-2">
                                        <Label fontSize='13px' text="Salasman"></Label>
                                        <input type="text" className="form-control form-control-sm" placeholder="" disabled />
                                    </div>
                                }
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Contact1" isRequired={!hasCustomer}></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.contact1} name="contact1" className="form-control form-control-sm" disabled={hasCustomer ? 'disabled' : ''} />
                                    {
                                        !hasCustomer &&
                                        <ErrorLabel message={errors?.contact1}></ErrorLabel>
                                    }
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Contact2"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.contact2} name="contact2" className="form-control form-control-sm" disabled={hasCustomer ? 'disabled' : ''} />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="P.O. Box"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} value={customerOrderModel.poBox} name="poBox" className="form-control form-control-sm" disabled={hasCustomer ? 'disabled' : ''} />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Pre. Amount"></Label>
                                    <input type="text" onChange={e => handleTextChange(e)} name="preAmount" value={customerOrderModel.preAmount} className="form-control form-control-sm" disabled={hasCustomer ? 'disabled' : ''} />
                                </div>
                                {
                                    !hasCustomer &&
                                    <div className="col-12 col-md-2 mt-auto">
                                        <button type="button" className="btn btn-info btn-sm text-white waves-effect" onClick={e => addCustomerHandler()}>
                                            Add Customer
                                        </button>
                                    </div>
                                }
                                 <img src='/assets/images/baa.png' style={{width:'150px',height:'100px'}}></img>
                                <div className="clearfix"></div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Length"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.length} name="length" className="form-control form-control-sm" />
                                </div>

                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Hipps"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.hipps} name="hipps" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Sleeves"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.sleeves} name="sleeves" className="form-control form-control-sm" />
                                </div>

                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Shoulder"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.shoulder} name="shoulder" className="form-control form-control-sm" />
                                </div>

                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Neck"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.neck} name="neck" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Extra"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.extra} name="extra" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Order Stat."></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={orderStatusList} defaultValue='0' name="orderStatusId" value={customerOrderModel.orderStatusId} defaultText="Select measurement status.." />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Saleman"></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={salesmanList} defaultValue='0' name="salesmanId" value={customerOrderModel.salesmanId} defaultText="Select salesman.." />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="City"></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={salesmanList} defaultValue='0' name="cityId" value={customerOrderModel.cityId} defaultText="Select city.." />
                                </div>
                                <div className="clearfix"></div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Chest"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.chest} name="chest" className="form-control form-control-sm" />
                                </div>

                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Bottom"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.bottom} name="bottom" className="form-control form-control-sm" />
                                </div>

                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Sleeves Loo."></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.sleevesLoose} name="sleevesLoose" className="form-control form-control-sm" />
                                </div>

                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Deep"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.deep} name="deep" className="form-control form-control-sm" />
                                </div>

                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Back Down"></Label>
                                    <input type="number" onChange={e => handleTextChange(e)} value={customerOrderModel.backDown} name="backDown" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Name"></Label>
                                    <input type="text" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Measu.Sat."></Label>
                                    <Dropdown className='form-control-sm' onChange={handleTextChange} data={measurementStatusList} defaultValue='0' name="measurementStatusId" value={customerOrderModel.measurementStatusId} defaultText="Select measurement status.." />
                                </div>
                                <div className="col-12 col-md-2">
                                    <Label fontSize='13px' text="Delivery Date"></Label>
                                    <input type="date" name='deliveryDate' onChange={e => handleTextChange(e)} value={customerOrderModel.deliveryDate} className="form-control form-control-sm" />
                                </div>

                                <div className="col-12 col-md-2 mt-auto">
                                    <button type="button" className="btn btn-info text-white waves-effect" data-bs-dismiss="modal">Add
                                        me</button>
                                </div>


                                <div className="clearfix"></div>

                                <div className="d-flex justify-content-start bd-highlight mb-3 example-parent sampleBox" style={{ flexWrap: "wrap" }}>
                                    {
                                        designCategoryList?.map((ele, index) => {
                                            return <div key={index} onClick={e => { getDesignSample(ele.id); handleTextChange({ target: { name: "categoryId", type: "number", value: ele.id } }) }} className={"p-2 bd-highlight col-example btnbr" + (customerOrderModel.categoryId === ele.id ? " activaSample" : "")}>{ele.value}</div>
                                        })
                                    }
                                </div>
                                {
                                    selectedDesignSample?.length > 0 &&
                                    <div className="d-flex justify-content-start bd-highlight mb-3 example-parent sampleBox">
                                        {
                                            selectedDesignSample?.map((ele, index) => {
                                                return <>
                                                    <div key={index} className="btn-group btnbr position-relative" role="group" aria-label="Basic example" style={{ marginRight: "20px", marginBottom: '10px' }}>
                                                        <div
                                                            onClick={e => handleTextChange({ target: { name: "designSampleId", type: "number", value: ele.id } })}
                                                            type="button" className={" p-2 bd-highlight col-example" + (customerOrderModel.designSampleId === ele.id ? " activaSample" : "")}>{ele.model}</div>
                                                        <div
                                                            style={{ width: "26px" }}
                                                            className="" title='View Image'
                                                            onClick={e => viewSampleImage(ele.picturePath)}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#table-image-viewer">
                                                            <i className="bi bi-images"></i>
                                                        </div>
                                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                            {ele.salePrice}
                                                            <span className="visually-hidden">unread messages</span>
                                                        </span>
                                                    </div>
                                                    {/* <div style={{ marginRight: "20px" }} onClick={e => handleTextChange({ target: { name: "designSampleId", type: "number", value: ele.id } })} key={index} className={"position-relative p-2 bd-highlight col-example btnbr" + (customerOrderModel.designSampleId === ele.id ? " activaSample" : "")}>{ele.model}
                                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                                    {ele.salePrice}
                                                                    <span className="visually-hidden">unread messages</span>
                                                                </span></div> */}
                                                </>
                                            })
                                        }
                                    </div>
                                }

                                <TableView option={tableOption} ></TableView>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Price"></Label>
                                    <input type="number" className="form-control form-control-sm" />
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Crystal"></Label>
                                    <input type="text" className="form-control form-control-sm"/>
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="WorkType"></Label>
                                    <input type="number" className="form-control form-control-sm"/>
                                </div>
                                <div className="col-12 col-md-1">
                                    <Label fontSize='13px' text="Quantity"></Label>
                                    <input type="number" className="form-control form-control-sm"/>
                                </div>
                                <div className="col-12 col-md-2 mt-auto">
                                        <button type="button" className="btn btn-info btn-sm text-white waves-effect">
                                            Create Order
                                        </button>
                                    </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" onClick={e => handleSave()} className="btn btn-info text-white waves-effect" data-bs-dismiss="modal"> {isRecordSaving ? "Save" : "Update"}</button>
                <button type="button" className="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
            </div>
            <TableImageViewer imagePath={imageViewerPath} previousModelId={"add-customer-order"} />
        </>
    )
}
