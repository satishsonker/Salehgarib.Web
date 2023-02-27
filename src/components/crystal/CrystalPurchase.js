import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import ErrorLabel from '../common/ErrorLabel';
import Dropdown from '../common/Dropdown';
import { validationMessage } from '../../constants/validationMessage';
import ButtonBox from '../common/ButtonBox';
import { headerFormat } from '../../utils/tableHeaderFormat';
export default function CrystalPurchase() {
  const VAT = parseFloat(process.env.REACT_APP_VAT);
  const purchaseCrystalModelTemplate = {
    id: 0,
    purchaseNo: 0,
    supplierId: 0,
    invoiceNo: "",
    invoiceDate: common.getHtmlDate(new Date()),
    crystalId: 0,
    crystalNo: "",
    crystalSize: "",
    crystalShape: "",
    oldStock: 0,
    qty: 0,
    unitPrice: 0,
    subTotalPrice: 0,
    totalPrice: 0,
    totalPcs: 0,
    contactNo: '',
    trn: "",
    brandId: 0,
    piecePerPacket: 0,
    paymentMode: 'Cash',
    isWithOutVat: 0,
    chequeNo: '',
    installmentStartDate: common.getHtmlDate(new Date()),
    installments: 0,
    chequeDate: common.getHtmlDate(new Date()),
    crystalPurchaseDetails: [],
    vat: VAT
  };
  const [purchaseCrystalModel, setPurchaseCrystalModel] = useState(purchaseCrystalModelTemplate);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [errors, setErrors] = useState({});
  const [viewCrystalDetailsData, setViewCrystalDetailsData] = useState([]);
  const [crystalPerPacketQty, setCrystalPerPacketQty] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [crystalList, setCrystalList] = useState([]);
  const [isRecordSaving, setIsRecordSaving] = useState(true);
  const [filteredCrystalByBrand, setFilteredCrystalByBrand] = useState([]);
  const [tempId, setTempId] = useState(0);
  const [paymentModeList, setPaymentModeList] = useState([]);
  const handleDelete = (id, data) => {
    Api.Delete(apiUrls.purchaseEntryController.delete + id).then(res => {
      if (res.data === 1) {
        handleSearch('');
        toast.success(toastMessage.deleteSuccess);
      }
    }).catch(err => {
      toast.error(toastMessage.deleteError);
    });
  }
  const saveButtonHandler = () => {
    Api.Get(apiUrls.crystalPurchaseController.getCrystalPurchaseNo)
      .then(res => {
        purchaseCrystalModelTemplate.purchaseNo = res.data;
        setPurchaseCrystalModel({ ...purchaseCrystalModelTemplate });
        setErrors({});
      });
  }
  const handleEdit = (id, data) => {
    setErrors({});
    Api.Get(apiUrls.purchaseEntryController.get + data.purchaseEntryId).then(res => {
      let data = res.data;
      if (data.purchaseEntryId > 0) {
        data.brandId = 0;
        data.productId = 0;
        data.fabricWidthId = 0;
        data.brandName = '';
        data.productName = '';
        data.qty = 0;
        data.totalPaid = 0;
        data.totalPrice = 0;
        data.description = '';
        data.unitPrice = 0;
        setPurchaseCrystalModel(res.data);
      }
    }).catch(err => {
      toast.error(toastMessage.getError);
    })
  };

  const handleView = (id, data) => {
    setViewCrystalDetailsData([...data?.crystalPurchaseDetails]);
  }
  const handleSearch = (searchTerm) => {
    if (searchTerm.length > 0 && searchTerm.length < 3)
      return;
    Api.Get(apiUrls.crystalPurchaseController.searchCrystalPurchase + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {
      tableOptionTemplet.data = res.data.data;
      tableOptionTemplet.data.forEach(element => {
        //addAdditionalField(element);
      });
      tableOptionTemplet.totalRecords = res.data.totalRecords;
      setTableOption({ ...tableOptionTemplet });
      setViewCrystalDetailsData([]);
    }).catch(err => {

    });
  }
  const tableOptionTemplet = {
    headers: headerFormat.crystalPurchase,
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
      showView: true,
      popupModelId: "add-purchase-entry",
      delete: {
        handler: handleDelete,
        showModel: true
      },
      edit: {
        handler: handleEdit,
        icon: "bi bi-pencil-fill",
        modelId: "add-purchase-entry"
      },
      view: {
        handler: handleView
      }
    }
  }

  const tableOptionDetailTemplet = {
    headers:headerFormat.crystalPurchaseDetail,
    data: [],
    showAction: false,
    showTableTop: false
  }
  const breadcrumbOption = {
    title: 'Crystal Purchase',
    items: [
      {
        isActive: false,
        title: "Purchase Entry",
        icon: "bi bi-gem"
      }
    ],
    buttons: [
      {
        text: "New Purchase",
        icon: 'bx bx-plus',
        modelId: 'add-purchase-entry',
        handler: saveButtonHandler
      }
    ]
  }
  const [tableOption, setTableOption] = useState(tableOptionTemplet);
  const [tableOptionDetail, setTableOptionDetail] = useState(tableOptionDetailTemplet);

  const handleTextChange = (e) => {
    var { name, type, value } = e.target;
    var modal = purchaseCrystalModel;
    if ((type === 'select-one' && name !== 'piecePerPacket' && name !== 'IsWithOutVat' && name !== 'paymentMode') || type === 'number') {
      value = parseInt(value);
    }
    if (name === 'supplierId') {
      var selectedSupplier = supplierList.find(x => x.id === value);
      if (selectedSupplier) {
        modal.trn = selectedSupplier?.data?.trn;
        modal.contactNo = selectedSupplier?.data?.contact;
      }
    }
    if (name === 'brandId') {
      var res = crystalList.filter(x => x.brandId === value);
      setFilteredCrystalByBrand([...res]);
      modal.crystalId = 0;
      modal.crystalShape = "";
      modal.crystalSize = "";
      modal.crystalNo = "";
    }
    if (name === 'crystalId') {
      var res = crystalList.find(x => x.id === value);
      modal.crystalShape = res.shape;
      modal.crystalSize = res.size;
      modal.crystalNo = res.crystalId;
    }
    if (name === 'qty') {
      modal.subTotalPrice = value * modal.unitPrice;
      modal.totalPcs = value * parseFloat(modal.piecePerPacket);
    }
    if (name === 'unitPrice') {
      modal.subTotalPrice = value * modal.qty;
    }
    if (name === 'piecePerPacket') {
      modal.totalPcs = value * modal.qty;
    }
    if (name === 'IsWithOutVat') {

    }
    setPurchaseCrystalModel({ ...modal, [name]: value });
  }

  useEffect(() => {
    let apiList = [];
    apiList.push(Api.Get(apiUrls.dropdownController.suppliers));
    apiList.push(Api.Get(apiUrls.crystalController.getAllMasterCrystal));
    apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + `?masterDataTypes=crystal_packet&masterDataTypes=brand&masterDataTypes=payment_mode`));

    Api.MultiCall(apiList)
      .then(res => {
        setCrystalList(res[1].data.data);
        setSupplierList(res[0].data);
        setBrandList(res[2].data.filter(x => x.masterDataTypeCode.toLowerCase() === 'brand'));
        setCrystalPerPacketQty(res[2].data.filter(x => x.masterDataTypeCode.toLowerCase() === 'crystal_packet'));
        setPaymentModeList(res[2].data.filter(x => x.masterDataTypeCode.toLowerCase() === 'payment_mode'));
      });
  }, []);

  useEffect(() => {
    tableOptionDetailTemplet.data = viewCrystalDetailsData
    setTableOptionDetail({ ...tableOptionDetailTemplet });
  }, [viewCrystalDetailsData])

  const handleSave = (e) => {
    e.preventDefault();
    const formError = validateError();
    if (Object.keys(formError).length > 0) {
      setErrors(formError);
      return
    }

    let data = prepareModel();
    if (isRecordSaving) {
      Api.Put(apiUrls.crystalPurchaseController.addCrystalPurchase, data).then(res => {
        if (res.data.id > 0) {
          common.closePopup('add-purchase-entry');
          toast.success(toastMessage.saveSuccess);
          handleSearch('');
        }
      }).catch(err => {
        toast.error(toastMessage.saveError);
      });
    }
    else {
      Api.Post(apiUrls.crystalPurchaseController.updateCrystalPurchase, purchaseCrystalModel).then(res => {
        if (res.data.purchaseEntryId > 0) {
          common.closePopup('add-purchase-entry');
          toast.success(toastMessage.updateSuccess);
          handleSearch('');
        }
      }).catch(err => {
        toast.error(toastMessage.updateError);
      });
    }
  }
  const validateError = () => {
    const { supplierId, invoiceNo, invoiceDate, purchaseNo, crystalPurchaseDetails, installments, installmentStartDate, paymentMode, chequeDate, chequeNo } = purchaseCrystalModel;
    const newError = {};
    if (!supplierId || supplierId === 0) newError.supplierId = validationMessage.supplierRequired;
    if (!invoiceNo || invoiceNo === 0) newError.invoiceNo = validationMessage.invoiceNoRequired;
    if (!invoiceDate || invoiceDate === 0) newError.invoiceDate = validationMessage.invoiceDateRequired;
    if (installments > 0 && (!installmentStartDate || installmentStartDate === 0)) newError.installmentStartDate = validationMessage.installmentDateRequired;
    if (!crystalPurchaseDetails || crystalPurchaseDetails.length === 0) newError.crystalPurchaseDetails = validationMessage.purchaseEntryDetailsRequired;
    if (!purchaseNo || purchaseNo === 0) newError.purchaseNo = validationMessage.purchaseNoRequired;
    if (!paymentMode || paymentMode === "") newError.paymentMode = validationMessage.paymentModeRequired;
    if (paymentMode?.toLocaleLowerCase() === "cheque" && (!chequeDate || chequeDate === "")) newError.chequeDate = validationMessage.chequeDateRequired;
    if (paymentMode?.toLocaleLowerCase() === "cheque" && (!chequeNo || chequeNo === "")) newError.chequeNo = validationMessage.chequeNoRequired;
    return newError;
  }

  const addCrystalInDetails = () => {
    const formError = validateAddCrystalDetails();
    if (Object.keys(formError).length > 0) {
      setErrors(formError);
      return
    }
    var modal = purchaseCrystalModel;
    if (modal.crystalPurchaseDetails.find(x => x.crystalId === modal.crystalId)) {
      toast.warning("You have already added the crystal " + crystalList.find(x => x.id === modal.crystalId)?.name + " with " + crystalList.find(x => x.id === modal.crystalId)?.brand + " brand!")
      return;
    }
    modal.crystalPurchaseDetails.push({
      tempId: tempId + 1,
      id: 0,
      crystalPurchaseId: 0,
      crystal: crystalList.find(x => x.id === modal.crystalId)?.name,
      brand: crystalList.find(x => x.id === modal.crystalId)?.brand,
      shape: crystalList.find(x => x.id === modal.crystalId)?.shape,
      size: crystalList.find(x => x.id === modal.crystalId)?.size,
      crystalId: modal.crystalId,
      brandId: modal.brandId,
      qty: modal.qty,
      piecePerPacket: modal.piecePerPacket,
      unitPrice: modal.unitPrice,
      subTotalPrice: modal.subTotalPrice,
      vat: VAT,
      vatAmount: common.calculatePercent(modal.subTotalPrice, VAT),
      totalPrice: modal.subTotalPrice + parseFloat(common.calculatePercent(modal.subTotalPrice, VAT)),
      totalPcs: modal.totalPcs,
    });
    modal.crystalId = 0;
    modal.crystalSize = "";
    modal.crystalShape = "";
    modal.oldStock = 0;
    modal.qty = 0;
    modal.brandId = 0;
    modal.unitPrice = 0;
    modal.subTotalPrice = 0;
    modal.totalPrice = 0;
    modal.totalPcs = 0;
    modal.piecePerPacket = 0;
    setPurchaseCrystalModel({ ...modal });
    setErrors({});
    setTempId(ele => ele + 1);
  }
  const validateAddCrystalDetails = () => {
    const { brandId, crystalId, piecePerPacket, qty, unitPrice } = purchaseCrystalModel;
    const newError = {};
    if (!brandId || brandId === 0) newError.brandId = validationMessage.brandRequired;
    if (!crystalId || crystalId === 0) newError.crystalId = validationMessage.crystalNameRequired;
    if (!piecePerPacket || piecePerPacket === 0) newError.piecePerPacket = validationMessage.crystalQtyPerPacketRequired;
    if (!qty || qty === 0) newError.qty = validationMessage.quantityRequired;
    if (!unitPrice || unitPrice === 0) newError.unitPrice = validationMessage.unitPriceRequired;
    return newError;
  }
  const deleteCrystalInDetails = (tempId) => {
    debugger;
    var modal = purchaseCrystalModel;
    var newRemainingDetails = [];
    modal.crystalPurchaseDetails.forEach(res => {
      if (res.tempId !== tempId) {
        newRemainingDetails.push(res);
      }
    })
    modal.crystalPurchaseDetails = newRemainingDetails;
    setPurchaseCrystalModel({ ...modal });
  }
  const editCrystalInDetails = (tempId) => {
    debugger;
    var modal = purchaseCrystalModel;
    var selectedData = modal.crystalPurchaseDetails.find(x => x.tempId === tempId);
    modal.brandId = selectedData?.brandId;
    modal.crystalId = selectedData?.crystalId;
    modal.qty = selectedData?.qty;
    modal.crystalShape = selectedData?.shape;
    modal.crystalSize = selectedData?.size;
    modal.unitPrice = selectedData?.unitPrice;
    modal.piecePerPacket = selectedData?.piecePerPacket;
    modal.totalPrice = selectedData?.totalPrice;
    modal.totalPcs = selectedData?.totalPcs;

    modal.totalPrice = selectedData?.totalPcs;
    modal.unitPrice = selectedData?.unitPrice;
    modal.subTotalPrice = selectedData?.subTotalPrice;
    var newRemainingDetails = [];
    modal.crystalPurchaseDetails.forEach(res => {
      if (res.tempId !== tempId) {
        newRemainingDetails.push(res);
      }
    })
    modal.crystalPurchaseDetails = newRemainingDetails;
    setPurchaseCrystalModel({ ...modal });
  }
  const vatTypeList = [{ id: 0, value: "No" }, { id: 1, value: "Yes" }];
  const crystalDetailHeaders = ["Action", "Sr.", "Crystal", "Brand", "Shape", "Size", "Qty", "Piece/Packet", "Total Pieces", "Unit Price", "Sub Total"];
  if (purchaseCrystalModel.isWithOutVat === 0) {
    crystalDetailHeaders.push("VAT " + VAT + "%");
    crystalDetailHeaders.push("Total");
  }
  else {
    crystalDetailHeaders.push("Total");
  }
  const prepareModel = () => {
    var data = purchaseCrystalModel;
    data.isWithOutVat = data?.isWithOutVat === 1;
    data.subTotalAmount = 0;
    data.totalAmount = 0;
    data.vatAmount = 0;
    data.qty = 0;
    data.crystalPurchaseDetails.forEach(res => {
      res.piecePerPacket = parseInt(res?.piecePerPacket);
      data.totalPcs += res.totalPcs;
      data.subTotalAmount += res.subTotalPrice;
      data.totalAmount += res.totalPrice;
      data.vatAmount += res.vatAmount;
      data.qty += res.qty;
      res.subTotalAmount = res.subTotalPrice;
      res.totalAmount = res.totalPrice;
      res.totalPiece = res.totalPcs;
    });
    return data;
  }

  useEffect(() => {
    Api.Get(apiUrls.crystalPurchaseController.getAllCrystalPurchase + `?pageNo=${pageNo}&pageSize=${pageSize}`)
      .then(res => {
        tableOptionTemplet.data = res.data.data;
        tableOptionTemplet.totalRecords = res.data.totalRecords;
        setTableOption(tableOptionTemplet);
      })
  }, []);

  return (
    <>
      <Breadcrumb option={breadcrumbOption}></Breadcrumb>
      <h6 className="mb-0 text-uppercase">Crystal Purchase</h6>
      <hr />
      <TableView option={tableOption}></TableView>
      { tableOptionDetail.data.length>0 &&
      <TableView option={tableOptionDetail}></TableView>}
      <div id="add-purchase-entry" className="modal fade in" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">New Purchase Entry</h5>
              <button type="button" id='closePopup' className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
            </div>
            <div className="modal-body">
              <div className="form-horizontal form-material">
                <div className="card">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <Inputbox className="form-control-sm" labelText="Purchase No." isRequired={true} disabled={true} value={purchaseCrystalModel.purchaseNo} />
                      </div>
                      <div className="col-md-4">
                        <Inputbox className="form-control-sm" labelText="Invoice No." isRequired={true} value={purchaseCrystalModel.invoiceNo} name="invoiceNo" errorMessage={errors?.invoiceNo} onChangeHandler={handleTextChange} />
                      </div>
                      <div className="col-md-4">
                        <Inputbox className="form-control-sm" labelText="Invoice Date" isRequired={true} type="date" value={purchaseCrystalModel.invoiceDate} errorMessage={errors?.invoiceDate} name="invoiceDate" onChangeHandler={handleTextChange} />
                      </div>
                      <div className="col-md-4">
                        <Label text="Supplier" isRequired={true} />
                        <Dropdown className='form-control-sm' defaultValue='0' data={supplierList} name="supplierId" elementKey="id" searchable={true} onChange={handleTextChange} value={purchaseCrystalModel.supplierId} defaultText="Select supplier"></Dropdown>
                        <ErrorLabel message={errors?.supplierId}></ErrorLabel>
                      </div>
                      <div className="col-md-4">
                        <Inputbox className="form-control-sm" labelText="Contact No." disabled={true} value={purchaseCrystalModel.contactNo} name="contactNo" />
                      </div>
                      <div className="col-md-4">
                        <Inputbox className="form-control-sm" labelText="TRN" disabled={true} value={purchaseCrystalModel.trn} name="trn" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-3">
                        <Label text="Brand" isRequired={true} />
                        <Dropdown className='form-control-sm' defaultValue='0' data={brandList} name="brandId" elementKey="id" searchable={true} onChange={handleTextChange} value={purchaseCrystalModel.brandId} defaultText="Select Supplier"></Dropdown>
                        <ErrorLabel message={errors?.brandId}></ErrorLabel>
                      </div>
                      <div className="col-md-2">
                        <Inputbox className="form-control-sm" labelText="Shape" disabled={true} value={purchaseCrystalModel.crystalShape} />
                      </div>
                      <div className="col-md-2">
                        <Inputbox className="form-control-sm" labelText="Crystal Id" disabled={true} value={purchaseCrystalModel.crystalNo} />
                      </div>
                      <div className="col-md-2">
                        <Inputbox className="form-control-sm" labelText="Size" disabled={true} value={purchaseCrystalModel.crystalSize} />
                      </div>
                      <div className="col-md-3">
                        <Inputbox className="form-control-sm" labelText="Old Stock" disabled={true} value={purchaseCrystalModel.oldStock} />
                      </div>
                      <div className="col-md-3">
                        <Label text="Crystal" isRequired={true} />
                        <Dropdown className='form-control-sm' defaultValue='0' data={filteredCrystalByBrand} name="crystalId" elementKey="id" text="name" searchable={true} onChange={handleTextChange} value={purchaseCrystalModel.crystalId} defaultText="Select Crystal"></Dropdown>
                        <ErrorLabel message={errors?.crystalId}></ErrorLabel>
                      </div>
                      <div className="col-md-2">
                        <Label text="Qty/Packet" isRequired={true} />
                        <Dropdown className='form-control-sm' defaultValue='0' data={crystalPerPacketQty} name="piecePerPacket" elementKey="value" searchable={true} onChange={handleTextChange} value={purchaseCrystalModel.piecePerPacket} defaultText="Select Crystal"></Dropdown>
                        <ErrorLabel message={errors?.piecePerPacket}></ErrorLabel>
                      </div>
                      <div className="col-md-2">
                        <Inputbox errorMessage={errors?.qty} className="form-control-sm" type="number" min={0} labelText="Qty in Pkt" name="qty" onChangeHandler={handleTextChange} isRequired={true} value={purchaseCrystalModel.qty} />
                      </div>
                      <div className="col-md-2">
                        <Inputbox errorMessage={errors?.unitPrice} className="form-control-sm" type="number" min={0} labelText="Unit Price" isRequired={true} name="unitPrice" onChangeHandler={handleTextChange} value={purchaseCrystalModel.unitPrice} />
                      </div>
                      <div className="col-md-1">
                        <Inputbox className="form-control-sm" type="number" min={0} labelText="Total" disabled={true} value={purchaseCrystalModel.subTotalPrice} errorMessage={errors?.subTotalPrice} />
                      </div>
                      <div className="col-md-1">
                        <Inputbox className="form-control-sm" type="number" min={0} labelText="Total Pcs." disabled={true} value={purchaseCrystalModel.totalPcs} errorMessage={errors?.totalPcs} />
                      </div>
                      <div className="col-md-1 py-3">
                        <ButtonBox type="save" text="Add" onClickHandler={addCrystalInDetails} className="btn-sm" />
                      </div>
                      <div className="col-md-12">
                        <table id="example" className="table table-striped table-bordered fixTableHead" style={{ width: "100%" }} role="grid" aria-describedby="example_info">
                          <thead>
                            <tr>
                              {crystalDetailHeaders.map((ele, index) => {
                                return <th key={index}>{ele}</th>
                              })}
                            </tr>
                          </thead>
                          <tbody>

                            {errors?.crystalPurchaseDetails && <tr><td className='text-center text-danger' colSpan={crystalDetailHeaders.length}> {errors?.crystalPurchaseDetails}</td></tr>}
                            {!errors?.crystalPurchaseDetails && purchaseCrystalModel.crystalPurchaseDetails.length === 0 && <tr><td className='text-center text-danger' colSpan={crystalDetailHeaders.length}>No Crystal Added</td></tr>}
                            {
                              purchaseCrystalModel?.crystalPurchaseDetails?.map((ele, index) => {
                                return <tr key={index}>
                                  <td>
                                    <div style={{ cursor: "pointer" }} className="text-center">
                                      <i title='Edit' className="bi bi-pencil-fill text-warning" onClick={e => editCrystalInDetails(ele.tempId)}></i>
                                      <i title='Delete' className="bi bi-trash text-danger px-1" onClick={e => deleteCrystalInDetails(ele.tempId)}></i>
                                    </div>
                                  </td>
                                  <td className="text-center">{index + 1}</td>
                                  <td className="text-center">{ele.crystal}</td>
                                  <td className="text-center">{ele.brand}</td>
                                  <td className="text-center">{ele.shape}</td>
                                  <td className="text-center">{ele.size}</td>
                                  <td className="text-center">{ele.qty}</td>
                                  <td className="text-center">{ele.piecePerPacket}</td>
                                  <td className="text-center">{ele.totalPcs}</td>
                                  <td className="text-center">{common.printDecimal(ele.unitPrice)}</td>
                                  <td className="text-center">{common.printDecimal(ele.subTotalPrice)}</td>
                                  {purchaseCrystalModel.isWithOutVat === 0 && <td className="text-center">{common.printDecimal(ele.vatAmount)}</td>}
                                  <td className="text-center">{common.printDecimal(purchaseCrystalModel.isWithOutVat === 0 ? ele.totalPrice : ele.subTotalPrice)}</td>
                                </tr>
                              })}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td className="text-end" colSpan={6}>Total</td>
                              <td className="text-center" >{purchaseCrystalModel.crystalPurchaseDetails.reduce((sum, ele) => {
                                return sum += ele.qty;
                              }, 0)}</td>
                              <td></td>
                              <td className="text-center" >{purchaseCrystalModel.crystalPurchaseDetails.reduce((sum, ele) => {
                                return sum += ele.totalPcs;
                              }, 0)}</td>
                              <td>

                              </td>
                              <td className="text-center" >{common.printDecimal(purchaseCrystalModel.crystalPurchaseDetails.reduce((sum, ele) => {
                                return sum += ele.subTotalPrice;
                              }, 0))}</td>
                              {purchaseCrystalModel.isWithOutVat === 0 && <td className="text-center" >{common.printDecimal(purchaseCrystalModel.crystalPurchaseDetails.reduce((sum, ele) => {
                                return sum += parseFloat(ele.vatAmount);
                              }, 0))}</td>
                              }
                              <td className="text-center" >{common.printDecimal(purchaseCrystalModel.crystalPurchaseDetails.reduce((sum, ele) => {
                                return sum += parseFloat(purchaseCrystalModel.isWithOutVat === 0 ? ele.totalPrice : ele.subTotalPrice);
                              }, 0))}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="col-2">
                        <Inputbox className="form-control-sm" type="number" disabled={true} min={0} labelText="Total Crystals" value={purchaseCrystalModel?.crystalPurchaseDetails?.length} />
                      </div>
                      <div className="col-2">
                        <Inputbox className="form-control-sm" type="number" disabled={true} min={0} labelText="Total Qty" value={purchaseCrystalModel.crystalPurchaseDetails.reduce((sum, ele) => {
                          return sum += ele.qty;
                        }, 0)} />
                      </div>
                      <div className="col-2">
                        <Inputbox className="form-control-sm" type="number" disabled={true} min={0} labelText="Total Pieces" value={purchaseCrystalModel.crystalPurchaseDetails.reduce((sum, ele) => {
                          return sum += ele.totalPcs;
                        }, 0)} />
                      </div>
                      <div className="col-2">
                        <Inputbox className="form-control-sm" type="number" disabled={true} min={0} labelText="Total Amount" value={common.printDecimal(purchaseCrystalModel.crystalPurchaseDetails.reduce((sum, ele) => {
                          return sum += ele.subTotalPrice;
                        }, 0))} />
                      </div>

                      {!purchaseCrystalModel.isWithOutVat && <div className="col-2">
                        <Inputbox className="form-control-sm" type="number" disabled={true} min={0} labelText={`VAT ${VAT}%`} value={common.printDecimal(purchaseCrystalModel.crystalPurchaseDetails.reduce((sum, ele) => {
                          return sum += common.calculatePercent(ele.subTotalPrice, VAT);
                        }, 0))} />
                      </div>
                      }
                      <div className="col-2">
                        <Inputbox className="form-control-sm" type="number" disabled={true} min={0} labelText="Grand Amount" value={common.printDecimal(purchaseCrystalModel.crystalPurchaseDetails.reduce((sum, ele) => {
                          return sum += purchaseCrystalModel.isWithOutVat ? ele.subTotalPrice : ele.totalPrice;
                        }, 0))} />
                      </div>
                      <div className='clearfix'></div>
                      <div className="col-2">
                        <Label text="Without VAT" isRequired={true} />
                        <Dropdown className='form-control-sm' defaultValue={0} data={vatTypeList} name="isWithOutVat" onChange={handleTextChange} value={purchaseCrystalModel.isWithOutVat} displayDefaultText={false}></Dropdown>
                        <ErrorLabel message={errors?.isWithOutVat}></ErrorLabel>
                      </div>
                      <div className="col-md-2">
                        <Label text="Payment Mode" isRequired={true} />
                        <Dropdown className='form-control-sm' defaultValue='0' data={paymentModeList} name="paymentMode" elementKey="value" searchable={true} onChange={handleTextChange} value={purchaseCrystalModel.paymentMode} defaultText="Select Payment Mode"></Dropdown>
                        <ErrorLabel message={errors?.paymentMode}></ErrorLabel>
                      </div>
                      {purchaseCrystalModel.paymentMode?.toLocaleLowerCase() === "cheque" && <>
                        <div className="col-md-2">
                          <Inputbox className="form-control-sm" labelText="Cheque No." isRequired={true} value={purchaseCrystalModel.chequeNo} onChangeHandler={handleTextChange} name="chequeNo" errorMessage={errors?.chequeNo} />
                        </div>
                        <div className="col-md-2">
                          <Inputbox className="form-control-sm" type="date" labelText="Cheque Date" isRequired={true} value={purchaseCrystalModel.chequeDate} onChangeHandler={handleTextChange} name="chequeDate" errorMessage={errors?.chequeDate} />
                        </div>
                      </>
                      }

                      <div className="col-md-2">
                        <Label text="EMI (In Months)" />
                        <Dropdown defaultValue="" displayDefaultText={false} className="form-control-sm" data={common.emiOptions} name="installments" onChange={handleTextChange} elementKey="id" value={purchaseCrystalModel.installments} defaultText="Select EMI"></Dropdown>
                      </div>
                      {purchaseCrystalModel.installments > 0 && <>
                        <div className="col-md-2">
                          <Inputbox className="form-control-sm" type="date" labelText="Emi Start On" isRequired={true} value={purchaseCrystalModel.installmentStartDate} onChangeHandler={handleTextChange} name="installmentStartDate" errorMessage={errors?.installmentStartDate} />
                        </div>
                      </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <ButtonBox type="save" onClickHandler={handleSave} className="btn-sm" text={isRecordSaving ? 'Save' : 'Update'}></ButtonBox>
              <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
            </div>
          </div>
          {/* <!-- /.modal-content --> */}
        </div>
      </div>
    </>
  )
}
