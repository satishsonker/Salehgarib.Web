import React, { useState, useEffect, lazy, Suspense } from 'react';
import { toast } from 'react-toastify';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toastMessage } from '../../../constants/ConstantValues';
import { common } from '../../../utils/common';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import { validationMessage } from '../../../constants/validationMessage';
import Loader from '../../common/Loader';
import AssignFabricSellMode from './AssignFabricSellMode';
import { useNavigate } from 'react-router-dom';

const Inputbox = lazy(() => import('../../common/Inputbox'));
const ButtonBox = lazy(() => import('../../common/ButtonBox'));
const Breadcrumb = lazy(() => import('../../common/Breadcrumb'));
const TableView = lazy(() => import('../../tables/TableView'));

export default function FabricSaleModeDetail() {
    let navigate = useNavigate();
    const fabricSellModeModelTemplate = {
        id: 0,
        name: '',
        shortName: '',
        code: '',
        minSaleAmount: 0,
        maxSaleAmount: 0,
        title: ''
    };
    const [fabricSellModeModel, setFabricSaleModeModel] = useState(fabricSellModeModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const [isAssignSaleModeOpen, setIsAssignSaleModeOpen] = useState(false)

    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3) return;
        Api.Get(`${apiUrls.fabricMasterController.saleMode.searchSaleMode}?PageNo=${pageNo}&pageSize=${pageSize}&SearchTerm=${searchTerm}`)
            .then(res => {
                setTableOption(prev => ({ 
                    ...prev, 
                    data: res.data.data, 
                    totalRecords: res.data.totalRecords 
                }));
            }).catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        Api.Delete(`${apiUrls.fabricMasterController.saleMode.deleteSaleMode}${id}`).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    };

    const handleEdit = (saleModeId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(`${apiUrls.fabricMasterController.saleMode.getSaleMode}${saleModeId}`).then(res => {
            if (res.data.id > 0) {
                setFabricSaleModeModel(res.data);
            }
        });
    };

    const [tableOption, setTableOption] = useState({
        headers: headerFormat.fabricSaleMode,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setpageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-fabricSaleMode",
            delete: { handler: handleDelete },
            edit: { handler: handleEdit }
        }
    });

   

    const handleTextChange = (e) => {
        const { value, name, type } = e.target;
        const data = { ...fabricSellModeModel, [name]: type === 'number' ? parseFloat(value) : value.toUpperCase() };
        if (name === 'name' && isRecordSaving) {
            data.code = common.generateMasterDataCode(value.trim());
        }
        setFabricSaleModeModel(data);
        if (errors?.[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return;
        }
        const data = common.assignDefaultValue(fabricSellModeModelTemplate, fabricSellModeModel);
        const apiAction = isRecordSaving ? Api.Put(apiUrls.fabricMasterController.saleMode.addSaleMode, data) : Api.Post(apiUrls.fabricMasterController.saleMode.updateSaleMode, fabricSellModeModel);
        apiAction.then(res => {
            if (res.data.id > 0) {
                common.closePopup('closeFabricSaleMode');
                toast.success(isRecordSaving ? toastMessage.saveSuccess : toastMessage.updateSuccess);
                handleSearch('');
            }
        }).catch(err => toast.error(isRecordSaving ? toastMessage.saveError : toastMessage.updateError));
    };

    

    const saveButtonHandler = () => {
        setFabricSaleModeModel({ ...fabricSellModeModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
    };

    const breadcrumbOption = {
        title: 'Fabric Sell Mode',
        items: [{ title: "Fabric Sell Mode", icon: "bi bi-broadcast-pin", isActive: false }],
        buttons: [
            { text: "Assign Sell Mode", icon: 'bx bx-plus', handler: ()=>{navigate('/fabric/assign/sellMode')} },
            { text: "Fabric Sell Mode", icon: 'bx bx-plus', modelId: 'add-fabricSaleMode', handler: saveButtonHandler }
        ]
    };

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(`${apiUrls.fabricMasterController.saleMode.getAllSaleMode}?PageNo=${pageNo}&pageSize=${pageSize}`).then(res => {
            setTableOption(prev => ({ 
                ...prev, 
                data: res.data.data, 
                totalRecords: res.data.totalRecords 
            }));
        });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setFabricSaleModeModel({ ...fabricSellModeModelTemplate });
        }
    }, [isRecordSaving]);

    const validateError = () => {
        const { name, code, minSaleAmount,maxSaleAmount,shortName } = fabricSellModeModel;
        const newError = {};
        if (!name) newError.name = validationMessage.fabricSaleModeNameRequired;
        if (!code) newError.code = validationMessage.fabricSaleModeCodeRequired;
        if (!shortName ||  shortName==='') newError.shortName = validationMessage.fabricSaleShortNameRequired;
        if (shortName?.length!==3) newError.shortName = validationMessage.fabricSaleShortNameOnly3CharRequired;
        if (!minSaleAmount) newError.minSaleAmount = validationMessage.fabricSaleModeMinSaleAmountRequired;
        if(maxSaleAmount<minSaleAmount) newError.maxSaleAmount=validationMessage.fabricSaleModeMaxSaleAmountNotLessThanMinRequired;
        return newError;
    };

    return (
        <Suspense fallback={<Loader />}>
            <Breadcrumb option={breadcrumbOption} />
            <h6 className="mb-0 text-uppercase">Fabric Sell Mode Details</h6>
            <hr />
            <TableView option={tableOption} />

            <div id="add-fabricSaleMode" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Fabric Sell Mode</h5>
                            <button type="button" className="btn-close" id='closeFabricSaleMode' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row g-3">
                                <Inputbox type="text" labelText="Sell Mode" isRequired={true} onChangeHandler={handleTextChange} name="name" value={fabricSellModeModel.name} className="form-control-sm" errorMessage={errors?.name} /> 
                                <Inputbox type="text" labelText="Short Name" isRequired={true} onChangeHandler={handleTextChange} name="shortName" value={fabricSellModeModel.shortName} className="form-control-sm" errorMessage={errors?.shortName} />
                                <Inputbox type="text" labelText="Sell Mode Code" disabled={true} isRequired={true} onChangeHandler={handleTextChange} name="code" value={fabricSellModeModel.code} className="form-control-sm" errorMessage={errors?.code} />
                                <Inputbox type="number" min={0.0} labelText="Min Sell Amount" max={fabricSellModeModel.maxSaleAmount} isRequired={true} onChangeHandler={handleTextChange} name="minSaleAmount" value={fabricSellModeModel.minSaleAmount} className="form-control-sm" errorMessage={errors?.minSaleAmount} />
                                <Inputbox type="number" min={fabricSellModeModel.minSaleAmount} labelText="Max Sell Amount" onChangeHandler={handleTextChange} name="maxSaleAmount" value={fabricSellModeModel.maxSaleAmount} className="form-control-sm" errorMessage={errors?.maxSaleAmount} />
                                <Inputbox type="text" labelText="Title" onChangeHandler={handleTextChange} name="title" value={fabricSellModeModel.title} className="form-control-sm" errorMessage={errors?.title} />
                            </form>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? 'Save' : 'Update'} text={isRecordSaving ? 'Save' : 'Update'} onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} modalId="closePopup" className="btn-sm" />
                        </div>
                    </div>
                </div>
            </div>
         {isAssignSaleModeOpen && <AssignFabricSellMode/>}
        </Suspense>
    );
}

