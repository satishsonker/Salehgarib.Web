import React, { useState, useEffect, useRef } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import TableView from '../../tables/TableView'
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toast } from 'react-toastify';
import { toastMessage } from '../../../constants/ConstantValues';
import { common } from '../../../utils/common';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import { validationMessage } from '../../../constants/validationMessage';
import Inputbox from '../../common/Inputbox';
import ButtonBox from '../../common/ButtonBox';
import Label from '../../common/Label';
import Dropdown from '../../common/Dropdown';
import SearchableDropdown from '../../common/SearchableDropdown/SearchableDropdown';
import ErrorLabel from '../../common/ErrorLabel';
import ImagePreview from '../../common/ImagePreview';
import { useReactToPrint } from 'react-to-print';
import PrintFabricStockTransferReceipt from '../Print/PrintFabricStockTransferReceipt';
import PrintFabricStockTransfer from '../Print/PrintFabricStockTransfer';

export default function FabricStockTransfer({ userData, accessLogin }) {
    const stockTransferModelTemplate = {
        id: 0,
        receiptNo: 0,
        receiptDate: common.getHtmlDate(new Date()),
        companyId: 0,
        fabricId: 0,
        qty: 0,
        fabricCode: '',
        fabricId: 0,
        fabricBrand: '',
        fabricCode: '',
        fabricType: '',
        fabricSize: '',
        fabricPrintType: '',
        fabricImagePath: '',
        fabricColor: '',
        fabricColorCode: '',
        fabricStockTransferDetails: []
    }
    const [refreshReceiptNo, setRefreshReceiptNo] = useState(0)
    const [stockTransferModel, setStockTransferModel] = useState(stockTransferModelTemplate);
    const [companyList, setCompanyList] = useState([]);
    const [fabricList, setFabricList] = useState([]);
    const [receiptNo, setReceiptNo] = useState('00000');
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState();
    const [filter, setFilter] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth()),
        toDate: common.getHtmlDate(new Date())
    });
    const [fetchData, setFetchData] = useState(0);
    const [printReceiptData, setPrintReceiptData] = useState({});
    const printTransferDetailRef = useRef();
    const printTransferReceiptRef = useRef();
    const filterDataChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    }
    const printRceiptHandler = useReactToPrint({
        content: () => printTransferReceiptRef.current
    })
    const printTransferDetailHandler = useReactToPrint({
        content: () => printTransferDetailRef.current,
        pageStyle: `
        @page {
            size: landscape; /* Change to portrait if needed */
            margin: 6mm; /* Adjust margins as needed */
        }
             body {
                font-family: Arial, sans-serif;
                font-size:12px
            }
    `,
    });

    const hasAdminLogin = () => {
        return accessLogin?.roleName?.toLowerCase() === "superadmin" || accessLogin?.roleName?.toLowerCase() === "admin";
    }
    const handleDelete = (id) => {
        Api.Delete(apiUrls.fabricStockTransferController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.fabricStockTransferController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name, type } = e.target;
        if (name === 'fabricId' || name === "companyId" || name === 'qty') {
            value = parseInt(value);
        }
        setStockTransferModel({ ...stockTransferModel, [name]: value });

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

        let data = common.assignDefaultValue(stockTransferModelTemplate, stockTransferModel);
        data.receiptNo = parseInt(receiptNo);
        Api.Put(apiUrls.fabricStockTransferController.add, data).then(res => {
            if (res.data.id > 0) {
                common.closePopup('closeFabricSize');
                toast.success(toastMessage.saveSuccess);
                handleSearch('');
            }
        }).catch(err => {
            toast.error(toastMessage.saveError);
        });
    }
    const tablePrintHandler = (id, data) => {
        setPrintReceiptData({ ...data });
    }
    useEffect(() => {
        if (printReceiptData?.id === undefined || printReceiptData?.id <= 0)
            return;
        printRceiptHandler();
    }, [printReceiptData])

    const tableOptionTemplet = {
        headers: headerFormat.fabricStockTransfer,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showEdit: false,
            showPrint: true,
            popupModelId: "add-fabricStockTransfer",
            delete: {
                handler: handleDelete
            },
            print: {
                handler: tablePrintHandler
            }
        }
    };

    const saveButtonHandler = () => {
        setStockTransferModel({ ...stockTransferModelTemplate });
        setErrors({});
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    const breadcrumbOption = {
        title: 'Fabric Stock Transfer',
        items: [
            {
                isActive: false,
                title: "Fabric",
                icon: "bi bi-view-list"
            },
            {
                isActive: false,
                title: "Fabric Stock",
                icon: "bi bi-cart4"
            }
        ],
        buttons: [
            {
                text: "Transfer Stock",
                icon: 'bx bx-plus',
                modelId: 'add-fabricStockTransfer',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        Api.Get(apiUrls.fabricStockTransferController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}&fromDate=${filter.fromDate}&toDate=${filter.toDate}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [pageNo, pageSize, fetchData]);

    const validateError = () => {
        const { companyId, receiptDate } = stockTransferModel;
        const newError = {};
        if (!receiptDate || receiptDate === "") newError.receiptDate = validationMessage.receiptDateRequired;
        if (!receiptNo || receiptNo === "" || isNaN(parseInt(receiptNo))) newError.receiptNo = validationMessage.receiptNoRequired;
        if (!companyId || companyId === "") newError.companyId = validationMessage.companyNameRequired;
        if (!stockTransferModel.fabricStockTransferDetails || stockTransferModel.fabricStockTransferDetails?.length < 1) newError.fabricStockTransferDetails = validationMessage.addFabricInListRequired;
        return newError;
    }

    useEffect(() => {
        Api.Get(apiUrls.fabricStockTransferController.getReceiptNo)
            .then(res => {
                setReceiptNo(res.data);
            })
        return () => {
            setReceiptNo("0000");
        }
    }, [refreshReceiptNo])

    useEffect(() => {
        Api.MultiCall([
            Api.Get(apiUrls.expenseController.getAllExpenseCompany + '?pageNo=1&PageSize=100000'),
            Api.Get(apiUrls.fabricMasterController.fabric.getAllFabric + '?pageNo=1&PageSize=100000')
        ])
            .then(res => {
                setCompanyList(res[0].data.data);
                setFabricList(res[1].data.data);
            });
    }, []);

    const removeFabricFromListHandler = (id, data) => {
        var model = stockTransferModel;
        model.fabricStockTransferDetails = model.fabricStockTransferDetails.filter(x => x.fabricId !== data.fabricId);
        tableFabricOptionTemplate.data = model.fabricStockTransferDetails;
        tableFabricOptionTemplate.totalRecords = model.fabricStockTransferDetails?.length;
        setTableFabricOption({ ...tableFabricOptionTemplate });
        setStockTransferModel({ ...model });
    }

    const tableFabricOptionTemplate = {
        headers: headerFormat.fabricStockTransferDetail,
        showTableTop: false,
        showFooter: true,
        data: [],
        totalRecords: 0,
        showPagination: false,
        changeRowClassHandler: (data) => {
            return data?.isCancelled ? "bg-danger text-white" : "";
        },
        actions: {
            showView: false,
            showEdit: false,
            popupModelId: "",
            delete: {
                handler: removeFabricFromListHandler,
                icon: "bi bi-x-circle",
                title: "Delete fabric qty!",
                showModel: false
            }
        }
    };

    const [tableFabricOption, setTableFabricOption] = useState(tableFabricOptionTemplate);

    const validateAddFabric = () => {
        var err = {};
        if (stockTransferModel.fabricId < 1 || isNaN(stockTransferModel.fabricId)) err.fabricId = validationMessage.fabricRequired;
        if (stockTransferModel.qty < 1) err.qty = validationMessage.quantityRequired;
        var selectedFabric = fabricList.find(x => x.id === stockTransferModel.fabricId);
        if (!selectedFabric) {
            err.fabricCode = validationMessage.fabricNotFound;
        }
        setErrors({ ...err });
        return err;
    }

    const addFabricInListHandler = () => {
        var err = validateAddFabric();
        if (Object.keys(err).length > 0)
            return;

        var isFabricExist = stockTransferModel.fabricStockTransferDetails.find(x => x.fabricId === stockTransferModel.fabricId);
        if (isFabricExist !== undefined) {
            toast.warning(validationMessage.fabricAlreadyAdded);
            return;
        }
        var modal = stockTransferModel;
        modal.fabricStockTransferDetails.push(common.cloneObject(stockTransferModel));
        modal.fabricCode = '';
        modal.fabricId = 0;
        modal.fabricBrand = '';
        modal.fabricCode = '';
        modal.fabricType = '';
        modal.fabricSize = '';
        modal.fabricPrintType = '';
        modal.fabricImagePath = '';
        modal.fabricColor = '';
        modal.fabricColorCode = '';
        modal.qty = 0;
        setStockTransferModel({ ...modal });
        tableFabricOptionTemplate.data = stockTransferModel.fabricStockTransferDetails;
        tableFabricOptionTemplate.totalRecords = stockTransferModel.fabricStockTransferDetails?.length;
        setTableFabricOption({ ...tableFabricOptionTemplate });
    }

    useEffect(() => {
        if (!stockTransferModel.fabricId || stockTransferModel.fabricId <= 0)
            return;
        var filteredFabric = fabricList?.find(x => x.id === stockTransferModel.fabricId);
        var modal = stockTransferModel;
        modal.fabricBrand = filteredFabric?.brandName;
        modal.fabricCode = filteredFabric?.fabricCode;
        modal.fabricType = filteredFabric?.fabricTypeName;
        modal.fabricSize = filteredFabric?.fabricSizeName;
        modal.fabricPrintType = filteredFabric?.fabricPrintType;
        modal.fabricImagePath = filteredFabric?.fabricImagePath;
        modal.fabricColor = filteredFabric?.fabricColorName;
        modal.fabricColorCode = filteredFabric?.fabricColorCode;
        modal.fabricId = filteredFabric?.id;
        modal.qty = 0;
        setStockTransferModel({ ...modal });
    }, [stockTransferModel.fabricId]);
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between">
                <div>
                    <h6 className="mb-0 text-uppercase">Fabric Stock Transfer</h6>
                </div>
                {hasAdminLogin() && <div className="d-flex justify-content-end">
                    <div className='mx-2'>
                        <span> From Date</span>
                        <Inputbox type="date" name="fromDate" value={filter.fromDate} max={filter.toDate} onChangeHandler={filterDataChangeHandler} className="form-control-sm" showLabel={false} />
                    </div>
                    <div className='mx-2'>
                        <span> To Date</span>
                        <Inputbox type="date" name="toDate" min={filter.fromDate} max={common.getHtmlDate(new Date())} value={filter.toDate} onChangeHandler={filterDataChangeHandler} className="form-control-sm" showLabel={false} />
                    </div>
                    <div className='mx-2 my-3 py-1'>
                        <ButtonBox type="go" onClickHandler={e => { setFetchData(x => x + 1) }} className="btn-sm"></ButtonBox>
                    </div>
                    <div className='mx-2 my-3 py-1'>
                        <ButtonBox type="Print" disabled={tableOption?.data?.length === 0} onClickHandler={printTransferDetailHandler} className="btn-sm"></ButtonBox>
                    </div>
                </div>
                }
            </div>
            <hr style={{ margin: "0 0 16px 0" }} />
            <TableView option={tableOption}></TableView>
            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-fabricStockTransfer" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Stock Transfer</h5>
                            <button type="button" className="btn-close" id='closeFabricSize' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-3">
                                                <Label fontSize='13px' text="Receipt No" isRequired={true}></Label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control form-control-sm" value={receiptNo} disabled={true} placeholder="" />
                                                    <div className="input-group-append">
                                                        <button onClick={e => setRefreshReceiptNo(pre => pre + 1)} className="btn btn-sm btn-outline-secondary" type="button"><i className='bi bi-arrow-clockwise' /></button>
                                                    </div>
                                                </div>
                                                <ErrorLabel message={errors?.receiptNo} />
                                            </div>
                                            <div className="col-3">
                                                <Inputbox type="date" labelText="Receipt Date" isRequired={true} onChangeHandler={handleTextChange} name="receiptDate" value={stockTransferModel.receiptDate} className="form-control-sm" errorMessage={errors?.receiptDate} />
                                            </div>
                                            <div className='col-6'>
                                                <Label text="Stock Transfer To" isRequired={true}></Label>
                                                <Dropdown onChange={handleTextChange} text="companyName" data={companyList} name="companyId" value={stockTransferModel.companyId} className="form-control form-control-sm" />
                                                <ErrorLabel message={errors?.companyId} />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <div className='row'>
                                                    <div className='col-2'>
                                                        <Label text="F. Code" />
                                                        <SearchableDropdown data={fabricList} elementKey="id" text="fabricCode" className="form-control-sm" value={stockTransferModel.fabricId} name="fabricId" onChange={handleTextChange} />
                                                        <ErrorLabel message={errors?.fabricId} />
                                                    </div>
                                                    <div className='col-2'>
                                                        <Inputbox labelText="Qty" type="number" isRequired={true} min={1} value={stockTransferModel.qty} name="qty" errorMessage={errors?.qty} onChangeHandler={handleTextChange} className="form-control form-control-sm" />
                                                    </div>
                                                    <div className='col-2'>
                                                        <Inputbox labelText="Brand" isRequired={true} disabled={true} value={stockTransferModel.fabricBrand} name="fabricBrand" errorMessage={errors?.fabricBrand} onChangeHandler={handleTextChange} className="form-control form-control-sm" />
                                                    </div>
                                                    <div className='col-2'>
                                                        <Inputbox labelText="F. Type" isRequired={true} disabled={true} value={stockTransferModel.fabricType} name="fabricType" errorMessage={errors?.fabricType} onChangeHandler={handleTextChange} className="form-control form-control-sm" />
                                                    </div>
                                                    <div className='col-2'>
                                                        <Inputbox labelText="F. Print Type" isRequired={true} disabled={true} value={stockTransferModel.fabricPrintType} name="fabricPrintType" errorMessage={errors?.fabricPrintType} onChangeHandler={handleTextChange} className="form-control form-control-sm" />
                                                    </div>
                                                    <div className='col-2'>
                                                        <Inputbox labelText="Size" isRequired={true} disabled={true} value={stockTransferModel.fabricSize} name="fabricSize" errorMessage={errors?.fabricSize} onChangeHandler={handleTextChange} className="form-control form-control-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-2'>
                                                <Inputbox labelText="Color" style={{ background: stockTransferModel.fabricColorCode, border: '3px solid ' + stockTransferModel.fabricColorCode, height: '83px', textAlign: 'center' }} isRequired={true} disabled={true} value={stockTransferModel.fabricColor} name="fabricColor" errorMessage={errors?.fabricColor} onChangeHandler={handleTextChange} className="form-control form-control-sm" />
                                            </div>
                                            <div className='col-2'>
                                                <Label text="Image" />
                                                <ImagePreview src={stockTransferModel.fabricImagePath} height='83px' showThumb={true}></ImagePreview>
                                            </div>
                                            <div className='col-2' style={{ marginTop: '-3px' }}>
                                                <ButtonBox type="add" onClickHandler={addFabricInListHandler} className="btn btn-sm mt-4 w-100"></ButtonBox>
                                            </div>
                                        </div>
                                        <ErrorLabel message={errors?.fabricStockTransferDetails} />
                                        <TableView option={tableFabricOption}></TableView>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type='Save' onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} modalId="closePopup" className="btn-sm" />
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
            <div className='d-none'>
                <PrintFabricStockTransferReceipt printRef={printTransferReceiptRef} data={printReceiptData}></PrintFabricStockTransferReceipt>
            </div>
            <div className='d-none'>
                <PrintFabricStockTransfer printRef={printTransferDetailRef} filter={filter} data={tableOption.data}></PrintFabricStockTransfer>
            </div>
        </>
    )
}
