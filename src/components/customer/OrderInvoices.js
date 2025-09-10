import ReactToPrint from 'react-to-print';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import Inputbox from '../common/Inputbox';
import TableView from '../tables/TableView'
import { useReactToPrint } from 'react-to-print';
import { useState, useRef, useEffect } from 'react';
import PrintOrderInvoice from '../print/orders/PrintOrderInvoice';
export default function OrderInvoices() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const printRef = useRef();
    const [printInvoiceNumber, setPrintInvoiceNumber] = useState(0);
    const [invoiceTypeList, setInvoiceTypeList] = useState([]);
    const CURR_DATE = new Date();
    const [filterData, setFilterData] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(CURR_DATE.getMonth(), CURR_DATE.getFullYear())),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear())),
        invoiceType: 'All'
    });
    const breadcrumbOption = {
        title: 'Order Invoices',
        items: [
            {
                link: "/customers",
                title: "Customers",
                icon: "bi bi-person-bounding-box"
            },
            {
                isActive: false,
                title: "Order Invoices",
                icon: "bi bi-receipt"
            }
        ]
    }

    const handleSearch = (searchTerm) => {
        if (searchTerm !== null && searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.taxInvoiceController.searchTaxInvoice + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${common.contactNoEncoder(searchTerm)}&fromDate=${filterData.fromDate}&toDate=${filterData.toDate}&invoiceType=${filterData.invoiceType}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            })
    }

    const printOrderAdvanceReceiptHandlerMain = (id, data) => {
        setPrintInvoiceNumber(data?.taxInvoiceNumber);
        if (printRef.current) {
            printRef.current.print();
        }
    }

    const tableOptionTemplet = {
        headers: headerFormat.orderInvoices,
        showTableTop: true,
        showFooter: true,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showEdit: false,
            showDelete: false,
            showView: false,
            showPrint: true,
            print: {
                handler: printOrderAdvanceReceiptHandlerMain
            }
        }
    }

    const textChangeHandler = (e) => {
        var { name, type, value } = e.target;
        if (type === 'radio') {
            setFilterData({ ...filterData, ['paymentMode']: value });
        } else {
            setFilterData({ ...filterData, [name]: value });
        }
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    useEffect(() => {
        Api.Get(apiUrls.taxInvoiceController.getTaxInvoiceTypes, {})
            .then(res => {
                var data = res.data?.filter(x => x.indexOf('Paid') >= 0 || x.indexOf('Received') >= 0) || []
                data?.sort();
                data = ['All', ...data];
                let dropDronData = common.dropdownArray(data, false);
                setInvoiceTypeList([...dropDronData]);
            });
    }, [])
    const getAllDataHandler = () => {
        handleSearch(null);
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className='d-flex justify-content-end'>
                <div className='mx-2'>
                    <span>Invoice Type</span>
                    <Dropdown title="invoice Type" showDefault={false} data={invoiceTypeList} onChange={textChangeHandler} name="invoiceType" value={filterData.invoiceType} className="form-control-sm" showLabel={false}></Dropdown>
                </div>
                <div className='mx-2'>
                    <span> From Date</span>
                    <Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={textChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                </div>
                <div className='mx-2'>
                    <span> To Date</span>
                    <Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear()))} onChangeHandler={textChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                </div>
                <div className='mx-2' style={{ marginTop: '20px' }}>
                    <ButtonBox type="go" className="btn-sm" onClickHandler={getAllDataHandler} />
                    <ReactToPrint
                        trigger={() => {
                            return <button className='btn btn-sm btn-warning mx-2'><i className='bi bi-printer'></i> Print</button>
                        }}
                        content={(el) => (printRef.current)}
                    />
                </div>
            </div>
            <hr />
            <TableView option={tableOption}></TableView>
            <div className='d-none'>
                <PrintOrderInvoice invoiceNumber={printInvoiceNumber} ref={printRef} />
            </div>
        </>
    )
}
