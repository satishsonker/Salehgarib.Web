import React, { useState, useEffect } from 'react'
import Label from '../common/Label'
import Dropdown from '../common/Dropdown'
import ErrorLabel from '../common/ErrorLabel'
import Inputbox from '../common/Inputbox'
import ButtonBox from '../common/ButtonBox'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common'
import { headerFormat } from '../../utils/tableHeaderFormat'

export default function CrystalTrackingPopup({ selectedOrderDetail,workSheetModel }) {
    const getWorkTypeData=()=>{
        debugger;
        return workSheetModel.workTypeStatus?.find(x=>x.workType?.toLowerCase() === "crystal used")??{};
    }   ;
    const requestModelTemplate = {
        id: 0,
        orderDetailId:workSheetModel?.orderDetailId,
        employeeId: getWorkTypeData()?.completedBy,
        sizeId: 0,
        brandId: 0,
        crystalId: 0,
        crystalName: "",
        releasePacketQty: 0,
        releasePieceQty: 0,
        piecesPerPacket: 0,
        returnPacketQty: 0,
        extraPieces: 0,
        returnPieceQty: 0,
        releaseDate: common.getCurrDate(true),
        crystalTrackingOutDetails: []
    }
    const [requestModel, setRequestModel] = useState(requestModelTemplate);
    const [sizeList, setSizeList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [crystalList, setCrystalList] = useState([]); const [errors, setErrors] = useState({});
    const [filteredCrystalList, setFilteredCrystalList] = useState([]);
    const headers = headerFormat.addCrystalTrackingOut;

    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.dropdownController.employee + "?searchTerm=hot_fixer"));
        apiList.push(Api.Get(apiUrls.crystalController.getAllMasterCrystal + `?pageNo=1&pageSize=1000000`));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + "?masterDataTypes=brand&masterDataTypes=size"));
        Api.MultiCall(apiList)
            .then(res => {
                setCrystalList(res[1].data.data);
                setSizeList(res[2].data.filter(x => x.masterDataTypeCode?.toLowerCase() === "size"));
                setBrandList(res[2].data.filter(x => x.masterDataTypeCode?.toLowerCase() === "brand"));
            });
    }, []);

    const addCrystalInTrackingList = () => {
        var isAlreadyAdded = requestModel.crystalTrackingOutDetails.find(x => x.crystalId === requestModel.crystalId);
        if (isAlreadyAdded !== undefined) {
            toast.warn("This crystal is already added.");
            return;
        }
        if (requestModel.releaseDate === "" || !requestModel.releaseDate) {
            debugger;
            toast.warn("Please select release date.");
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
        model.sizeId = 0;
        model.releasePacketQty = 0;
        model.releasePieceQty = 0;
        model.crystalName = "";
        model.returnDate = common.getHtmlDate(new Date());
        model.returnPacketQty = 0;
        model.returnPieceQty = 0;
        model.extraPieces = 0;
        setFilteredCrystalList([]);
        setRequestModel({ ...requestModel });
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
    const textChange = (e) => {
        var { type, name, value,checked } = e.target;
        var model = requestModel;
        if (type === "select-one" || type === "number") {
            value = parseInt(value);
        }

        if (name === "sizeId") {
            model.crystalId = 0;
            var filteredCryList = crystalList.filter(x => (value === 0 || x.sizeId === value) && (requestModel.brandId === 0 || x.brandId === requestModel.brandId));
            setFilteredCrystalList([...filteredCryList]);
        }
        if (name === "brandId") {
            model.crystalId = 0;
            var filteredCryList = crystalList.filter(x => (value === 0 || x.brandId === value) && (requestModel.sizeId === 0 || x.sizeId === requestModel.sizeId));
            setFilteredCrystalList([...filteredCryList]);
        }
        if (name === "crystalId") {
            var selectedCrystal = crystalList.find(x => x.id === value);
            model.piecesPerPacket = selectedCrystal?.qtyPerPacket ?? 1440;
            model.crystalName = selectedCrystal?.name ?? "";
            model.releasePieceQty = model.releasePacketQty * model.piecesPerPacket;
        }
        if (name === 'loosePieces') {
            model.releasePieceQty = (model.releasePacketQty * model.piecesPerPacket) + value;
        }
        if (name === "releasePacketQty") {
            model.piecesPerPacket = crystalList.find(x => x.id === model.crystalId)?.qtyPerPacket ?? 1440;
            model.releasePieceQty = value * model.piecesPerPacket;
        }
        setRequestModel({ ...model, [name]: value });
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
                    common.closePopup('closePopupCustomerDetails');
                }
                else {
                    toast.warn(toastMessage.saveError);
                }
            })
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

    const isReleasePacketGreaterThanRequired = () => {
        return requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
            return sum += ele.releasePacketQty - ele.returnPacketQty
        }, 0) > (selectedOrderDetail?.crystal ?? 0)
    }
    useEffect(() => {
        if (requestModel.orderDetailId < 1)
            return;
        let apiList=[]
        apiList.push( Api.Get(apiUrls.crytalTrackingController.getTrackingOutByOrderDetailId + requestModel.orderDetailId))
       Api.MultiCall(apiList)
            .then(res => {
                var modal={...requestModel,...res[0].data[0]};
                setRequestModel({ ...modal })
            });
    }, [requestModel.orderDetailId]);

    
    return (
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
                                <Label fontSize='11px' bold={true} text={`Order No : ${workSheetModel?.kandooraNo ?? "Not Selected"}`}></Label>
                            </div>
                            <div className="col-2">
                                <Label fontSize='11px' bold={true} text={`Price : ${common.printDecimal(workSheetModel?.price)}/${common.getGrade(workSheetModel?.price ?? 0)}`}></Label>
                            </div>
                            <div className="col-2">
                                <Label fontSize='11px' bold={true} text={`Packet : ${workSheetModel?.crystal ?? 0}`}></Label>
                            </div>
                            <div className="col-3">
                                <Label fontSize='11px' bold={true} text={`Salesman : ${workSheetModel?.salesman ?? "Not Selected"}`}></Label>
                            </div>
                            <div className="col-3">
                                <Label fontSize='11px' bold={true} text={`Employee : ${getWorkTypeData()?.completedByName ?? "Not Selected"}`}></Label>
                            </div>
                            <hr />
                            <div className="col-4">
                                <Label text="Brand"></Label>
                                <Dropdown className="form-control-sm" data={brandList} onChange={textChange} name="brandId" value={requestModel.brandId} />
                            </div>
                            <div className="col-4">
                                <Label text="Size"></Label>
                                <Dropdown className="form-control-sm" data={sizeList} onChange={textChange} name="sizeId" value={requestModel.sizeId} />
                            </div>
                            <div className="col-4">
                                <Label text="Crystal" isRequired={true}></Label>
                                <Dropdown className="form-control-sm" text="name" data={filteredCrystalList} searchable={true} onChange={textChange} name="crystalId" value={requestModel.crystalId} />
                                <ErrorLabel message={errors?.crystalId} />
                            </div>
                            <div className="col-2">
                                <Inputbox className="form-control-sm" labelText="Issue Packets" type="number" isRequired={true} value={requestModel.releasePacketQty} name="releasePacketQty" errorMessage={errors?.releasePacketQty} onChangeHandler={textChange} />
                            </div>
                            <div className="col-2">
                                <Inputbox className="form-control-sm" labelText="Extra Pieces" disabled={requestModel.releasePacketQty < 1} type="number" value={requestModel.loosePieces} name="loosePieces" errorMessage={errors?.loosePieces} onChangeHandler={textChange} />
                            </div>
                            <div className="col-2">
                                <Inputbox className="form-control-sm" labelText="Issue Pieces" type="number" isRequired={true} value={requestModel.releasePieceQty} name="releasePieceQty" errorMessage={errors?.releasePieceQty} onChangeHandler={textChange} />
                            </div>
                            {/* <div className="col-2">
                                    <Inputbox className="form-control-sm" labelText="Return Packets" min={0} max={requestModel.releasePacketQty} type="number" isRequired={requestModel.returnPieceQty > 0} disabled={true} value={requestModel.returnPacketQty} name="returnPacketQty" errorMessage={errors?.returnPacketQty} onChangeHandler={textChange} />
                                </div> */}
                            <div className="col-2">
                                <Inputbox className="form-control-sm" labelText="Release Date" max={new Date()} type="date" isRequired={requestModel.releasePacketQty > 0} disabled={requestModel.releasePacketQty === 0} value={requestModel?.releaseDate?.indexOf('T') > -1 ? common.getHtmlDate(requestModel.releaseDate) : requestModel.releaseDate} name="releaseDate" errorMessage={errors?.releaseDate} onChangeHandler={textChange} />
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
                                                        <Inputbox disabled={res?.returnPieceQty === 0} type="date" max={common.getHtmlDate(new Date())} showLabel={false} name="releaseDate" value={res["releaseDate"].indexOf('T') > -1 ? common.getHtmlDate(res["releaseDate"]) : res["releaseDate"]} onChangeHandler={e => { textChange(e, index) }} className="form-control-sm" />
                                                    </td>
                                                }
                                                else if (ele.prop === "usedPacket") {
                                                    return <td className='text-center' key={(index * 100) + hIndex}>{res.releasePacketQty ?? 0 - res?.returnPacketQty ?? 0}</td>
                                                }
                                                else if (ele.prop === "usedPieces") {
                                                    return <td className='text-center' key={(index * 100) + hIndex}>{res.releasePieceQty ?? 0 - res?.returnPieceQty ?? 0}</td>
                                                }
                                                else if (ele.prop === "crystalName") {
                                                    return <td className='text-center' key={(index * 100) + hIndex}>{res[ele.prop]}{res.id === 0 || res.id === undefined && <span className='new-badge'>New</span>}</td>
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
                                        <td className={isReleasePacketGreaterThanRequired() ? "bg-danger text-center" : "text-center"} title={isReleasePacketGreaterThanRequired() ? "Release packet is greter than required packet" : ""}>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                            return sum += ele.releasePacketQty ?? 0
                                        }, 0)}</td>
                                        <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                            return sum += ele.releasePieceQty
                                        }, 0)}</td>
                                        {/* <td className="text-center" data-toggle="tooltip" title={isReleasePacketGreaterThanRequired() ? "Release packet is greter than required packet" : ""}>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePacketQty??0 - ele?.returnPacketQty??0
                                            }, 0)}</td> */}
                                        {/* <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePieceQty??0 - ele?.returnPieceQty??0
                                            }, 0)}</td> */}
                                        {/* <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele?.returnPacketQty??0
                                            }, 0)}</td>
                                             <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele?.returnPacketQty??0
                                            }, 0)}</td> */}

                                        {/* <td className='text-center'></td> */}
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
    )
}
