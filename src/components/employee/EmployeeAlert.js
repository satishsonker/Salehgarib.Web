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
    const [pageSize, setPageSize] = useState(20);
    const [empStatusList, setEmpStatusList] = useState([]);
    const [selectedFilter, setselectedFilter] = useState('all');
    const [selectedEmpStatus, setSelectedEmpStatus] = useState(0);
    const [mainData, setMainData] = useState([])
    const filterData = [{ id: "all", value: "All" },
    { id: "expired", value: "Expired" },
    { id: "about-expired", value: "About to expired" },
    { id: "not-expired", value: "Active" }];
    useEffect(() => {
        Api.Get(apiUrls.masterDataController.getByMasterDataType + '?masterdatatype=employee_status')
            .then(res => {
                setEmpStatusList(res.data);
            })
    }, [])

    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.employeeController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}&filter=${selectedEmpStatus}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }


    const sendAlertEmail = (id, data) => {
        Api.Post(apiUrls.employeeController.alert + id, {})
            .then(res => {
                if (res.data > 0)
                    toast.success(toastMessage.emailSent);
            })
    }
    const tableOptionTemplet = {
        headers: [
            { name: 'First Name', prop: 'firstName', action: { dAlign: 'start' } },
            { name: 'Last Name', prop: 'lastName', action: { dAlign: 'start' } },
            { name: 'Contact', prop: 'contact' },
            { name: 'Email', prop: 'email' },
            { name: 'Job Name', prop: 'jobTitle' },
            // { name: "Labour ID Expiry Date", prop: "labourIdExpire" }, 
            { name: "Emirate Id", prop: "emiratesId" },
            { name: "Emirate Id & VISA Expiry", prop: "emiratesIdExpire" },
            { name: 'Passport Expiry Date', prop: 'passportExpiryDate' },
            { name: 'Work Permit(iqama) Expire', prop: 'workPEDate' },
            // { name: 'Resident Permit Expire', prop: 'residentPDExpire' },
            // { name: 'Medical Expire', prop: 'medicalExpiryDate' },
            { name: 'Daman (Insurance) Expiry', prop: 'damanNoExpire' },
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        changeRowClassHandler: (data, currentProp) => {
            if (["labourIdExpire", "passportExpiryDate", "medicalExpiryDate", "workPEDate", "residentPDExpire", "damanNoExpire", "emiratesIdExpire"].indexOf(currentProp) > -1) {
                if (data[currentProp] !== common.defaultDate) {
                    let date = new Date(data[currentProp]);
                    return checkExpireDate(date, data?.statusName);
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

    const checkExpireDate = (date, empStatus) => {
        let currentDate = new Date();
        let currentDate2 = new Date()
        let nextMonth = new Date(currentDate2.setMonth(currentDate2.getMonth() + 1));
        if (empStatus?.toLowerCase() === selectedFilter)
            return true;
        if (date <= currentDate)
            return selectedFilter === '' || selectedFilter === 'all' || selectedFilter === 'expired' ? 'expired' : '';
        if (date >= currentDate && date <= nextMonth)
            return selectedFilter === '' || selectedFilter === 'all' || selectedFilter === 'about-expired' ? 'about-expired' : '';
        if (date >= nextMonth)
            return selectedFilter === '' || selectedFilter === 'all' || selectedFilter === 'not-expired' ? 'not-expired' : '';

    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Employee Alert',
        items: [
            {
                title: "Employee Details",
                icon: "bi bi-person-badge-fill",
                isActive: false,
            }
        ]
    }

    useEffect(() => {
        Api.Get(apiUrls.employeeController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}&filter=${selectedEmpStatus}`).then(res => {
            var tblData = res.data.data;
            setMainData([...res.data.data])
            if (selectedFilter !== 'all') {
                tblData = filterDocs(tblData, selectedFilter);
            }
            tableOptionTemplet.data = tblData;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [pageNo, pageSize, selectedEmpStatus]);

    useEffect(() => {
        if (selectedFilter === '')
            return;
        let filteredData = filterDocs(mainData, selectedFilter);
        tableOptionTemplet.data = filteredData;
        tableOptionTemplet.totalRecords = filteredData.length;
        setTableOption({ ...tableOptionTemplet });
    }, [selectedFilter])

    const filterHandler = (data) => {
        setselectedFilter(data.target.value);
    }

    const empStatusChange = (e) => {
        debugger;
        setSelectedEmpStatus(parseInt(e.target.value));
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
                if (new Date(res.emiratesIdExpire) <= currDate && res.emiratesIdExpire !== null && res.emiratesIdExpire !== '')
                    newData.push(res);
                else if (new Date(res.passportExpiryDate) <= currDate && res.passportExpiryDate !== null && res.passportExpiryDate !== '')
                    newData.push(res);
                else if (new Date(res.workPEDate) <= currDate && res.workPEDate !== null && res.workPEDate !== '')
                    newData.push(res);
                else if (new Date(res.damanNoExpire) <= currDate && res.damanNoExpire !== null && res.damanNoExpire !== '')
                    newData.push(res);
            }
            if (filter === 'about-expired') {
                debugger;
                var ateDate = new Date();
                let nextMonth = new Date(ateDate.setMonth(ateDate.getMonth() + 1));
                if (new Date(res.emiratesIdExpire) > currDate && new Date(res.emiratesIdExpire) <= nextMonth) {
                    newData.push(res);
                    return;
                }
                if (new Date(res.passportExpiryDate) > currDate && new Date(res.passportExpiryDate) <= nextMonth) {
                    newData.push(res);
                    return;
                }
                else if (new Date(res.workPEDate) > currDate && new Date(res.workPEDate) <= nextMonth) {
                    newData.push(res);
                    return;
                }
                if (new Date(res.damanNoExpire) > currDate && new Date(res.damanNoExpire) <= nextMonth) {
                    newData.push(res);
                    return;
                }
            }
            if (filter === 'not-expired') {
                var nDate = new Date();
                let nextMonth = new Date(nDate.setMonth(nDate.getMonth() + 1));
                if (new Date(res.emiratesIdExpire) > nextMonth)
                    newData.push(res);
                else if (new Date(res.passportExpiryDate) > nextMonth)
                    newData.push(res);
                else if (new Date(res.workPEDate) > nextMonth)
                    newData.push(res);
                else if (new Date(res.damanNoExpire) > nextMonth)
                    newData.push(res);
            }
        });
        return newData;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className='row d-flex' style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                <div className='col-6' style={{ textAlign: 'left' }}>
                    <span className='rect rect-green'>Not Expired</span>
                    <span className='rect rect-yellow'>About To Expired</span>
                    <span className='rect rect-red'>Expired</span>
                </div>
                <div className='col-6 d-flex justify-content-end'>
                    <div className='col-2 mx-2'>
                        Status <Dropdown data={empStatusList} defaultTExt="All" value={selectedEmpStatus} onChange={empStatusChange} className="form-control-sm" />
                    </div>
                    <div className='col-2'>
                        Filter <Dropdown data={filterData} value={selectedFilter} onChange={filterHandler} className="form-control-sm" />
                    </div>
                </div>
            </div>
            <hr />
            <TableView option={tableOption}></TableView>
        </>
    )
}
