import React, { useState, useEffect } from 'react'
import { toastMessage } from '../../../constants/ConstantValues';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toast } from 'react-toastify';
import Breadcrumb from '../../common/Breadcrumb';
import Inputbox from '../../common/Inputbox';
import { validationMessage } from '../../../constants/validationMessage';
import TableView from '../../tables/TableView';
import ButtonBox from '../../common/ButtonBox';
import { common } from '../../../utils/common';
import Dropdown from '../../common/Dropdown';
import ErrorLabel from '../../common/ErrorLabel';
import Label from '../../common/Label';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import ImageUploadWithPreview from '../../common/ImageUploadWithPreview';

export default function FabricDetails() {
    const fabricModelTemplate = {
        id: 0,
        brandId: 0,
        fabricColorId: 0,
        fabricPrintTypeId: 0,
        fabricCode: "",
        fabricSizeId: 0,
        fabricTypeId: 0,
        lowAlertQty: 0
    }
    const [fabricModel, setFabricModel] = useState(fabricModelTemplate);
    const [fabricTypeList, setFabricTypeList] = useState([])
    const [fabricImagePath, setFabricImagePath] = useState("");
    const [fabricColorList, setFabricColorList] = useState([]);
    const [fabricPrintTypeList, setFabricPrintTypeList] = useState([])
    const [fabricBrandList, setFabricBrandList] = useState([])
    const [fabricSizeList, setFabricSizeList] = useState([])
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.fabricMasterController.fabric.deleteFabric + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.fabricMasterController.fabric.searchFabric + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }

    const handleTextChange = (e) => {
        var { value, name, type } = e.target;
        var data = fabricModel;
        if (type === 'select-one' || type === "number") {
            data[name] = parseInt(value);
        }
        else {
            data[name] = value.toUpperCase();
        }
        setFabricModel({ ...data });

        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null })
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        else {
            setErrors({});
        }

        let data = common.assignDefaultValue(fabricModelTemplate, fabricModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.fabricMasterController.fabric.addFabric, data).then(res => {
                if (res.data.id > 0) {
                    //common.closePopup('closeFabric');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                    var model = fabricModel;
                    model.id = res.data.id;
                    setFabricModel({ ...model });
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.fabricMasterController.fabric.updateFabric, fabricModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closeFabric');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (fabricId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.fabricMasterController.fabric.getFabric + fabricId).then(res => {
            if (res.data.id > 0) {
                setFabricModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: headerFormat.fabricDetails,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-fabric",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setFabricModel({ ...fabricModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Fabric',
        items: [
            {
                title: "Fabric'",
                icon: "bi bi-broadcast-pin",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Add New Fabric",
                icon: 'bx bx-plus',
                modelId: 'add-fabric',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.fabricMasterController.fabric.getAllFabric + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setFabricModel({ ...fabricModelTemplate });
        }
    }, [isRecordSaving])

    const validateError = () => {
        const { brandId, fabricCode, fabricSizeId, fabricColorId, lowAlertQty, fabricTypeId, fabricPrintTypeId } = fabricModel;
        const newError = {};
        if (!fabricCode || fabricCode === "") newError.fabricCode = validationMessage.fabricCodeNameRequired;
        if (!lowAlertQty || lowAlertQty < 1) newError.lowAlertQty = validationMessage.fabricStockAlertQtyRequired;
        if (!brandId || brandId === 0) newError.brandId = validationMessage.fabricBrandNameRequired;
        if (!fabricTypeId || fabricTypeId === 0) newError.fabricTypeId = validationMessage.fabricTypeNameRequired;
        if (!fabricPrintTypeId || fabricPrintTypeId === 0) newError.fabricPrintTypeId = validationMessage.fabricPrintTypeNameRequired;
        if (!fabricSizeId || fabricSizeId === 0) newError.fabricSizeId = validationMessage.fabricSizeRequired;
        if (!fabricColorId || fabricColorId === 0) newError.fabricColorId = validationMessage.fabricCodeNameRequired;
        return newError;
    }

    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.fabricMasterController.brand.getAllBrand + "?pageNo=1&pageSize=10000000"))
        apiList.push(Api.Get(apiUrls.fabricMasterController.size.getAllSize + "?pageNo=1&pageSize=10000000"))
        apiList.push(Api.Get(apiUrls.fabricMasterController.type.getAllType + "?pageNo=1&pageSize=10000000"))
        apiList.push(Api.Get(apiUrls.fabricMasterController.color.getAllColor + "?pageNo=1&pageSize=10000000"))
        apiList.push(Api.Get(apiUrls.fabricMasterController.printType.addPrintType + "?pageNo=1&pageSize=10000000"))
        Api.MultiCall(apiList)
            .then(res => {
                setFabricBrandList([...res[0].data.data]);
                setFabricSizeList([...res[1].data.data]);
                setFabricTypeList([...res[2].data.data]);
                setFabricColorList([...res[3].data.data]);
                setFabricPrintTypeList([...res[4].data.data]);
            });
    }, []);

    useEffect(() => {
        if (fabricImagePath !== null && fabricImagePath !== "") {
            Api.Post(`${apiUrls.fabricMasterController.fabric.updateFabricImagePath}${fabricModel.id}?path=${fabricImagePath}`, {})
                .then(res => {
                    if (res.data === true) {
                        toast.success(toastMessage.successImageUploaded);
                        common.closePopup('closeFabric');
                    }
                    else
                        toast.warn(toastMessage.errorImageUploaded);
                })
        }
    }, [fabricImagePath])


    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Fabric Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-fabric" className="modal fade in" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Fabric</h5>
                            <button type="button" className="btn-close" id='closeFabric' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-6">
                                                <Label text="Fabric Brand" isRequired={true} fontSize='12px' />
                                                <Dropdown data={fabricBrandList} text="name" isRequired={true} onChange={handleTextChange} name="brandId" value={fabricModel.brandId} className="form-control-sm" />
                                                <ErrorLabel message={errors?.brandId} />
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Fabric Size" isRequired={true} fontSize='12px' />
                                                <Dropdown data={fabricSizeList} text="name" isRequired={true} onChange={handleTextChange} name="fabricSizeId" value={fabricModel.fabricSizeId} className="form-control-sm" />
                                                <ErrorLabel message={errors?.fabricSizeId} />
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Fabric Type" isRequired={true} fontSize='12px' />
                                                <Dropdown data={fabricTypeList} text="name" isRequired={true} onChange={handleTextChange} name="fabricTypeId" value={fabricModel.fabricTypeId} className="form-control-sm" />
                                                <ErrorLabel message={errors?.fabricTypeId} />
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Fabric Color" isRequired={true} fontSize='12px' />
                                                <Dropdown data={fabricColorList} text="colorName" isRequired={true} onChange={handleTextChange} name="fabricColorId" value={fabricModel.fabricColorId} className="form-control-sm" />
                                                <ErrorLabel message={errors?.fabricColorId} />
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Fabric Print Type" isRequired={true} fontSize='12px' />
                                                <Dropdown data={fabricPrintTypeList} text="name" isRequired={true} onChange={handleTextChange} name="fabricPrintTypeId" value={fabricModel.fabricPrintTypeId} className="form-control-sm" />
                                                <ErrorLabel message={errors?.fabricPrintTypeId} />
                                            </div>
                                            <div className="col-md-6">
                                                <Inputbox type="text" labelText="Fabric Code" isRequired={true} onChangeHandler={handleTextChange} name="fabricCode" value={fabricModel.fabricCode} className="form-control-sm" errorMessage={errors?.fabricCode} />
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox type="number" labelText="Low Stock Alert Qty" isRequired={true} onChangeHandler={handleTextChange} name="lowAlertQty" value={fabricModel.lowAlertQty} className="form-control-sm" errorMessage={errors?.lowAlertQty} />
                                            </div>
                                            {fabricModel.id > 0 && <div className="col-md-12">
                                                <ImageUploadWithPreview moduleNameId={2} moduleId={fabricModel.id} remark={`Fabric Code:${fabricModel.fabricCode}`} setImagePath={setFabricImagePath}></ImageUploadWithPreview>
                                            </div>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? 'Save' : 'Update'} text={isRecordSaving ? 'Save' : 'Update'} onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} modalId="closePopup" className="btn-sm" />
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
