import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import TableView from '../tables/TableView';
export default function EmployeeAlert() {
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedFilter, setselectedFilter] = useState('');
    const filterData = [{ id: "all", value: "All" }, { id: "expired", value: "Expired" }, { id: "about-expired", value: "About to expired" }, { id: "not-expired", value: "Active" }]
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


    const sendAlertEmail = (id, data) => {
        debugger;
        Api.Post(apiUrls.employeeController.alert + id, {})
            .then(res => {
                if (res.data > 0)
                    toast.success(toastMessage.emailSent);
            })
    }
    const tableOptionTemplet = {
        headers: [
            { name: 'First Name', prop: 'firstName' },
            { name: 'Last Name', prop: 'lastName' },
            { name: 'Contact', prop: 'contact' },
            { name: 'Email', prop: 'email' },
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
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        changeRowClassHandler: (data, currentProp) => {
            if (["labourIdExpire", "passportExpiryDate", "medicalExpiryDate", "workPEDate", "residentPDExpire"].indexOf(currentProp) > -1) {
                if (data[currentProp] !== common.defaultDate) {
                    let date = new Date(data[currentProp]);
                    return checkExpireDate(date);
                }
            }
        },
        actions: {
            showView: false,
            showEdit: false,
            showDelete: false,
            buttons: [
                {
                    title: "Send Email",
                    handler: sendAlertEmail,
                    icon: "bi bi-envelope",
                    showModel: false,
                    className: 'text-success'
                },
                {
                    title: "Send SMS",
                    handler: () => { },
                    icon: "bi bi-chat-right-text",
                    showModel: false,
                    className: 'text-warning'
                }
            ]
        }
    };

    const checkExpireDate = (date) => {
        let currentDate = new Date();
        let currentDate2 = new Date()
        let nextMonth = new Date(currentDate2.setMonth(currentDate2.getMonth() + 1));
        if (date <= currentDate)
            return selectedFilter==='' || selectedFilter==='all' || selectedFilter==='expired'?'expired':'';
        if (date >= currentDate && date <= nextMonth)
        return selectedFilter==='' || selectedFilter==='all' || selectedFilter==='about-expired'?'about-expired':'';
        if (date >= nextMonth)
            return selectedFilter==='' || selectedFilter==='all' || selectedFilter==='not-expired'?'not-expired':'';

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

    useEffect(() => {
        if(selectedFilter==='')
        return;
        Api.Get(apiUrls.employeeController.getAll + `?PageNo=${1}&PageSize=${1000000}`).then(res => {
            let filteredData = filterDocs(res.data.data, selectedFilter);
            tableOptionTemplet.data = filteredData;
            tableOptionTemplet.totalRecords = filteredData.length;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [selectedFilter])

    const filterHandler = (data) => {
        setselectedFilter(data.target.value);
    }

    const filterDocs = (data, filter) => {
        if (!data)
            return [];
        if (filter === 'all')
            return data;
        let newData = [];
        data.forEach(res => {
            let currDate = new Date();
            if (filter === 'expired') {
                if (new Date(res.labourIdExpire) <= currDate)
                    newData.push(res);
                else if (new Date(res.passportExpiryDate) <= currDate)
                    newData.push(res);
                else if (new Date(res.workPEDate) <= currDate)
                    newData.push(res);
                else if (new Date(res.residentPDExpire) <= currDate)
                    newData.push(res);
                else if (new Date(res.medicalExpiryDate) <= currDate)
                    newData.push(res);
            }
            if (filter === 'about-expired') {
                let nextMonth = new Date(currDate.setMonth(currDate.getMonth() + 1));
                if (new Date(res.labourIdExpire) > currDate && new Date(res.labourIdExpire) <= nextMonth)
                    newData.push(res);
                else if (new Date(res.passportExpiryDate) > currDate && new Date(res.passportExpiryDate) <= nextMonth)
                    newData.push(res);
                else if (new Date(res.workPEDate) > currDate && new Date(res.workPEDate) <= nextMonth)
                    newData.push(res);
                else if (new Date(res.residentPDExpire) > currDate && new Date(res.residentPDExpire) <= nextMonth)
                    newData.push(res);
                else if (new Date(res.medicalExpiryDate) > currDate && new Date(res.medicalExpiryDate) <= nextMonth)
                    newData.push(res);
            }
            if (filter === 'not-expired') {
                let nextMonth = new Date(currDate.setMonth(currDate.getMonth() + 1));
                if (new Date(res.labourIdExpire) > currDate)
                    newData.push(res);
                else if (new Date(res.passportExpiryDate) > currDate)
                    newData.push(res);
                else if (new Date(res.workPEDate) > currDate)
                    newData.push(res);
                else if (new Date(res.residentPDExpire) > currDate)
                    newData.push(res);
                else if (new Date(res.medicalExpiryDate) > currDate)
                    newData.push(res);
            }
        });
        return newData;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Employee Alerts</h6>
            <div className='row'>
                <div className='col-10' style={{ textAlign: 'left' }}>
                    <span className='rect rect-green'>Not Expired</span>
                    <span className='rect rect-yellow'>About To Expired</span>
                    <span className='rect rect-red'>Expired</span>
                </div>
                <div className='col-2'>
                    Filter <Dropdown data={filterData} value={selectedFilter} onChange={filterHandler} className="form-control-sm" />
                </div>
            </div>
            <hr />
            <TableView option={tableOption}></TableView>
        </>
    )
}
