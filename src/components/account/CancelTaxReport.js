import React, { useState, useRef } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common'
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox';
import Inputbox from '../common/Inputbox';
import { useReactToPrint } from 'react-to-print';
import CancelTaxTable from './CancelTaxTable';
import { PrintCancelTaxReport } from '../print/admin/account/PrintCancelTaxReport';

export default function CancelTaxReport() {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const CURR_DATE = new Date();
    const [billingData, setBillingData] = useState([])
    const [filterData, setFilterData] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(CURR_DATE.getMonth(), CURR_DATE.getFullYear())),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear()))
    });
    const textChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilterData({ ...filterData, [name]: value });
    }
    const getBillingData = () => {
        Api.Get(apiUrls.reportController.getBillingCancelTaxReport + `?fromDate=${filterData.fromDate}&toDate=${filterData.toDate}`)
            .then(res => {
                setBillingData(res.data);
            });
    }

    const breadcrumbOption = {
        title: 'Cancelled Tax Report',
        items: [
            {
                title: "Report",
                icon: "bi bi-journal-bookmark-fill",
                isActive: false,
            },
            {
                title: "Cancelled Tax Report",
                icon: "bi bi-file-bar-graph",
                isActive: false,
            }
        ]
    }
    const printBillingReportRef = useRef();
    const printBillingReportHandler = useReactToPrint({
        content:()=> printBillingReportRef.current
    })
    const btnList = [
        {
            type: 'Go',
            onClickHandler: getBillingData,
            className: 'btn-sm'
        },
        {
            type: 'Print',
            onClickHandler: printBillingReportHandler,
            className: 'btn-sm'
        }
    ]
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between">
                <h6 className="mb-0 text-uppercase">Cancelled Tax Report</h6>
                <div>
                    <div className='d-flex'>
                        <div><Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={textChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox></div>
                        <div><Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear()))} onChangeHandler={textChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox></div>
                        <div>
                            <ButtonBox btnList={btnList} />
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className='card'>
                <div className='card-body'>
                    <CancelTaxTable billingData={billingData} />
                </div>
            </div>
            <div className='d-none'>
                <PrintCancelTaxReport props={billingData} ref={printBillingReportRef }/>
            </div>
        </>
    )
}
