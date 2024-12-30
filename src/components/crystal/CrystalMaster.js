import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import RegexFormat from '../../utils/RegexFormat';
import Breadcrumb from '../common/Breadcrumb';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';
import Dropdown from '../common/Dropdown';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';
import { headerFormat } from '../../utils/tableHeaderFormat';

export default function CrystalMaster() {
    const crystalTemplate = {
        id: 0,
        name: '',
        brandId: 0,
        sizeId: 0,
        shapeId: 0,
        crystalId: 0,
        alertQty: 50,
        qtyPerPacket: 1440,
        pricePerPacket: 100,
        barcode: '',
        isArtical: false
    }
    const [crystalModel, setCrystalModel] = useState(crystalTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const [masterData, setMasterData] = useState([]);
    const [crystalId, setCrystalId] = useState(0);
    const masterDataCode = {
        brand: 'brand',
        size: 'size',
        shape: 'shape',
        piecePerPacket: 'crystal_packet'
    }
    const handleDelete = (id) => {
        Api.Delete(apiUrls.crystalController.deleteMasterCrystal + id).then(res => {
            if (res.data > 0) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.crystalController.searchMasterCrystal + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }

    const handleTextChange = (e) => {
        var { value, type, name, checked } = e.target;
        var data = crystalModel;
        if (type === "checkbox") {
            data[name] = checked;
        }
        else if (type === 'select-one') {
            data[name] = parseInt(value);
        }
        else if (name === 'alertQty') {
            data.alertQty = parseInt(value);
        }
        else if (name === 'pricePerPacket') {
            data.pricePerPacket = parseFloat(value);
        }
        else {
            data[name] = value.toUpperCase();
            data.code = value.toLowerCase().trim().replaceAll(RegexFormat.specialCharectors, "_").replaceAll(RegexFormat.endWithHyphen, '');
        }
        setCrystalModel({ ...data });

        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null })
        }
    }
    const handleSave = (e, isFormClose) => {
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }

        let data = common.assignDefaultValue(crystalTemplate, crystalModel);
        if (isRecordSaving) {
            data.crystalId = crystalId;
            Api.Put(apiUrls.crystalController.addMasterCrystal, data).then(res => {
                if (res.data.id > 0) {
                    if (isFormClose) {
                        common.closePopup('add-crystal');
                    }
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                    Api.Get(apiUrls.crystalController.getNextCrytalId)
                        .then(res => {
                            setCrystalId(res.data);
                        });
                    handleResetForm();
                    setIsRecordSaving(true);
                }
            })
        }
        else {
            Api.Post(apiUrls.crystalController.updateMasterCrystal, crystalModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-crystal');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                    setIsRecordSaving(true);
                }
            })
        }
    }
    const handleEdit = (crystalId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.crystalController.getMasterCrystal + crystalId).then(res => {
            if (res.data.id > 0) {
                setCrystalModel(res.data);
                //setCrystalId(res.data.crystalId);
            }
        })
    };

    const tableOptionTemplet = {
        headers: headerFormat.masterCrystal,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-crystal",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {
        handleResetForm();
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Crystal Master',
        items: [
            {
                title: "Crystal Master",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "New Crystal",
                icon: 'bx bx-plus',
                modelId: 'add-crystal',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.crystalController.getAllMasterCrystal + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [pageNo, pageSize]);

    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + `?masterDataTypes=${masterDataCode.brand}&masterDataTypes=${masterDataCode.shape}&masterDataTypes=${masterDataCode.size}&masterDataTypes=${masterDataCode.piecePerPacket}`));
        apiList.push(Api.Get(apiUrls.crystalController.getNextCrytalId));
        Api.MultiCall(apiList).then(res => {
            setMasterData(res[0].data);
            setCrystalModel({ ...crystalModel, "crystalId": res[1].data });
            setCrystalId(res[1].data);
        });
    }, []);


    useEffect(() => {
        if (isRecordSaving) {
            setCrystalModel({ ...crystalTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const { name, sizeId, shapeId, brandId, alertQty, qtyPerPacket,pricePerPacket } = crystalModel;
        const newError = {};
        if (!name || name === "") newError.name = validationMessage.crystalNameRequired;
        if (!sizeId || sizeId === 0 || sizeId === "") newError.sizeId = validationMessage.crystalSizeRequired;
        if (!shapeId || shapeId === 0 || shapeId === "") newError.shapeId = validationMessage.crystalShapeRequired;
        if (!pricePerPacket || pricePerPacket === 0 || pricePerPacket === "") newError.pricePerPacket = validationMessage.crystalPricePerPacketRequired;
        if (!brandId || brandId === 0 || brandId === "") newError.brandId = validationMessage.crystalBrandRequired;
        if (!alertQty || alertQty === 0 || alertQty === "") newError.alertQty = validationMessage.crystalAlertQtyRequired;
        if (!qtyPerPacket || qtyPerPacket === 0 || qtyPerPacket === "") newError.qtyPerPacket = validationMessage.crystalQtyPerPacketRequired;
        return newError;
    }

    const handleResetForm = () => {

        crystalTemplate.crystalId = crystalId;
        // crystalTemplate.alertQty = 50;
        // crystalTemplate.barcode = "";
        // crystalTemplate.brandId = 0;
        // crystalTemplate.sizeId = 0;
        // crystalTemplate.shapeId = 0;
        // crystalTemplate.qtyPerPacket = 1440;
        setCrystalModel({ ...crystalTemplate });
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Crystal Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-crystal" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Crystal</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-md-9">
                                                <Inputbox className="form-control-sm" name="crystalId" disabled={true} value={crystalModel.crystalId} labelText="Crystal Id" />
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-check" style={{marginTop:'25px'}}>
                                                    <input name="isArtical" onClick={e => handleTextChange(e)} className="form-check-input" type="checkbox" checked={crystalModel?.isArtical} value={crystalModel?.isArtical} id="flexCheckDefault" />
                                                    <label className="form-check-label" for="flexCheckDefault">
                                                        Is Artical
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-9">
                                                <Inputbox name="name" className="form-control-sm" isRequired={true} value={crystalModel?.name} onChangeHandler={handleTextChange} labelText="Crystal Name" errorMessage={errors?.name} />
                                            </div>
                                            <div className="col-3">
                                                <Label text="Brand" isRequired={true}></Label>
                                                <Dropdown onChange={handleTextChange} data={masterData?.filter(x => x.masterDataTypeCode.toLowerCase() === masterDataCode.brand)} name="brandId" value={crystalModel.brandId} className="form-control-sm" />
                                                <ErrorLabel message={errors?.brandId}></ErrorLabel>
                                            </div>


                                            <div className="col-6">
                                                <Label text="Shape" isRequired={true}></Label>
                                                <Dropdown onChange={handleTextChange} data={masterData?.filter(x => x.masterDataTypeCode.toLowerCase() === masterDataCode.shape)} name="shapeId" value={crystalModel.shapeId} className="form-control-sm" />
                                                <ErrorLabel message={errors?.shapeId}></ErrorLabel>
                                            </div>
                                            <div className="col-6">
                                                <Label text="Size" isRequired={true}></Label>
                                                <Dropdown onChange={handleTextChange} data={masterData?.filter(x => x.masterDataTypeCode.toLowerCase() === masterDataCode.size)} name="sizeId" value={crystalModel.sizeId} className="form-control-sm" />
                                                <ErrorLabel message={errors?.sizeId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-4">
                                                <Inputbox type="number" name="alertQty" className="form-control-sm" isRequired={true} value={crystalModel.alertQty} onChangeHandler={handleTextChange} labelText="Alert Qty" errorMessage={errors?.alertQty} />
                                            </div>
                                            <div className="col-md-4">
                                                <Inputbox type="number" name="pricePerPacket" className="form-control-sm" isRequired={true} value={crystalModel.pricePerPacket} onChangeHandler={handleTextChange} min={1} labelText="Per Packet Price" errorMessage={errors?.pricePerPacket} />
                                            </div>
                                            <div className="col-md-4">
                                                <Label text="Peices/Packet" isRequired={true}></Label>
                                                <Dropdown onChange={handleTextChange} elementKey="value" data={masterData?.filter(x => x.masterDataTypeCode.toLowerCase() === masterDataCode.piecePerPacket)} name="qtyPerPacket" value={crystalModel.qtyPerPacket} className="form-control-sm" />
                                                <ErrorLabel message={errors?.qtyPerPacket}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox name="barcode" className="form-control-sm" value={crystalModel.barcode} onChangeHandler={handleTextChange} labelText="Barcode" />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? "save" : "update"} text={isRecordSaving ? "Save" : "Update"} onClickHandler={handleSave} onClickHandlerData={true} className="btn-sm" />
                            {isRecordSaving && <ButtonBox type="save" text="Save & Next" onClickHandler={handleSave} onClickHandlerData={false} className="btn-sm" />}
                            <ButtonBox type="reset" onClickHandler={handleResetForm} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>

    )
}
