import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
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
        releasePacketQty: 0,
        releasePieceQty: 0,
        piecesPerPacket: 0,
        returnPacketQty: 0,
        returnPieceQty: 0,
        releaseDate: common.getCurrDate(true),
        returnDate: common.getCurrDate(true),
        requestData: []
    }
    const [requestModel, setRequestModel] = useState(requestModelTemplate);
    const [employeeList, setEmployeeList] = useState([]);
    const [crystalList, setCrystalList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [orderDetailNos, setOrderDetailNos] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState({});
    const [errors, setErrors] = useState({});
    const [filteredCrystalList, setFilteredCrystalList] = useState([]);
    const [clearDdlValue, setClearDdlValue] = useState(false);

    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.dropdownController.employee));
        apiList.push(Api.Get(apiUrls.crystalController.getAllMasterCrystal + `?pageNo=1&pageSize=1000000`));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + "?masterDataTypes=brand"));
        apiList.push(Api.Get(apiUrls.dropdownController.orderDetailNos))
        Api.MultiCall(apiList)
            .then(res => {
                setEmployeeList(res[0].data);
                setCrystalList(res[1].data.data);
                setBrandList(res[2].data.filter(x => x.masterDataTypeCode === "brand"));
                setOrderDetailNos(res[3].data);
            });
    }, []);

    const handleSearch = () => {

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
        headers: headerFormat.crystalTrackingOutDetails,
        showTableTop: true,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        showAction: false
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    useEffect(() => {
        Api.Get(apiUrls.crytalTrackingController.getAllTrackingOut + `pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ tableOptionTemplet });
            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (requestModel.orderDetailId < 1)
            return;
        Api.Get(apiUrls.orderController.getOrderDetailById + requestModel.orderDetailId)
            .then(res => {
                setSelectedOrderDetail({ ...res.data });
            });
    }, [requestModel.orderDetailId]);


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
        setRequestModel({ ...model, [name]: value });
    }

    const validateError = () => {
        let errors = {};
        var { employeeId, orderDetailId, releaseDate, crystalId, releasePacketQty } = requestModel;
        if (!employeeId || employeeId === 0) errors.employeeId = validationMessage.employeeRequired;
        if (!crystalId || crystalId === 0) errors.crystalId = validationMessage.crystalRequired;
        if (!releaseDate || releaseDate === '') errors.releaseDate = validationMessage.crystalReleaseDateRequired;
        if (!releasePacketQty || releasePacketQty === 0) errors.releasePacketQty = validationMessage.crystalReleaseQtyRequired;
        if (!orderDetailId || orderDetailId === 0) errors.orderDetailId = validationMessage.kandooraRequired;
        return errors;
    }

    const addCrystalInTrackingList = () => {
        var isAlreadyAdded = requestModel.requestData.find(x => x.crystalId === requestModel.crystalId);
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
        model.requestData.push({
            crystalId: model.crystalId,
            employeeId: model.employeeId,
            orderDetailId: model.orderDetailId,
            releaseDate: model.releaseDate,
            releasePacketQty: model.releasePacketQty,
            releasePieceQty: model.releasePieceQty,
            crystalName: model.crystalName
        });
        model.crystalId = 0;
        model.brandId = 0;
        model.releasePacketQty = 0;
        model.releasePieceQty = 0;
        model.crystalName = "";
        setFilteredCrystalList([]);
        setClearDdlValue(true);
        setRequestModel({ ...requestModel });

    }
    const deleteCrystalInTrackingList = (crystalId) => {
        var modal = requestModel;
        var newRequestData = [];
        modal.requestData.forEach(res => {
            if (res.crystalId !== crystalId) {
                newRequestData.push(res);
            }
        });
        modal.requestData = newRequestData;
        setRequestModel({ ...modal });
    }

    const handleSave=()=>{
      //  ap
    }

    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <TableView option={tableOption} />
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
                                    <Label fontSize='11px' bold={true} text={`Order No : ${selectedOrderDetail?.orderNo?.split('-')[0]}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Price : ${common.printDecimal(selectedOrderDetail?.price)}`}></Label>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='11px' bold={true} text={`Del. Date : ${common.getHtmlDate(selectedOrderDetail?.orderDeliveryDate, "ddmmyyyy")}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Packet : ${selectedOrderDetail?.crystal}`}></Label>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='11px' bold={true} text={`Salesman : ${selectedOrderDetail?.salesman}`}></Label>
                                </div>
                                <div className="col-4">
                                    <Label text="Kandoora No" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={orderDetailNos} searchable={true} onChange={textChange} name="orderDetailId" value={requestModel.orderDetailId} />
                                    <ErrorLabel message={errors?.orderDetailId} />
                                </div>
                                <div className="col-4">
                                    <Label text="Employee" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={employeeList} searchable={true} onChange={textChange} name="employeeId" value={requestModel.employeeId} />
                                    <ErrorLabel message={errors?.employeeId} />
                                </div>
                                <div className="col-4">
                                    <Inputbox className="form-control-sm" labelText="Crystal Issue Date" type="date" isRequired={true} value={requestModel.releaseDate} name="releaseDate" errorMessage={errors?.releaseDate} onChangeHandler={textChange} />
                                </div>
                                <hr />
                                <div className="col-2">
                                    <Label text="Brand"></Label>
                                    <Dropdown clearValue={clearDdlValue} className="form-control-sm" data={brandList} searchable={true} onChange={textChange} name="brandId" value={requestModel.brandId} />
                                </div>
                                <div className="col-5">
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
                                <div className="col-1">
                                    <ButtonBox type="add" onClickHandler={addCrystalInTrackingList} className="btn-sm my-4" />
                                </div>
                                <table className='table table-striped table-bordered fixTableHead'>
                                    <thead>
                                        <tr>
                                            <th>Action</th>
                                            <th>Sr.</th>
                                            <th>Name</th>
                                            <th>Packet</th>
                                            <th>Pieces</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestModel.requestData?.map((res, index) => {
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
