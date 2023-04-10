import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common'
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb';
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function CrystalTrackingOut() {
    const requestModelTemplate = {
        id: 0,
        orderDetailId: 0,
        orderId: 0,
        employeeId: 0,
        sizeId: 0,
        shapeId: 0,
        crystalId: 0,
        crystalName: "",
        releasePacketQty: 0,
        releasePieceQty: 0,
        piecesPerPacket: 0,
        returnPacketQty: 0,
        returnPieceQty: 0,
        releaseDate: common.getCurrDate(true),
        crystalTrackingOutDetails: []
    }
    const returnModelTemplate = {
        orderId: 0,
        orderDetailId: 0,
    }
    const headers = headerFormat.addCrystalTrackingOut;

    const [requestModel, setRequestModel] = useState(requestModelTemplate);
    const [returnRequest, setReturnRequest] = useState(returnModelTemplate);
    const [employeeList, setEmployeeList] = useState([]);
    const [crystalList, setCrystalList] = useState([]);
    const [sizeList, setSizeList] = useState([]);
    const [shapeList, setShapeList] = useState([]);
    const [orderNos, setOrderNos] = useState([]);
    const [orderDetailNos, setOrderDetailNos] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState({});
    const [returnSelectedTrackingDetail, setReturnSelectedTrackingDetail] = useState({});
    const [returnOrderDetails, setReturnOrderDetails] = useState({});
    const [selectedTrackingId, setSelectedTrackingId] = useState(0);
    const [errors, setErrors] = useState({});
    const [filteredCrystalList, setFilteredCrystalList] = useState([]);
    const [clearDdlValue, setClearDdlValue] = useState(false);
    const curr_month = new Date().getMonth() + 1;
    const curr_year = new Date().getFullYear();
    const [filterData, setFilterData] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(curr_month - 1, curr_year)),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(curr_month, curr_year))
    });
    const [fetchData, setFetchData] = useState(0);

    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.dropdownController.employee + "?searchTerm=hot_fixer"));
        apiList.push(Api.Get(apiUrls.crystalController.getAllMasterCrystal + `?pageNo=1&pageSize=1000000`));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + "?masterDataTypes=shape&masterDataTypes=size"));
        apiList.push(Api.Get(apiUrls.dropdownController.orderDetailNos + `?excludeDelivered=true`));
        apiList.push(Api.Get(apiUrls.orderController.getByOrderNumber));
        Api.MultiCall(apiList)
            .then(res => {
                setEmployeeList(res[0].data);
                setCrystalList(res[1].data.data);
                setSizeList(res[2].data.filter(x => x.masterDataTypeCode?.toLowerCase() === "size"));
                setShapeList(res[2].data.filter(x => x.masterDataTypeCode?.toLowerCase() === "shape"));
                setOrderDetailNos(res[3].data);
                let orderList = [];
                res[4].data.forEach(element => {
                    orderList.push({ id: element.orderId, value: element.orderNo });
                });
                setOrderNos(orderList);
            });
    }, []);

    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.crytalTrackingController.searchTrackingOut + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            tableDetailOptionTemplet.totalRecords = 0;
            setTableDetailOption({ ...tableDetailOptionTemplet });
        });
    }

    const handleView = (id, data) => {
        setSelectedTrackingId(id);
    }
    const handleEdit = () => {

    }
    const handleDelete = (id) => {
        Api.Delete(apiUrls.crytalTrackingController.deleteTrackingOut + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }

    const handleDetailDelete = (id) => {
        Api.Delete(apiUrls.crytalTrackingController.deleteTrackingOutDetail + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }

    const breadcrumbOption = {
        title: 'Crystal Stock Tracking',
        items: [
            {
                isActive: false,
                title: "Crystal Stock Tracking",
                icon: "bi bi-tag"
            }
        ],
        buttons: [
            {
                text: "Crystal Tracking",
                icon: 'bi bi-gem',
                modelId: 'add-crysal-tracking'
            },
            {
                text: "Retuen Crystal Tracking",
                icon: 'bi bi-gem',
                modelId: 'return-crysal-tracking'
            }
        ]
    }

    useEffect(() => {
        if (selectedTrackingId === 0)
            return;
        let details = tableOption.data.find(x => x.id === selectedTrackingId)?.crystalTrackingOutDetails ?? [];
        tableDetailOptionTemplet.data = details;
        tableDetailOptionTemplet.totalRecords = details?.length;
        setTableDetailOption(tableDetailOptionTemplet);
    }, [selectedTrackingId])


    const tableOptionTemplet = {
        headers: headerFormat.crystalTrackingOutMain,
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
            showEdit: false,
            showPrint: false,
            delete: {
                handler: handleDelete,
                title: "Delete Tracking Record"
            },
            edit: {
                handler: handleEdit,
                icon: "bi bi-pencil",
                modelId: "",
                title: "Edit Tracking Record"
            },
            view: {
                handler: handleView,
                title: "View Tracking Record Detail"
            }
        },
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    const tableDetailOptionTemplet = {
        headers: headerFormat.crystalTrackingOutDetail,
        showTableTop: false,
        data: [],
        totalRecords: 0,
        actions: {
            showView: false,
            showEdit: false,
            showPrint: false,
            delete: {
                handler: handleDetailDelete,
                showModel: true,
                title: "Delete Tracking Detail Record"
            }
        },
    }

    const [tableDetailOption, setTableDetailOption] = useState(tableDetailOptionTemplet);

    useEffect(() => {
        if (fetchData === 0)
            return;
        Api.Get(apiUrls.crytalTrackingController.getAllTrackingOut + `?pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${filterData.fromDate}&toDate=${filterData.toDate}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            });
    }, [pageNo, pageSize, fetchData]);

    useEffect(() => {
        if (requestModel.orderDetailId < 1)
            return;
        Api.Get(apiUrls.orderController.getOrderDetailById + requestModel.orderDetailId)
            .then(res => {
                setSelectedOrderDetail({ ...res.data });
            });
    }, [requestModel.orderDetailId]);

    useEffect(() => {
        if (returnRequest.orderDetailId < 1)
            return;
        Api.Get(apiUrls.orderController.getOrderDetailById + returnRequest.orderDetailId)
            .then(res => {
                setReturnOrderDetails({ ...res.data });
            });
    }, [returnRequest.orderDetailId]);

    useEffect(() => {
        if (returnRequest.orderDetailId < 1)
            return;
        Api.Get(apiUrls.crytalTrackingController.getTrackingOutByOrderDetailId + returnRequest.orderDetailId)
            .then(res => {
                setReturnSelectedTrackingDetail({ ...res.data[0] });
            });
    }, [returnRequest.orderDetailId]);

    const filterChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilterData({ ...filterData, [name]: value });
    }
    const textChange = (e) => {
        var { type, name, value } = e.target;
        var model = requestModel;
        if (type === "select-one" || type === "number") {
            value = parseInt(value);
            setClearDdlValue(false);
        }

        if (name === "sizeId") {
            model.crystalId = 0;
            var filteredCryList = crystalList.filter(x => (value === 0 || x.sizeId === value) && (requestModel.shapeId === 0 || x.shapeId === requestModel.shapeId));
            setFilteredCrystalList([...filteredCryList]);
        }
        if (name === "shapeId") {
            model.crystalId = 0;
            var filteredCryList = crystalList.filter(x => (value === 0 || x.shapeId === value) && (requestModel.sizeId === 0 || x.sizeId === requestModel.sizeId));
            setFilteredCrystalList([...filteredCryList]);
        }
        if (name === "crystalId") {
            var selectedCrystal = crystalList.find(x => x.id === value);
            model.piecesPerPacket = selectedCrystal?.qtyPerPacket ?? 1440;
            model.crystalName = selectedCrystal?.name ?? "";
            model.releasePieceQty = model.releasePacketQty * model.piecesPerPacket;
        }
        if (name === "releasePacketQty") {
            model.piecesPerPacket = crystalList.find(x => x.id === model.crystalId)?.qtyPerPacket ?? 1440;
            model.releasePieceQty = value * model.piecesPerPacket;
        }
        else if (name === "returnPieceQty") {
            model.returnPacketQty = calculateReturnPackets(value, model.piecesPerPacket);
        }
        setRequestModel({ ...model, [name]: value });
    }
    const calculateReturnPackets = (pieces, piecesPerPacket) => {
        var remainingPackets = parseInt(pieces / piecesPerPacket);
        var remainingPiece = pieces % piecesPerPacket;
        var piecesInHalfPacket = parseInt(piecesPerPacket / 2);
        if (remainingPiece > piecesInHalfPacket) {
            remainingPackets += 1;
        }
        return remainingPackets;
    }
    const returnTextChange = (e, index) => {
        debugger;
        var { type, name, value } = e.target;
        let model = returnRequest;
        if (type === "select-one" || type === "number") {
            value = parseInt(value);
            value = isNaN(value) ? 0 : value;
            setClearDdlValue(false);
        }
        if (name === "returnPieceQty") {
            model = returnSelectedTrackingDetail;
            let piecePerPacket = model.crystalTrackingOutDetails[index]?.releasePieceQty / model.crystalTrackingOutDetails[index]?.releasePacketQty;
            model.crystalTrackingOutDetails[index].returnPieceQty = value;
            // model.crystalTrackingOutDetails[index].releasePieceQty -= value > 0 ? 1 : 0;
            model.crystalTrackingOutDetails[index].returnPacketQty = calculateReturnPackets(value, piecePerPacket);
            if (!model.crystalTrackingOutDetails[index].returnDate || model.crystalTrackingOutDetails[index].returnDate === common.defaultDate)
                model.crystalTrackingOutDetails[index].returnDate = common.getHtmlDate(new Date);
            setReturnSelectedTrackingDetail({ ...model });
        }
        else if (name === "returnDate") {
            model = returnSelectedTrackingDetail;
            model.crystalTrackingOutDetails[index].returnDate = value;
            setReturnSelectedTrackingDetail({ ...model });
        }
        else
            setReturnRequest({ ...model, [name]: value });
    }

    const validateError = () => {
        let errors = {};
        var { employeeId, orderDetailId, releaseDate, crystalId, releasePieceQty, releasePacketQty, returnPacketQty, returnPieceQty } = requestModel;
        if (!employeeId || employeeId === 0) errors.employeeId = validationMessage.employeeRequired;
        if (!crystalId || crystalId === 0) errors.crystalId = validationMessage.crystalRequired;
        if (!releaseDate || releaseDate === '') errors.releaseDate = validationMessage.crystalReleaseDateRequired;
        if (!releasePacketQty || releasePacketQty === 0) errors.releasePacketQty = validationMessage.crystalReleaseQtyRequired;
        if (!orderDetailId || orderDetailId === 0) errors.orderDetailId = validationMessage.kandooraRequired;
        if (returnPacketQty > 0 && returnPacketQty > releasePacketQty) errors.returnPacketQty = validationMessage.returnQtyIsMoreThanReleaseQtyError;
        if (returnPieceQty > 0 && returnPieceQty > releasePieceQty) errors.returnPieceQty = validationMessage.returnQtyIsMoreThanReleaseQtyError;
        return errors;
    }

    const addCrystalInTrackingList = () => {
        var isAlreadyAdded = requestModel.crystalTrackingOutDetails.find(x => x.crystalId === requestModel.crystalId);
        if (isAlreadyAdded !== undefined) {
            toast.warn("This crystal is already added.");
            return;
        }

        let formErrors = validateError();
        if (Object.keys(formErrors).length > 0) {
            setErrors({ ...formErrors });
            return;
        }
        setErrors({});
        let model = requestModel;
        model.crystalTrackingOutDetails.push({
            crystalId: model.crystalId,
            employeeId: model.employeeId,
            orderDetailId: model.orderDetailId,
            releaseDate: model.releaseDate,
            releasePacketQty: model.releasePacketQty,
            releasePieceQty: model.releasePieceQty,
            returnPacketQty: model.returnPacketQty,
            returnPieceQty: model.returnPieceQty,
            returnDate: model.returnDate,
            crystalName: model.crystalName
        });
        model.crystalId = 0;
        model.brandId = 0;
        model.releasePacketQty = 0;
        model.releasePieceQty = 0;
        model.crystalName = "";
        model.returnDate = common.getHtmlDate(new Date());
        model.returnPacketQty = 0;
        model.returnPieceQty = 0;
        setFilteredCrystalList([]);
        setClearDdlValue(true);
        setRequestModel({ ...requestModel });
    }

    const deleteCrystalInTrackingList = (crystalId) => {
        var modal = requestModel;
        var newRequestData = [];
        modal.crystalTrackingOutDetails.forEach(res => {
            if (res.crystalId !== crystalId) {
                newRequestData.push(res);
            }
        });
        modal.crystalTrackingOutDetails = newRequestData;
        setRequestModel({ ...modal });
    }

    const handleSave = () => {
        if (requestModel.crystalTrackingOutDetails.length === 0) {
            toast.warn("Please add tracking details first!");
            return;
        }
        Api.Put(apiUrls.crytalTrackingController.addTrackingOut, requestModel)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.saveSuccess);
                    setRequestModel({ ...requestModelTemplate });
                }
                else {
                    toast.warn(toastMessage.saveError);
                }
            })
    }

    const isReleasePacketGreaterThanRequired = () => {
        return requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
            return sum += ele.releasePacketQty - ele.returnPacketQty
        }, 0) > (selectedOrderDetail?.crystal ?? 0)
    }
    const handleUpdateReturn = () => {
        if (returnSelectedTrackingDetail.crystalTrackingOutDetails.find(x => x.returnPieceQty > 0) === undefined) {
            toast.warn("Please enter the return pieces quantity.");
            return;
        }
        if (returnSelectedTrackingDetail.crystalTrackingOutDetails.find(x => x.returnPieceQty > 0 && (x.returnDate === undefined || x.returnDate === "")) === undefined) {
            toast.warn("Please select the return date.");
            return;
        }

        Api.Post(apiUrls.crytalTrackingController.updateTrackingOutReturn, returnSelectedTrackingDetail.crystalTrackingOutDetails)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.updateSuccess);
                }
                else
                    toast.warn(toastMessage.updateError);
            })
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div className="d-flex justify-content-end my-2">
                {/* <h6 className="mb-0 text-uppercase">Kandoora Expense</h6> */}

                <div className='mx-1'>
                    <Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={filterChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                </div>
                <div className='mx-1'>
                    <Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(curr_month, curr_year))} onChangeHandler={filterChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                </div><div className='mx-1'>
                    <ButtonBox type="go" className="btn-sm" onClickHandler={() => { setFetchData(prev => prev + 1) }} />
                </div>
            </div>
            <TableView option={tableOption} />
            <TableView option={tableDetailOption} />
            <div id="add-crysal-tracking" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Crystal Tracking Details</h5>
                            <button type="button" className="btn-close" id='closePopupCustomerDetails' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Order No : ${selectedOrderDetail?.orderNo ?? "Not Selected"}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Price : ${common.printDecimal(selectedOrderDetail?.price)}/${common.getGrade(selectedOrderDetail?.price ?? 0)}`}></Label>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='11px' bold={true} text={`Del. Date : ${common.getHtmlDate(selectedOrderDetail?.orderDeliveryDate, "ddmmyyyy")}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Packet : ${selectedOrderDetail?.crystal ?? 0}`}></Label>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='11px' bold={true} text={`Salesman : ${selectedOrderDetail?.salesman ?? "Not Selected"}`}></Label>
                                </div>
                                <div className="col-4">
                                    <Label text="Order No" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={orderNos} searchable={true} onChange={textChange} name="orderId" value={requestModel.orderId} />
                                    <ErrorLabel message={errors?.orderDetailId} />
                                </div>
                                <div className="col-4">
                                    <Label text="Kandoora No" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={orderDetailNos.filter(x => x.parentId === requestModel.orderId)} searchable={true} onChange={textChange} name="orderDetailId" value={requestModel.orderDetailId} />
                                    <ErrorLabel message={errors?.orderDetailId} />
                                </div>
                                <div className="col-4">
                                    <Label text="Employee" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={employeeList} searchable={true} onChange={textChange} name="employeeId" value={requestModel.employeeId} />
                                    <ErrorLabel message={errors?.employeeId} />
                                </div>
                                {/* <div className="col-3">
                                    <Inputbox className="form-control-sm" labelText="Crystal Issue Date" type="date" isRequired={true} value={requestModel.releaseDate} name="releaseDate" errorMessage={errors?.releaseDate} onChangeHandler={textChange} />
                                </div> */}
                                <hr />
                                <div className="col-4">
                                    <Label text="Shape"></Label>
                                    <Dropdown clearValue={clearDdlValue} className="form-control-sm" data={shapeList} onChange={textChange} name="shapeId" value={requestModel.shapeId} />
                                </div>
                                <div className="col-4">
                                    <Label text="Size"></Label>
                                    <Dropdown clearValue={clearDdlValue} className="form-control-sm" data={sizeList} onChange={textChange} name="sizeId" value={requestModel.sizeId} />
                                </div>
                                <div className="col-4">
                                    <Label text="Crystal" isRequired={true}></Label>
                                    <Dropdown clearValue={clearDdlValue} className="form-control-sm" text="name" data={filteredCrystalList} searchable={true} onChange={textChange} name="crystalId" value={requestModel.crystalId} />
                                    <ErrorLabel message={errors?.crystalId} />
                                </div>
                                <div className="col-2">
                                    <Inputbox className="form-control-sm" labelText="Issue Packets" type="number" isRequired={true} value={requestModel.releasePacketQty} name="releasePacketQty" errorMessage={errors?.releasePacketQty} onChangeHandler={textChange} />
                                </div>
                                <div className="col-2">
                                    <Inputbox className="form-control-sm" labelText="Issue Pieces" type="number" disabled={true} isRequired={true} value={requestModel.releasePieceQty} name="releasePieceQty" errorMessage={errors?.releasePieceQty} onChangeHandler={textChange} />
                                </div>
                                <div className="col-2">
                                    <Inputbox className="form-control-sm" labelText="Return Pieces" disabled={requestModel.releasePacketQty < 1} type="number" value={requestModel.returnPieceQty} name="returnPieceQty" errorMessage={errors?.returnPieceQty} onChangeHandler={textChange} />
                                </div>
                                <div className="col-2">
                                    <Inputbox className="form-control-sm" labelText="Return Packets" min={0} max={requestModel.releasePacketQty} type="number" isRequired={requestModel.returnPieceQty > 0} disabled={true} value={requestModel.returnPacketQty} name="returnPacketQty" errorMessage={errors?.returnPacketQty} onChangeHandler={textChange} />
                                </div>
                                <div className="col-2">
                                    <Inputbox className="form-control-sm" labelText="Release Date" max={new Date()} type="date" isRequired={requestModel.releasePacketQty > 0} disabled={requestModel.releasePacketQty === 0} value={requestModel.releaseDate} name="releaseDate" errorMessage={errors?.releaseDate} onChangeHandler={textChange} />
                                </div>
                                <div className="col-2">
                                    <ButtonBox type="add" style={{ width: "100%" }} onClickHandler={addCrystalInTrackingList} className="btn-sm my-4" />
                                </div>
                                <table className='table table-striped table-bordered fixTableHead'>
                                    <thead>
                                        {headers.map((ele, index) => {
                                            return <th className='text-center' key={index}>{ele.name}</th>
                                        })}
                                    </thead>
                                    <tbody>
                                        {requestModel.crystalTrackingOutDetails?.map((res, index) => {
                                            return <tr key={index}>
                                                {headers.map((ele, hIndex) => {
                                                    if (ele.prop === "sr")
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{index + 1}</td>
                                                    if (ele.prop === "print") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>
                                                            <div key={(index * 100) + hIndex} onClick={e => deleteCrystalInTrackingList(res.crystalId)}>
                                                                <i className='bi bi-trash text-danger' style={{ cursor: "pointer" }}></i>
                                                            </div>
                                                        </td>
                                                    }
                                                    else if (ele.prop === "returnDate") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>
                                                            <Inputbox disabled={res.returnPieceQty === 0} type="date" showLabel={false} name="releaseDate" value={res["releaseDate"]} onChangeHandler={e => { textChange(e, index) }} className="form-control-sm" />
                                                        </td>
                                                    }
                                                    else if (ele.prop === "usedPacket") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{res.releasePacketQty - res.returnPacketQty}</td>
                                                    }
                                                    else if (ele.prop === "usedPiece") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{res.releasePieceQty - res.returnPieceQty}</td>
                                                    }
                                                    else {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{res[ele.prop]}</td>
                                                    }
                                                })}
                                            </tr>
                                        })}
                                    </tbody>
                                    <tbody className='table table-striped table-bordered fixTableHead'>
                                        <tr>
                                            <td className='text-center'></td>
                                            <td className='text-center'></td>
                                            <td className='text-center fw-bold'>Total</td>
                                            <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePacketQty
                                            }, 0)}</td>
                                            <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePieceQty
                                            }, 0)}</td>
                                            <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.returnPacketQty
                                            }, 0)}</td>
                                            <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.returnPieceQty
                                            }, 0)}</td>
                                            <td className={isReleasePacketGreaterThanRequired() ? "bg-danger text-center" : "text-center"} data-toggle="tooltip" title={isReleasePacketGreaterThanRequired() ? "Release packet is greter than required packet" : ""}>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePacketQty - ele.returnPacketQty
                                            }, 0)}</td>
                                            <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePieceQty - ele.returnPieceQty
                                            }, 0)}</td>
                                            <td className='text-center'></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="save" onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" className="btn-sm" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div>
            <div id="return-crysal-tracking" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Return Crystal Tracking</h5>
                            <button type="button" className="btn-close" id='closePopupCustomerDetails' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Order No : ${returnOrderDetails?.orderNo ?? "Not Selected"}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Price : ${common.printDecimal(returnOrderDetails?.price)}/${common.getGrade(returnOrderDetails?.price ?? 0)}`}></Label>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='11px' bold={true} text={`Del. Date : ${common.getHtmlDate(returnOrderDetails?.orderDeliveryDate, "ddmmyyyy")}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Packet : ${returnOrderDetails?.crystal ?? 0}`}></Label>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='11px' bold={true} text={`Salesman : ${returnOrderDetails?.salesman ?? "Not Selected"}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Issue Date : ${common.getHtmlDate(returnSelectedTrackingDetail?.releaseDate, "ddmmyyyy")}`}></Label>
                                </div>
                                <div className="col-10">
                                    <Label fontSize='11px' bold={true} text={`Employee : ${returnSelectedTrackingDetail?.employeeName}`}></Label>
                                </div>
                                <div className="col-3 offset-sm-0 offset-md-3">
                                    <Label text="Order No" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={orderNos} searchable={true} onChange={returnTextChange} name="orderId" value={returnRequest.orderId} />
                                </div>
                                <div className="col-3">
                                    <Label text="Kandoora No" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={orderDetailNos.filter(x => x.parentId === returnRequest.orderId)} onChange={returnTextChange} name="orderDetailId" value={returnRequest.orderDetailId} />
                                </div>
                                <table className='table table-striped table-bordered fixTableHead'>
                                    <thead>
                                        {headers.map((ele, index) => {
                                            return <th className='text-center' key={index}>{ele.name}</th>
                                        })}
                                    </thead>
                                    <tbody>
                                        {returnSelectedTrackingDetail?.crystalTrackingOutDetails?.map((res, index) => {
                                            return <tr key={index}>
                                                {headers.map((ele, hIndex) => {
                                                    if (ele.prop === "sr")
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{index + 1}</td>
                                                    if (ele.prop === "print") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>
                                                            <div key={(index * 100) + hIndex} onClick={e => deleteCrystalInTrackingList(res.crystalId)}>
                                                                <i className='bi bi-trash text-danger' style={{ cursor: "pointer" }}></i>
                                                            </div>
                                                        </td>
                                                    }
                                                    else if (ele.prop === "returnPieceQty") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>
                                                            <Inputbox type="number" showLabel={false} name={ele.prop} value={res[ele.prop]} onChangeHandler={e => { returnTextChange(e, index) }} className="form-control-sm" />
                                                        </td>
                                                    }
                                                    else if (ele.prop === "returnDate") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>
                                                            <Inputbox disabled={res.returnPieceQty === 0} type="date" min={new Date(res.releaseDate)} showLabel={false} name={ele.prop} value={res[ele.prop]} onChangeHandler={e => { returnTextChange(e, index) }} className="form-control-sm" />
                                                        </td>
                                                    }
                                                    else if (ele.prop === "usedPacket") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{res.releasePacketQty - res.returnPacketQty}</td>
                                                    }
                                                    else if (ele.prop === "usedPiece") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{res.releasePieceQty - res.returnPieceQty}</td>
                                                    }
                                                    else {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{res[ele.prop]}</td>
                                                    }
                                                })}
                                            </tr>
                                        })}
                                    </tbody>
                                    <tbody className='table table-striped table-bordered fixTableHead'>
                                        <tr>
                                            <td className='text-center'></td>
                                            <td className='text-center'></td>
                                            <td className='text-center fw-bold'>Total</td>
                                            <td className='text-center'>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePacketQty
                                            }, 0)}</td>
                                            <td className='text-center'>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePieceQty
                                            }, 0)}</td>
                                            <td className='text-center'>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.returnPacketQty
                                            }, 0)}</td>
                                            <td className='text-center'>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.returnPieceQty
                                            }, 0)}</td>
                                            <td className={isReleasePacketGreaterThanRequired() ? "bg-danger text-center" : "text-center"} data-toggle="tooltip" title={isReleasePacketGreaterThanRequired() ? "Release packet is greter than required packet" : ""}>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePacketQty - ele.returnPacketQty
                                            }, 0)}</td>
                                            <td className='text-center'>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePieceQty - ele.returnPieceQty
                                            }, 0)}</td>
                                            <td className='text-center'></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="update" onClickHandler={handleUpdateReturn} className="btn-sm" />
                            <ButtonBox type="cancel" className="btn-sm" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
