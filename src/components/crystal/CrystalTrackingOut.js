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
        employeeId: 0,
        brandId: 0,
        crystalId: 0,
        crystalName: "",
        jobTitleId: 0,
        releasePacketQty: 0,
        releasePieceQty: 0,
        piecesPerPacket: 0,
        returnPacketQty: 0,
        returnPieceQty: 0,
        releaseDate: common.getCurrDate(true),
        returnDate: common.getCurrDate(true),
        crystalTrackingOutDetails: []
    }
    const [requestModel, setRequestModel] = useState(requestModelTemplate);
    const [employeeList, setEmployeeList] = useState([]);
    const [crystalList, setCrystalList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [jobTitleList, setJobTitleList] = useState([]);
    const [orderDetailNos, setOrderDetailNos] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState({});
    const [errors, setErrors] = useState({});
    const [filteredCrystalList, setFilteredCrystalList] = useState([]);
    const [clearDdlValue, setClearDdlValue] = useState(false);
    const curr_month = new Date().getMonth() + 1;
    const curr_year = new Date().getFullYear();
    const [filterData, setFilterData] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(curr_month - 1, curr_year)),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(curr_month, curr_year))
    });
    const [fetchData, setFetchData] = useState(0)
    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.dropdownController.employee));
        apiList.push(Api.Get(apiUrls.crystalController.getAllMasterCrystal + `?pageNo=1&pageSize=1000000`));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + "?masterDataTypes=brand"));
        apiList.push(Api.Get(apiUrls.dropdownController.orderDetailNos + `?excludeDelivered=true`));
        apiList.push(Api.Get(apiUrls.dropdownController.jobTitle))
        Api.MultiCall(apiList)
            .then(res => {
                setEmployeeList(res[0].data);
                setCrystalList(res[1].data.data);
                setBrandList(res[2].data.filter(x => x.masterDataTypeCode === "brand"));
                setOrderDetailNos(res[3].data);
                setJobTitleList(res[4].data);
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
        }).catch(err => {

        });
    }

    const handleView = (id, data) => {
        let details = tableOption.data.find(x => x.id === id)?.crystalTrackingOutDetails ?? [];
        tableDetailOptionTemplet.data = details;
        tableDetailOptionTemplet.totalRecords = details?.length;
        setTableDetailOption({ ...tableDetailOptionTemplet });
    }
    const handleEdit = () => {

    }
    const handleDelete = (id) => {
        Api.Delete(apiUrls.crytalTrackingController.deleteTrackingOut + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        }).catch(err => {
            toast.error(toastMessage.deleteError);
        });
    }

    const handleDetailDelete = (id) => {
        Api.Delete(apiUrls.crytalTrackingController.deleteTrackingOutDetail + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        }).catch(err => {
            toast.error(toastMessage.deleteError);
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
                icon: 'bi bi-cash-coin',
                modelId: 'add-crysal-tracking'
            }
        ]
    }

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
        showFooter: false,
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
        if (name === "brandId") {
            if (value === 0) {
                setFilteredCrystalList([]);
                return;
            }
            model.crystalId = 0;
            var filteredCryList = crystalList.filter(x => x.brandId === value);
            setFilteredCrystalList([...filteredCryList]);
        }
        else if (name === "crystalId") {
            var selectedCrystal = crystalList.find(x => x.id === value);
            model.piecesPerPacket = selectedCrystal?.qtyPerPacket ?? 1440;
            model.crystalName = selectedCrystal?.name ?? "";
            model.releasePieceQty = model.releasePacketQty * model.piecesPerPacket;
        }
        else if (name === "releasePacketQty") {
            model.piecesPerPacket = crystalList.find(x => x.id === model.crystalId)?.qtyPerPacket ?? 1440;
            model.releasePieceQty = value * model.piecesPerPacket;
        }
        else if (name === "returnPieceQty") {
            var remainingPackets = parseInt(value / model.piecesPerPacket);
            var remainingPiece = value % model.piecesPerPacket;
            var piecesInHalfPacket = parseInt(model.piecesPerPacket / 2);
            if (remainingPiece > piecesInHalfPacket) {
                remainingPackets += 1;
            }
            model.returnPacketQty = remainingPackets;
        }
        setRequestModel({ ...model, [name]: value });
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

    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div className="d-flex justify-content-end">
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
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Crystal Tracking Details</h5>
                            <button type="button" className="btn-close" id='closePopupCustomerDetails' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Order No : ${selectedOrderDetail?.orderNo?.split('-')[0] ?? "Not Selected"}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Price : ${common.printDecimal(selectedOrderDetail?.price ?? 0)}`}></Label>
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
                                <div className="col-3">
                                    <Label text="Kandoora No" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={orderDetailNos} searchable={true} onChange={textChange} name="orderDetailId" value={requestModel.orderDetailId} />
                                    <ErrorLabel message={errors?.orderDetailId} />
                                </div>
                                <div className="col-3">
                                    <Label text="Job Title" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={jobTitleList} searchable={true} onChange={textChange} name="jobTitleId" value={requestModel.jobTitleId} />
                                    <ErrorLabel message={errors?.jobTitleId} />
                                </div>
                                <div className="col-3">
                                    <Label text="Employee" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={employeeList.filter(x => x.data.jobTitleId === requestModel.jobTitleId)} searchable={true} onChange={textChange} name="employeeId" value={requestModel.employeeId} />
                                    <ErrorLabel message={errors?.employeeId} />
                                </div>
                                <div className="col-3">
                                    <Inputbox className="form-control-sm" labelText="Crystal Issue Date" type="date" isRequired={true} value={requestModel.releaseDate} name="releaseDate" errorMessage={errors?.releaseDate} onChangeHandler={textChange} />
                                </div>
                                <hr />
                                <div className="col-5">
                                    <Label text="Brand"></Label>
                                    <Dropdown clearValue={clearDdlValue} className="form-control-sm" data={brandList} searchable={true} onChange={textChange} name="brandId" value={requestModel.brandId} />
                                </div>
                                <div className="col-7">
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
                                    <Inputbox className="form-control-sm" labelText="Return Date" min={requestModel.releaseDate} max={new Date()} type="date" isRequired={requestModel.returnPieceQty > 0} disabled={requestModel.returnPieceQty === 0} value={requestModel.returnDate} name="returnDate" errorMessage={errors?.returnDate} onChangeHandler={textChange} />
                                </div>
                                <div className="col-2">
                                    <ButtonBox type="add" style={{ width: "100%" }} onClickHandler={addCrystalInTrackingList} className="btn-sm my-4" />
                                </div>
                                <table className='table table-striped table-bordered fixTableHead'>
                                    <thead>
                                        <tr>
                                            <th>Action</th>
                                            <th>Sr.</th>
                                            <th>Name</th>
                                            <th>Packet</th>
                                            <th>Pieces</th>
                                            <th>Return Packet</th>
                                            <th>Return Pieces</th>
                                            <th>Used Packet</th>
                                            <th>Used Pieces</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestModel.crystalTrackingOutDetails?.map((res, index) => {
                                            return <tr>
                                                <td>
                                                    <div onClick={e => deleteCrystalInTrackingList(res.crystalId)}>
                                                        <i className='bi bi-trash text-danger' style={{ cursor: "pointer" }}></i>
                                                    </div>
                                                </td>
                                                <td>{index + 1}</td>
                                                <td>{res.crystalName}</td>
                                                <td>{res.releasePacketQty}</td>
                                                <td>{res.releasePieceQty}</td>
                                                <td>{res.returnPacketQty}</td>
                                                <td>{res.returnPieceQty}</td>
                                                <td>{res.releasePacketQty - res.returnPacketQty}</td>
                                                <td>{res.releasePieceQty - res.returnPieceQty}</td>
                                            </tr>
                                        })}
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
        </>
    )
}
