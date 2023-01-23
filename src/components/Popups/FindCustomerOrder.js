import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import TableView from '../tables/TableView'

export default function FindCustomerOrder() {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const [viewOrderData, setViewOrderData] = useState(0);
    const [orderNoOfSelectedContact, setOrderNoOfSelectedContact] = useState({})
    const viewOderDetailsHandler = (id, data) => {
        var orderDetails=data?.orderDetails;
        orderDetails.forEach(res=>{
            res.vatAmount=common.calculatePercent(res.price,VAT);
        })
        setViewOrderData(orderDetails);
        var filterData = searchWithFilter;
        filterData.selectOrderNo = data?.orderNo;
        filterData.selectedContactNo = data?.contact1?.replace('+', "");
    }
    const tableOptionSearchFilterTemplet = {
        headers: headerFormat.searchFilterOrder,
        data: [],
        totalRecords: 0,
        actions: {
            showEdit: false,
            showDelete: false,
            view: {
                handler: viewOderDetailsHandler
            }
        },
        showAction: true,
        showFooter: true,
        showTableTop: false,
        showPagination: true
    }
    const tableDetailsOptionSearchFilterTemplet = {
        headers: headerFormat.orderDetails,
        showFooter: false,
        data: [],
        totalRecords: 0,
        showAction: false,
        showTableTop: false
    }
    const [searchWithFilter, setSearchWithFilter] = useState({
        fromDate: common.getHtmlDate(new Date().setFullYear(new Date().getFullYear() - 10)),
        toDate: common.getHtmlDate(new Date()),
        searchTerm: '',
        selectOrderNo: '0',
        selectedContactNo: ''
    });
    useEffect(() => {
        tableDetailsOptionSearchFilterTemplet.data = viewOrderData;
        setTableDetailsOptionSearchFilter({ ...tableDetailsOptionSearchFilterTemplet });
    }, [viewOrderData])

    const [tableOptionSearchFilter, setTableOptionSearchFilter] = useState(tableOptionSearchFilterTemplet);
    const [tableDetailsOptionSearchFilter, setTableDetailsOptionSearchFilter] = useState(tableDetailsOptionSearchFilterTemplet);
    const searchFilterButtonHandler = (keyword) => {
        keyword=keyword===undefined?searchWithFilter.searchTerm:keyword;
        Api.Get(apiUrls.orderController.searchWithFilterOrders + `?fromDate=${searchWithFilter.fromDate}&toDate=${searchWithFilter.toDate}&searchTerm=${keyword.replace('+', "")}`)
            .then(res => {
                tableOptionSearchFilterTemplet.data = res.data.data;
                tableOptionSearchFilterTemplet.data.forEach(ele => {
                    ele.vatAmount = common.calculateVAT(ele.subTotalAmount, VAT).vatAmount;
                })
                tableOptionSearchFilterTemplet.totalRecords = res.data.totalRecords;
                setTableOptionSearchFilter(tableOptionSearchFilterTemplet);
                setViewOrderData([]);
            })
    }
    const searchWithFilterTextChange = (e) => {
        let { name, value } = e.target;
        setSearchWithFilter({ ...searchWithFilter, [name]: value });
    }

    useEffect(() => {
        Api.Get(apiUrls.orderController.getByOrderNoByContact + searchWithFilter.selectedContactNo)
            .then(res => {
                setOrderNoOfSelectedContact(res.data);
            })
    }, [searchWithFilter.selectedContactNo])


    return (
        <>
            <div id="find-customer-order" className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Search Orders</h5>
                            <button type="button" className="btn-close" id='closePopupCustomerOrderCreate' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className='model-body m-2'>
                            <div className='card mb-0'>
                                <div className='card-body py-1'>
                                    <div className='row'>
                                        <div className='col-11'>
                                            <input type="text" className="form-control form-control-sm" placeholder='Search by contact,order no., name, status etc.' onChange={e => searchWithFilterTextChange(e)} name="searchTerm" value={searchWithFilter.searchTerm} />
                                            <span style={{ fontSize: '9px' }} className="text-danger">Do not include + sign while search from contact number</span>
                                        </div>
                                        {/* <div className='col-2'>
                                            <input type="date" className="form-control form-control-sm" name='fromDate' max={searchWithFilter.toDate} value={searchWithFilter.fromDate} onChange={e => searchWithFilterTextChange(e)} />
                                        </div>
                                        <div className='col-2'>
                                            <input type="date" className="form-control form-control-sm" min={searchWithFilter.fromDate} value={searchWithFilter.toDate} onChange={e => searchWithFilterTextChange(e)} name="toDate" />
                                        </div> */}
                                        <div className='col-1 text-end'>
                                            <button type="submit" className="btn btn-sm btn-success mb-2" onClick={e => searchFilterButtonHandler()}><i className='bi bi-search'></i> Go</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='card py-1'>

                                <div className='card-body py-1'>
                                    <div className='row'>
                                        <div className='col-12 text-end' style={{ fontSize: '11px' }}>
                                            <i className={common.orderStatusIcon.processing}> Processing </i>
                                            <i className={common.orderStatusIcon.completed}> Completed </i>
                                            <i className={common.orderStatusIcon.partiallyDelivered}> Partial Delivered </i>
                                            <i className={common.orderStatusIcon.delivered}> Delivered </i>
                                        </div>
                                        <div className='col-12 py-1'>
                                            <TableView option={tableOptionSearchFilter}></TableView>
                                        </div>
                                        {viewOrderData.length > 0 && <>
                                            <div className='col-12 py-1'>
                                                <div className='col-12'>
                                                    <strong>Details of order no. {searchWithFilter.selectOrderNo}</strong>
                                                </div>
                                                <TableView option={tableDetailsOptionSearchFilter}></TableView>
                                            </div>
                                        </>}

                                        {orderNoOfSelectedContact.length > 0 && <>
                                            <div className='col-12 py-1'>
                                                <div className='col-12'>
                                                    <strong>Total {orderNoOfSelectedContact.length} placed by selected custome (+{searchWithFilter.selectedContactNo})</strong>

                                                </div>
                                                <div className='col-12 d-flex justify-content-start mt-2'>
                                                    {orderNoOfSelectedContact?.map(res => {
                                                        return <div onClick={e=>searchFilterButtonHandler(res.orderNo)} title='Click on order no. to view details' className='onum'>{res.orderNo}</div>
                                                    })}
                                                </div>
                                            </div>
                                        </>}

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
