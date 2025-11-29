import React, { useState, useEffect } from 'react'
import Inputbox from '../../common/Inputbox'
import ButtonBox from '../../common/ButtonBox'
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toast } from 'react-toastify';
import { toastMessage } from '../../../constants/ConstantValues';
import { common } from '../../../utils/common';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../common/Breadcrumb';
import TableView from '../../tables/TableView';
import Dropdown from '../../common/Dropdown';
import ErrorLabel from '../../common/ErrorLabel';
import Label from '../../common/Label';
import FabricSelectTable from './FabricSelectTable';
import { validationMessage } from '../../../constants/validationMessage';

export default function AssignFabricSellMode() {
    let navigate = useNavigate();
    const assignModelTemplate = {
        id: 0,
        sellModeId: 0,
        endDate: common.getHtmlDate(new Date()),
        fabricIds: [],
        forAllFabric: 1
    };
    const [assignModel, setAssignModel] = useState(assignModelTemplate);
    const [errors, setErrors] = useState();
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [sellModeList, setSellModeList] = useState();
    const [fabricList, setFabricList] = useState();
    const dropdownForAllFabric = [{ id: 1, value: "Yes" }, { id: 2, value: 'No' }]

    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.fabricMasterController.saleMode.getAllSaleMode + '?pageNo=1&pageSize=1000000'));
        apiList.push(Api.Get(apiUrls.fabricMasterController.fabric.getAllFabric + '?pageNo=1&pageSize=1000000'));
        if (apiList.length > 0) {
            Api.MultiCall(apiList)
                .then(res => {
                    setSellModeList(res[0].data?.data);
                    setFabricList(res[1].data?.data);
                })
        }
    }, [])

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
                setAssignModel(res.data);
            }
        });
    };
    const handleTextChange = (e) => {
        const { value, name, type } = e.target;
        const data = { ...assignModel, [name]: type === 'number' || type === 'select-one' ? parseInt(value) : value };
        setAssignModel(data);
        if (errors?.[name]) setErrors(prev => ({ ...prev, [name]: null }));
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
            popupModelId: "assign-fabricSaleMode",
            delete: { handler: handleDelete },
            edit: { handler: handleEdit }
        }
    });
    const breadcrumbOption = {
        title: 'Assign Sell Mode',
        items: [{ title: "Assign Sell Mode", icon: "bi bi-broadcast-pin", isActive: false }],
        buttons: [
            { text: "Fabric Sell Mode", icon: 'bx bx-plus', handler: () => { navigate('/fabric/master/sale/mode') } },
            { text: "Assign Sell Mode", icon: 'bx bx-plus', modelId: 'assign-fabricSaleMode', handler: () => { } }
        ]
    };
    const validate = () => {
        var err = {}
        var { endDate, sellModeId, forAllFabric } = assignModel;
        if (!forAllFabric || forAllFabric===false) err.forAllFabric = validationMessage.fabricSelectRequired;
        if (!endDate || endDate === '') err.endDate = validationMessage.endDateRequired;
        if (!sellModeId || sellModeId <= 0) err.sellModeId = validationMessage.sellModeRequired;
        return err;
    }
    const handleSave = () => {
        var err=validate();
        if(Object.keys(err).length>0)
        {
            setErrors(err)
            return
        }
        setErrors();
        var req=assignModel;
        req.forAllFabric=assignModel.forAllFabric===1;
        Api.Put(apiUrls.fabricMasterController.saleModeMapper.add, assignModel)
            .then(res => {
                if (res.data === true)
                    toast.success(toastMessage.saveSuccess);
            })
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <h6 className="mb-0 text-uppercase">Assign Sell Mode</h6>
            <hr />
            <TableView option={tableOption} />
            <div id="assign-fabricSaleMode" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Assign New Sell Mode</h5>
                            <button type="button" className="btn-close" id='closeFabricSaleMode' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className='col-4'>
                                    <Label text="Sell Mode" isRequired={true} />
                                    <Dropdown data={sellModeList} text="name" onChange={handleTextChange} name="sellModeId" value={assignModel.sellModeId} className="form-control-sm" />
                                    <ErrorLabel message={errors?.sellModeId} />
                                </div>
                                <div className='col-4'>
                                    <Inputbox type="date" labelText="End Date" min={common.getHtmlDate(new Date())} isRequired={true} onChangeHandler={handleTextChange} name="endDate" value={assignModel.endDate} className="form-control-sm " errorMessage={errors?.endDate} />
                                </div>
                                <div className='col-4'>
                                    <Label text="For All Fabric" isRequired={true} />
                                    <Dropdown data={dropdownForAllFabric} onChange={handleTextChange} name="forAllFabric" value={assignModel.forAllFabric} className="form-control-sm" />
                                    <ErrorLabel message={errors?.forAllFabric} />
                                </div>
                            </div>
                            {assignModel.forAllFabric === assignModel.forAllFabric && <>
                                <hr />
                                <div className='row'>
                                    <div className='col-12'>
                                        <FabricSelectTable fabricList={fabricList} setAssignModel={setAssignModel} assignModel={assignModel} />
                                    </div>
                                </div>
                            </>}
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? 'Save' : 'Update'} text={isRecordSaving ? 'Save' : 'Update'} onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} modalId="closePopup" className="btn-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
