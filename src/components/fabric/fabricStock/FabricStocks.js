import React, { useState, useEffect } from 'react'
import TableView from '../../tables/TableView';
import Breadcrumb from '../../common/Breadcrumb';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toast } from 'react-toastify';
import { toastMessage } from '../../../constants/ConstantValues';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import ButtonBox from '../../common/ButtonBox';
import Inputbox from '../../common/Inputbox';
import { validationMessage } from '../../../constants/validationMessage';
import { common } from '../../../utils/common';

export default function FabricStocks({userData,accessLogin}) {
    const fabricStockModelTemplate = {
        id: 0,
        inQty: 0,
        outQty: 0
    }
    const [fabricStockModel, setFabricStockModel] = useState(fabricStockModelTemplate);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const hasAdminLogin = () => {
        return accessLogin?.roleName?.toLowerCase() === "superadmin" || accessLogin?.roleName?.toLowerCase() === "admin";
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.fabricStockController.searchStock + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }
    const handleEdit = (stockId) => {
        setErrors({});
        Api.Get(apiUrls.fabricStockController.getStock + stockId).then(res => {
            if (res.data.id > 0) {
                setFabricStockModel(res.data);
            }
        });
    };

    const tableOptionTemplet = {
        headers: headerFormat.fabricStockDetails,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        showAction:hasAdminLogin,
        actions: {
            showView: false,
            showDelete: false,
            popupModelId: "add-fabricStock",
            edit: {
                handler: handleEdit
            }
        }
    };
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Fabric Stock',
        items: [
            {
                title: "Fabric Stock'",
                icon: "bi bi-broadcast-pin",
                isActive: false,
            }
        ]
    }
    const handleTextChange = (e) => {
        var { value, name, type } = e.target;
        var data = fabricStockModel;
        if (type === 'number') {
            data[name] = parseInt(value);
        } else {
            data[name] = value.toUpperCase();
        }
        setFabricStockModel({ ...data });

        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null })
        }
    }
    const validateError = () => {
        const { inQty, outQty } = fabricStockModel;
        const newError = {};
        if (!inQty || inQty < 1) newError.inQty = validationMessage.fabricStockInQtyRequired;
        if (!outQty || outQty < 0) newError.outQty = validationMessage.fabricStockOutQtyRequired;
        if (inQty < outQty) newError.inQty = validationMessage.fabricStockInQtyShouldGreaterThanOutQty;
        if (outQty > inQty) newError.outQty = validationMessage.fabricStockOutQtyShouldLessThanInQty;
        return newError;
    }

    const handleSave = (e) => {
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        Api.Post(apiUrls.fabricStockController.updateStock, fabricStockModel).then(res => {
            if (res.data) {
                common.closePopup('add-fabricStock');
                toast.success(toastMessage.updateSuccess);
                handleSearch('');
            }
        }).catch(err => {
            toast.error(toastMessage.updateError);
        });
    }
    useEffect(() => {
        Api.Get(apiUrls.fabricStockController.getAllStock + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            ;
    }, [pageNo, pageSize]);
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Fabric Stock Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>  {/* <!-- Add Contact Popup Model --> */}
            <div id="add-fabricStock" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Fabric Stock</h5>
                            <button type="button" className="btn-close" id='closeFabricStock' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <Inputbox type="number" labelText="Fabric In-Quantity" isRequired={true} onChangeHandler={handleTextChange} name="inQty" value={fabricStockModel.inQty} className="form-control-sm" errorMessage={errors?.inQty} />
                                            </div>
                                            <div className="col-md-12">
                                                <Inputbox type="number" labelText="Fabric Out-Quantity" isRequired={true} onChangeHandler={handleTextChange} name="outQty" value={fabricStockModel.outQty} className="form-control-sm" errorMessage={errors?.outQty} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={'Update'} text={'Update'} onClickHandler={handleSave} className="btn-sm" />
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

