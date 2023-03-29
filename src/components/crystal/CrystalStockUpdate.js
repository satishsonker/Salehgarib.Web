import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import TableView from '../tables/TableView'

export default function CrystalStockUpdate() {
    const updateCrystalModelTemplet = {
        id: 0,
        crystalId: 0,
        inStock: 0,
        inStockPieces: 0,
        balanceStock: 0,
        balanceStockPieces: 0,
        crystalSize: "",
        crystalBrand: '',
        crystalShape: "",
        crystalName: "",
        reason: ""
    }
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState({});
    const [updateCrystalModel, setUpdateCrystalModel] = useState(updateCrystalModelTemplet);
    const handleEdit = (id, data) => {
        setErrors({});
        Api.Get(apiUrls.crystalPurchaseController.getCrystalStockDetailById + `${id}`).then(res => {
            setUpdateCrystalModel({ ...res.data });
        }).catch(err => {
            toast.error(toastMessage.getError);
        });
    };

    const breadcrumbOption = {
        title: 'Crystal',
        items: [
            {
                isActive: false,
                title: "Update Crystal Stock",
                icon: "bi bi-tag"
            }
        ]
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.crystalPurchaseController.searchCrystalStockDetail + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }
    const tableOptionTemplet = {
        headers: headerFormat.crystalStockUpdate,
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
            showView: false,
            showDelete: false,
            edit: {
                handler: handleEdit,
                icon: "bi bi-pencil-fill",
                modelId: "add-purchase-entry"
            }
        }
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    useEffect(() => {
        Api.Get(apiUrls.crystalPurchaseController.getCrystalStockDetail)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            })
    }, []);

    const handleTextChange = (e) => {
        var { type, name, value } = e.target;
        if (type === "number")
            value = parseInt(value);
        setUpdateCrystalModel({ ...updateCrystalModel, [name]: value });
    }
    const handleUpdateStock = () => {
        var formError = validateErrors();
        if (Object.keys(formError).length > 0) {
            setErrors({ ...formError });
            return;
        }
        setErrors({});
        Api.Post(apiUrls.crystalPurchaseController.updateCrystalStock + `?reason=${updateCrystalModel.reason}`, updateCrystalModel)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.updateSuccess);
                }
                else
                    toast.warn(toastMessage.updateError);
            });
    }

    const validateErrors = () => {
        var { balanceStock, balanceStockPieces, reason } = updateCrystalModel;
        let errors = {};
        if (!reason || reason.length < 2) errors.reason = validationMessage.reasonRequired;
        if (!balanceStock || balanceStock < 0) errors.balanceStock = validationMessage.balanceQtyRequired;
        if (!balanceStockPieces || balanceStockPieces < 0) errors.balanceStockPieces = validationMessage.balanceQtyRequired;
        return errors;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <h6 className="mb-0 text-uppercase">Update Stock</h6>
            <hr />
            <TableView option={tableOption}></TableView>
            <div id="add-purchase-entry" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Stock</h5>
                            <button type="button" className="btn-close" id='closePopupMonthlyAttendence' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-3">
                                                <Label text={`Name : ${updateCrystalModel.crystalName}`} />
                                            </div>
                                            <div className="col-3">
                                                <Label text={`Shape : ${updateCrystalModel.crystalShape}`} />
                                            </div>
                                            <div className="col-3">
                                                <Label text={`Size : ${updateCrystalModel.crystalSize}`} />
                                            </div>
                                            <div className="col-3">
                                                <Label text={`Brand : ${updateCrystalModel.crystalBrand}`} />
                                            </div>
                                            <div className="col-6">
                                                <Inputbox isRequired={true} labelText="Available Stock in Packets" type="number" onChangeHandler={handleTextChange} min={0} max={1000000000} value={updateCrystalModel.balanceStock} errorMessage={errors?.balanceStock} name="balanceStock" className="form-control-sm" />
                                            </div>
                                            <div className="col-6">
                                                <Inputbox isRequired={true} labelText="Available Stock in Pieces" type="number" onChangeHandler={handleTextChange} min={0} max={1000000000} value={updateCrystalModel.balanceStockPieces} errorMessage={errors?.balanceStockPieces} name="balanceStockPieces" className="form-control-sm" />
                                            </div>
                                            <div className="col-12">
                                                <Inputbox isRequired={true} errorMessage={errors?.reason} labelText="Reason for update" type="string" onChangeHandler={handleTextChange} value={updateCrystalModel.reason} name="reason" className="form-control-sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <ButtonBox type="update" onClickHandler={handleUpdateStock} className="btn-sm" />
                                        <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
