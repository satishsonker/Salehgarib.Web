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

export default function CrystalTrackingPopup({ selectedOrderDetail, workSheetModel, usedCrystalData }) {
    const getWorkTypeData = () => {
        return workSheetModel.workTypeStatus?.find(x => x.workType?.toLowerCase() === "crystal used") ?? {};
    };
    const requestModelTemplate = {
        id: 0,
        orderDetailId: workSheetModel?.orderDetailId,
        employeeId: getWorkTypeData()?.completedBy,
        sizeId: 0,
        brandId: 0,
        crystalId: 0,
        crystalName: "",
        releasePacketQty: 0,
        releasePieceQty: 0,
        piecesPerPacket: 0,
        extraPieces: 0,
        totalPieces: 0,
        isArtical: false,
        articalLabourCharge: 0,
        crystalLabourCharge: 0,
        isAlterWork: 0,
        releaseDate: getWorkTypeData()?.completedOn,
        crystalTrackingOutDetails: [],
        note: ''
    }
    const [requestModel, setRequestModel] = useState({ ...requestModelTemplate, ...usedCrystalData[0] });
    const [sizeList, setSizeList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [crystalList, setCrystalList] = useState([]); const [errors, setErrors] = useState({});
    const [filteredCrystalList, setFilteredCrystalList] = useState([]);
    const [refreshData, setRefreshData] = useState(0);
    const headers = headerFormat.addCrystalTrackingOut;

    useEffect(() => {
        requestModelTemplate.employeeId = getWorkTypeData()?.completedBy;
        setRequestModel({ ...requestModelTemplate });
    }, [getWorkTypeData()?.completedBy])

    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.crystalController.getAllMasterCrystal + `?pageNo=1&pageSize=1000000`));
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + "?masterDataTypes=brand&masterDataTypes=size"));
        Api.MultiCall(apiList)
            .then(res => {
                setCrystalList([...res[0].data.data]);
                setFilteredCrystalList([...res[0].data.data]);
                setSizeList(res[1].data.filter(x => x.masterDataTypeCode?.toLowerCase() === "size"));
                setBrandList(res[1].data.filter(x => x.masterDataTypeCode?.toLowerCase() === "brand"));
            });
    }, []);

    useEffect(() => {
        var defaultSelectedBrandId = brandList.find(x => x.value?.toLowerCase() === "st")?.id ?? 0;
        var defaultSelectedSizeId = sizeList.find(x => x.value?.toLowerCase() === "ss-6")?.id ?? 0;
        var filteredCryList = crystalList.filter(x => (defaultSelectedBrandId === 0 || x.brandId === defaultSelectedBrandId) && (defaultSelectedSizeId === 0 || x.sizeId === defaultSelectedSizeId));
        if (filteredCryList?.length > 0) {
            setFilteredCrystalList([...filteredCryList]);
        }
        var model = requestModel;
        model.brandId = defaultSelectedBrandId;
        model.sizeId = defaultSelectedSizeId;
        setRequestModel({ ...model });
    }, [crystalList])


    const addCrystalInTrackingList = () => {
        var isAlreadyAdded = requestModel.crystalTrackingOutDetails.find(x => x.crystalId === requestModel.crystalId);
        if (isAlreadyAdded !== undefined) {
            toast.warn("This crystal is already added.");
            return;
        }
        if (requestModel.releaseDate === "" || !requestModel.releaseDate) {
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
            loosePieces: model.loosePieces,
            totalPieces: model.totalPieces,
            returnDate: model.returnDate,
            crystalName: model.crystalName,
            articalLabourCharge: model.articalLabourCharge,
            crystalLabourCharge: model.crystalLabourCharge,
            isAlterWork: model?.isAlterWork === 1
        });
        model.crystalId = "";
        model.brandId = "";
        model.sizeId = "";

        model.releasePacketQty = 0;
        model.releasePieceQty = 0;
        model.crystalName = "";
        model.loosePieces = 0;
        model.articalLabourCharge = 0;
        model.crystalLabourCharge = 0;
        model.isAlterWork = 0;
        model.totalPieces = 0;
        setFilteredCrystalList([]);
        setRequestModel({ ...model });
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
        var { type, name, value } = e.target;
        var model = requestModel;
        var filteredCryList;
        if (type === "select-one" || type === "number") {
            if (name === 'releasePacketQty') {
                value = parseFloat(value);
            }
            else
                value = parseInt(value);
            value = isNaN(value) ? 0 : value;
        }

        if (name === "sizeId") {
            model.crystalId = 0;
            filteredCryList = crystalList.filter(x => (value === 0 || x.sizeId === value) && (requestModel.brandId === 0 || x.brandId === requestModel.brandId));
            setFilteredCrystalList([...filteredCryList]);
        }
        if (name === "brandId") {
            model.crystalId = 0;
            filteredCryList = crystalList.filter(x => (value === 0 || x.brandId === value) && (requestModel.sizeId === 0 || x.sizeId === requestModel.sizeId));
            setFilteredCrystalList([...filteredCryList]);
        }
        if (name === "crystalId") {
            var selectedCrystal = crystalList.find(x => x.id === value);
            model.piecesPerPacket = selectedCrystal?.qtyPerPacket ?? 1440;
            model.crystalName = selectedCrystal?.name ?? "";
            model.isArtical = selectedCrystal?.isArtical;
          //  model.brandId = selectedCrystal?.brand;
           // model.sizeId = selectedCrystal?.sizeId;
        }
        if (name === 'loosePieces') {
            // model.loosePieces = parseInt(model.releasePacketQty * model.piecesPerPacket) + value;
            model.totalPieces = parseInt(model.releasePieceQty) + common.defaultIfEmpty(value, 0);
            model = calculateLabourCharge(model);
            model.releasePacketQty = model.totalPieces / model.piecesPerPacket;
        }
        if (name === 'totalPieces') {
            model.releasePacketQty = (common.defaultIfEmpty(model?.loosePieces, 0) + common.defaultIfEmpty(value, 0)) / common.defaultIfEmpty(model.piecesPerPacket, 1440);
            model.releasePieceQty = value;
            model.totalPieces = common.defaultIfEmpty(model?.loosePieces, 0) + model.releasePieceQty;
            model = calculateLabourCharge(model);
        }
        if (name === "releasePacketQty") {
            model.releasePieceQty = value * model.piecesPerPacket;
            model.totalPieces = parseInt(value * model.piecesPerPacket) + common.defaultIfEmpty(model.loosePieces, 0);
            model = calculateLabourCharge(model);
        }
        setRequestModel({ ...model, [name]: value });
    }
    const calculateLabourCharge = (model) => {
        if (model.isArtical) {
            model.articalLabourCharge = (model.totalPieces / 200) * 5;
        }
        else
            model.crystalLabourCharge = ((model.totalPieces / model.piecesPerPacket) * 17);
        return model;
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
                    setRefreshData(pre => pre + 1)
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
            return sum += ele.releasePacketQty
        }, 0) > (workSheetModel?.crystal ?? 0)
    }
    useEffect(() => {
        var modal = { ...requestModel, ...usedCrystalData[0] };
        setRequestModel({ ...modal })
    }, [usedCrystalData[0], refreshData]);

    const addCrystalNote = () => {
        Api.Post(apiUrls.crytalTrackingController.addTrackingOutNote, requestModel)
            .then(res => {
                if (res.data > 0)
                    toast.success(toastMessage.saveSuccess);
                else
                    toast.warning(toastMessage.saveError);
            })
    }
    const resetModel=()=>{
        setRequestModel({...requestModelTemplate});
    }
    return (
        <div id="add-crysal-tracking" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
            aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Crystal Tracking Details</h5>
                        <button type="button" onClick={e=>resetModel()} className="btn-close" id='closePopupCustomerDetails' data-bs-dismiss="modal" aria-hidden="true"></button>
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
                                <Label text="Crystal" isRequired={true}></Label>
                                <Dropdown className="form-control-sm" text="name" ddlListHeight="250px" data={filteredCrystalList} searchable={true} onChange={textChange} name="crystalId" value={requestModel.crystalId} />
                                <ErrorLabel message={errors?.crystalId} />
                            </div>
                            <div className="col-2">
                                <Label text="Brand"></Label>
                                <Dropdown className="form-control-sm" data={brandList} searchable={true} onChange={textChange} name="brandId" value={requestModel?.brandId} />
                            </div>
                            <div className="col-2">
                                <Label text="Size"></Label>
                                <Dropdown className="form-control-sm" data={sizeList} searchable={true} onChange={textChange} name="sizeId" value={requestModel.sizeId} />
                                {/* <Inputbox labelText="Size" className="form-control-sm" name="sizeId" value={requestModel.sizeId} /> */}
                            </div>
                            <div className={requestModel.id > 0 ? "col-3" : "col-4"}>
                                <Inputbox labelText="Note" className="form-control-sm" name="note" value={requestModel.note} onChangeHandler={textChange} />
                            </div>
                            {requestModel.id > 0 && <div className="col-1">
                                <ButtonBox type="save" style={{ marginTop: '21px', marginLeft: '-16px' }} onClickHandler={addCrystalNote} className="btn-sm" />
                            </div>
                            }
                            <div className="col-2">
                                <Inputbox className="form-control-sm" labelText="Released Pieces" type="number" value={requestModel.totalPieces} name="totalPieces" errorMessage={errors?.totalPieces} onChangeHandler={textChange} />
                            </div>
                            {/* <div className="col-2">
                                <Inputbox className="form-control-sm" labelText="Extra Pieces" type="number" value={requestModel.loosePieces} name="loosePieces" errorMessage={errors?.loosePieces} onChangeHandler={textChange} />
                            </div> */}
                            <div className="col-2">
                                <Inputbox className="form-control-sm" disabled={true} labelText="Used Packets" type="number" isRequired={true} value={common.printDecimal(requestModel.releasePacketQty)} name="releasePacketQty" errorMessage={errors?.releasePacketQty} onChangeHandler={textChange} />
                            </div>
                            {!requestModel.isArtical && <div className="col-2">
                                <Inputbox className="form-control-sm" labelText="Crystal Labour Charge" type="number" isRequired={true} value={common.printDecimal(requestModel.crystalLabourCharge)} name="crystalLabourCharge" errorMessage={errors?.crystalLabourCharge} onChangeHandler={textChange} />
                            </div>}
                            {requestModel.isArtical && <div className="col-2">
                                <Inputbox className="form-control-sm" labelText="Artical Labour Charge" type="number" isRequired={true} value={common.printDecimal(requestModel.articalLabourCharge)} name="articalLabourCharge" errorMessage={errors?.articalLabourCharge} onChangeHandler={textChange} />
                            </div>}
                            {/* <div className="col-2">
                                <Inputbox className="form-control-sm" labelText="Release Date" max={new Date()} type="date" isRequired={requestModel.releasePacketQty > 0} disabled={requestModel.releasePacketQty === 0} value={requestModel?.releaseDate?.indexOf('T') > -1 ? common.getHtmlDate(requestModel.releaseDate) : requestModel.releaseDate} name="releaseDate" errorMessage={errors?.releaseDate} onChangeHandler={textChange} />
                            </div> */}
                            <div className="col-2">
                                <Label text="Work Nature" isRequired={true}></Label>
                                <Dropdown data={[{ id: 0, value: "Normal Work" }, { id: 1, value: 'Alter Work' }]} className="form-control-sm" value={requestModel.isAlterWork} displayDefaultText={false} name="isAlterWork" errorMessage={errors?.isAlterWork} onChange={textChange} />
                            </div>
                            <div className="col-1">
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
                                                else if (ele.prop === "crystalName") {
                                                    return <td className='text-center' key={(index * 100) + hIndex}>{res[ele.prop]}{(res.id === 0 || res.id === undefined) && <span className='new-badge'>New</span>}</td>
                                                }
                                                else if (ele.name === "Labour Charge") {
                                                    return <td className='text-center' key={(index * 100) + hIndex}>{common.printDecimal(ele?.customColumn(res))}</td>
                                                }
                                                else {
                                                    if (ele.customColumn !== undefined)
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{ele?.customColumn(res)}</td>
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
                                        <td className={isReleasePacketGreaterThanRequired() ? "bg-danger text-center" : "text-center"} title={isReleasePacketGreaterThanRequired() ? "Release packet is greter than required packet" : ""}>{common.printDecimal(requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                            return sum += ele.releasePacketQty
                                        }, 0))}</td>
                                        <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                            return sum += common.defaultIfEmpty(ele.releasePieceQty, 0)
                                        }, 0)}</td>
                                        <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                            return sum += common.defaultIfEmpty(ele.loosePieces, 0)
                                        }, 0)}</td>
                                        <td className='text-center'>{requestModel.crystalTrackingOutDetails?.reduce((sum, data) => {
                                            return sum += data?.releasePieceQty + common.defaultIfEmpty(data?.loosePieces, 0)
                                        }, 0)}</td>
                                        <td className='text-center'>{common.printDecimal(requestModel.crystalTrackingOutDetails?.reduce((sum, data) => {
                                            return sum += common.defaultIfEmpty(data?.crystalLabourCharge, 0) > 0 ? common.defaultIfEmpty(data?.crystalLabourCharge, 0) : common.defaultIfEmpty(data?.articalLabourCharge, 0)
                                        }, 0))}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <ButtonBox type="save" onClickHandler={handleSave} className="btn-sm" />
                        <ButtonBox type="cancel" onClickHandler={resetModel} className="btn-sm" modelDismiss={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}
