import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import RegexFormat from '../../utils/RegexFormat';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';
export default function EmployeeAlert() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.employeeController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const tableOptionTemplet = {
        headers: [
            { name: 'First Name', prop: 'firstName' },
            { name: 'Last Name', prop: 'lastName' },
            { name: 'Contact', prop: 'contact' },
            { name: 'Job Name', prop: 'jobTitle' },
            { name: "Labour ID Expiry Date", prop: "labourIdExpire" },
            { name: 'Passport Expiry Date', prop: 'passportExpiryDate' },
            { name: 'Work Permit Expire', prop: 'workPEDate' },
            { name: 'Resident Permit Expire', prop: 'residentPDExpire' },
            { name: 'Medical Expire', prop: 'medicalExpiryDate' },
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        showAction: false,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        changeRowClassHandler: (data, currentProp) => {
            if (["labourIdExpire", "passportExpiryDate", "medicalExpiryDate","workPEDate","residentPDExpire"].indexOf(currentProp) > -1) {
                if (data[currentProp] !== common.defaultDate) {
                    let date = new Date(data[currentProp]);
                    return checkExpireDate(date);
                }
            }
        }
    };
    const checkExpireDate = (date) => {
        let currentDate = new Date();
        let currentDate2=new Date()
        let nextMonth = new Date(currentDate2.setMonth(currentDate2.getMonth() + 1));
        if (date <= currentDate)
            return "expired"
        if (date >= currentDate && date <= nextMonth)
            return "about-expired"
        if (date >= nextMonth)
            return "not-expired"

    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Employees',
        items: [
            {
                title: "Employee Details",
                icon: "bi bi-person-badge-fill",
                isActive: false,
            }
        ]
    }

    useEffect(() => {
        Api.Get(apiUrls.employeeController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Employee Alerts</h6>
            <div className='row'>
                                                    <div className='col-2'>
                                                        <h6 className="mb-0 text-uppercase"></h6>
                                                    </div>
                                                    <div className='col-10' style={{ textAlign: 'right' }}>
                                                       <span className='rect rect-green'>Not Expired</span> 
                                                       <span className='rect rect-yellow'>About To Expired</span> 
                                                       <span className='rect rect-red'>Expired</span> 
                                                    </div>
                                                </div>
            <hr />
            <TableView option={tableOption}></TableView>
        </>
    )
}
