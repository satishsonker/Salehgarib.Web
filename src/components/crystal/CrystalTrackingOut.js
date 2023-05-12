import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common'
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb';
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function CrystalTrackingOut() {
   
    const returnModelTemplate = {
        orderId: 0,
        orderDetailId: 0,
        returnDate: common.getCurrDate(true),
    }

    
    const [returnRequest, setReturnRequest] = useState(returnModelTemplate);
   
    
    const [orderNos, setOrderNos] = useState([]);
    const [orderDetailNos, setOrderDetailNos] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState({});
    const [returnSelectedTrackingDetail, setReturnSelectedTrackingDetail] = useState({});
    const [returnOrderDetails, setReturnOrderDetails] = useState({});
    const [selectedTrackingId, setSelectedTrackingId] = useState(0);
  
    const [clearDdlValue, setClearDdlValue] = useState(false);
    const curr_month = new Date().getMonth() + 1;
    const curr_year = new Date().getFullYear();
    const [filterData, setFilterData] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(curr_month - 1, curr_year)),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(curr_month, curr_year))
    });
    const [fetchData, setFetchData] = useState(0);

  

    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.crytalTrackingController.searchTrackingOut + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            tableDetailOptionTemplet.totalRecords = 0;
            setTableDetailOption({ ...tableDetailOptionTemplet });
        });
    }

    const handleView = (id, data) => {
        setSelectedTrackingId(id);
    }

    const handleEdit = () => {

    }
    const handleDelete = (id) => {
        Api.Delete(apiUrls.crytalTrackingController.deleteTrackingOut + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }

    const handleDetailDelete = (id) => {
        Api.Delete(apiUrls.crytalTrackingController.deleteTrackingOutDetail + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }

    const breadcrumbOption = {
        title: 'Crystal Stock Tracking',
        items: [
            {
                isActive: false,
                title: "Crystal Stock Tracking",
                icon: "bi bi-tag"
            }
        ],
        buttons: [
            {
                text: "Crystal Tracking",
                icon: 'bi bi-gem',
                modelId: 'add-crysal-tracking'
            },
            {
                text: "Retuen Crystal Tracking",
                icon: 'bi bi-gem',
                modelId: 'return-crysal-tracking'
            }
        ]
    }

    useEffect(() => {
        if (selectedTrackingId === 0)
            return;
        let details = tableOption.data.find(x => x.id === selectedTrackingId)?.crystalTrackingOutDetails ?? [];
        tableDetailOptionTemplet.data = details;
        tableDetailOptionTemplet.totalRecords = details?.length;
        setTableDetailOption(tableDetailOptionTemplet);
    }, [selectedTrackingId])


    const tableOptionTemplet = {
        headers: headerFormat.crystalTrackingOutMain,
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
            showEdit: false,
            showPrint: false,
            delete: {
                handler: handleDelete,
                title: "Delete Tracking Record"
            },
            edit: {
                handler: handleEdit,
                icon: "bi bi-pencil",
                modelId: "",
                title: "Edit Tracking Record"
            },
            view: {
                handler: handleView,
                title: "View Tracking Record Detail"
            }
        },
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    const tableDetailOptionTemplet = {
        headers: headerFormat.crystalTrackingOutDetail,
        showTableTop: false,
        data: [],
        totalRecords: 0,
        actions: {
            showView: false,
            showEdit: false,
            showPrint: false,
            delete: {
                handler: handleDetailDelete,
                showModel: true,
                title: "Delete Tracking Detail Record"
            }
        },
    }

    const [tableDetailOption, setTableDetailOption] = useState(tableDetailOptionTemplet);

    useEffect(() => {
        if (fetchData === 0)
            return;
        Api.Get(apiUrls.crytalTrackingController.getAllTrackingOut + `?pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${filterData.fromDate}&toDate=${filterData.toDate}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            });
    }, [pageNo, pageSize, fetchData]);

    useEffect(() => {
        if (returnRequest.orderDetailId < 1)
            return;
        Api.Get(apiUrls.crytalTrackingController.getTrackingOutByOrderDetailId + returnRequest.orderDetailId)
            .then(res => {
                var data = res.data[0];
                setReturnSelectedTrackingDetail({ ...data });
            });
    }, [returnRequest.orderDetailId]);

    const filterChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilterData({ ...filterData, [name]: value });
    }

    
    const calculateReturnPackets = (pieces, piecesPerPacket) => {
        var remainingPackets = parseInt(pieces / piecesPerPacket);
        var remainingPiece = pieces % piecesPerPacket;
        var piecesInHalfPacket = parseInt(piecesPerPacket / 2);
        if (remainingPiece > piecesInHalfPacket) {
            remainingPackets += 1;
        }
        return remainingPackets;
    }
    const returnTextChange = (e, index) => {
        var { type, name, value } = e.target;
        let model = returnRequest;
        if (type === "select-one" || type === "number") {
            value = parseInt(value);
            value = isNaN(value) ? 0 : value;
            setClearDdlValue(false);
        }
        if (name === "usedPieces") {
            debugger;
            if(returnRequest.returnDate==="")
            {
                toast.warn("Please select the return date first")
                return;
            }
            model = returnSelectedTrackingDetail;
            let releaseDetails=model.crystalTrackingOutDetails[index];
            let piecePerPacket = releaseDetails?.releasePieceQty / releaseDetails?.releasePacketQty;
            releaseDetails.returnPieceQty =releaseDetails?.releasePieceQty-value;
            releaseDetails.returnDate=returnRequest.returnDate;
            releaseDetails.returnPacketQty =releaseDetails?.releasePacketQty- calculateReturnPackets(value, piecePerPacket);
            model.crystalTrackingOutDetails[index].usedPieces=value;
            // if (!releaseDetails.returnDate || releaseDetails.returnDate === common.defaultDate)
            //     releaseDetails.returnDate = common.getHtmlDate(new Date);
            setReturnSelectedTrackingDetail({ ...model });
        }
        // else if (name === "returnDate") {
        //     model = returnSelectedTrackingDetail;
        //     model.crystalTrackingOutDetails[index].returnDate = value;
        //     setReturnSelectedTrackingDetail({ ...model });
        // }
        else
            setReturnRequest({ ...model, [name]: value });
    }

   

    

   

   
    const handleUpdateReturn = () => {
        if (returnSelectedTrackingDetail.crystalTrackingOutDetails.find(x => x.returnPieceQty > 0) === undefined) {
            toast.warn("Please enter the return pieces quantity.");
            return;
        }
        if (returnSelectedTrackingDetail.crystalTrackingOutDetails.find(x => x.returnPieceQty > 0 && (x.returnDate === undefined || x.returnDate === "")) !== undefined) {
            toast.warn("Please select the return date.");
            return;
        }

        Api.Post(apiUrls.crytalTrackingController.updateTrackingOutReturn, returnSelectedTrackingDetail.crystalTrackingOutDetails)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.updateSuccess);
                }
                else
                    toast.warn(toastMessage.updateError);
            });
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div className="d-flex justify-content-end my-2">
                {/* <h6 className="mb-0 text-uppercase">Kandoora Expense</h6> */}

                <div className='mx-1'>
                    <Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={filterChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                </div>
                <div className='mx-1'>
                    <Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(curr_month, curr_year))} onChangeHandler={filterChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                </div><div className='mx-1'>
                    <ButtonBox type="go" className="btn-sm" onClickHandler={() => { setFetchData(prev => prev + 1) }} />
                </div>
            </div>
            <TableView option={tableOption} />
            <TableView option={tableDetailOption} />
           
            {/* <div id="return-crysal-tracking" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Return Crystal Tracking</h5>
                            <button type="button" className="btn-close" id='closePopupCustomerDetails' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Order No : ${returnOrderDetails?.orderNo ?? "Not Selected"}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Price : ${common.printDecimal(returnOrderDetails?.price)}/${common.getGrade(returnOrderDetails?.price ?? 0)}`}></Label>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='11px' bold={true} text={`Del. Date : ${common.getHtmlDate(returnOrderDetails?.orderDeliveryDate, "ddmmyyyy")}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Packet : ${returnOrderDetails?.crystal ?? 0}`}></Label>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='11px' bold={true} text={`Salesman : ${returnOrderDetails?.salesman ?? "Not Selected"}`}></Label>
                                </div>
                                <div className="col-2">
                                    <Label fontSize='11px' bold={true} text={`Issue Date : ${common.getHtmlDate(returnSelectedTrackingDetail?.releaseDate, "ddmmyyyy")}`}></Label>
                                </div>
                                <div className="col-10">
                                    <Label fontSize='11px' bold={true} text={`Employee : ${returnSelectedTrackingDetail?.employeeName??"Not Selected"}`}></Label>
                                </div>
                                <div className="col-2 offset-sm-0 offset-md-3">
                                    <Label text="Order No" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={orderNos} searchable={true} onChange={returnTextChange} name="orderId" value={returnRequest.orderId} />
                                </div>
                                <div className="col-2">
                                    <Label text="Kandoora No" isRequired={true}></Label>
                                    <Dropdown className="form-control-sm" data={orderDetailNos.filter(x => x.parentId === returnRequest.orderId)} onChange={returnTextChange} name="orderDetailId" value={returnRequest.orderDetailId} />
                                </div>
                                <div className="col-2">
                                    <Inputbox type="date" isRequired={true} min={(returnSelectedTrackingDetail?.crystalTrackingOutDetails??[])[0]?.releaseDate??new Date()} labelText="Return Date" name="returnDate" value={returnRequest.returnDate} onChangeHandler={returnTextChange} className="form-control-sm" />
                                </div>
                                {
                                    returnSelectedTrackingDetail?.length===0 && <div className='alert alert-warning'>
                                        You have not release crysal for this kandoora.
                                    </div>
                                }
                                <table className='table table-striped table-bordered fixTableHead'>
                                    <thead>
                                        {headerFormat.returnCrystalTrackingOut.map((ele, index) => {
                                            return <th className='text-center' key={index}>{ele.name}</th>
                                        })}
                                    </thead>
                                    <tbody>
                                        {returnSelectedTrackingDetail?.crystalTrackingOutDetails?.map((res, index) => {
                                            return <tr key={index}>
                                                {headerFormat.returnCrystalTrackingOut.map((ele, hIndex) => {
                                                    if (ele.prop === "sr")
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{index + 1}</td>
                                                    if (ele.prop === "print") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>
                                                            <div key={(index * 100) + hIndex} onClick={e => deleteCrystalInTrackingList(res.crystalId)}>
                                                                <i className='bi bi-trash text-danger' style={{ cursor: "pointer" }}></i>
                                                            </div>
                                                        </td>
                                                    }
                                                    else if (ele.prop === "usedPieces") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>
                                                            <Inputbox type="number" showLabel={false} name="usedPieces" value={res[ele.prop]} onChangeHandler={e => { returnTextChange(e, index) }} className="form-control-sm" />
                                                        </td>
                                                    }
                                                    else if (ele.prop === "returnDate") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>
                                                            <Inputbox disabled={res.returnPieceQty === 0} type="date" min={new Date(res.releaseDate)} showLabel={false} name={ele.prop} value={res[ele.prop]} onChangeHandler={e => { returnTextChange(e, index) }} className="form-control-sm" /> 
                                                            {returnRequest.returnDate}
                                                        </td>
                                                    }
                                                    else if (ele.prop === "usedPacket") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{res.releasePacketQty - res.returnPacketQty}</td>
                                                    }
                                                    else if (ele.prop === "usedPiece") {
                                                        return <td className='text-center' key={(index * 100) + hIndex}>{res.releasePieceQty - res.usedPieces}</td>
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
                                            <td className='text-center'>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePacketQty
                                            }, 0)}</td>
                                            <td className='text-center'>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePieceQty
                                            }, 0)}</td>
                                             <td className={isReleasePacketGreaterThanRequired() ? "bg-danger text-center" : "text-center"} data-toggle="tooltip" title={isReleasePacketGreaterThanRequired() ? "Release packet is greter than required packet" : ""}>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePacketQty - ele.returnPacketQty
                                            }, 0)}</td>

                                             <td className='text-center'>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.releasePieceQty - ele.returnPieceQty
                                            }, 0)}</td>
                                           <td className='text-center'>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.returnPacketQty
                                            }, 0)}</td>
                                          
                                             <td className='text-center'>{returnSelectedTrackingDetail.crystalTrackingOutDetails?.reduce((sum, ele) => {
                                                return sum += ele.returnPieceQty
                                            }, 0)}</td>
                                            <td className='text-center'></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="update" onClickHandler={handleUpdateReturn} className="btn-sm" />
                            <ButtonBox type="cancel" className="btn-sm" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}
