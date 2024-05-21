import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import TableView from '../tables/TableView';
import ButtonBox from '../common/ButtonBox';
import ReactToPrint from 'react-to-print';
import PrintEmployeeAlertReport from '../print/employee/PrintEmployeeAlertReport';
export default function EmployeeAlert() {
    const printRef = useRef();
    const filterTemplate = {
        empStatus: 0,
        companyId: 0,
        jobTitleId: 0,
        docStatus: ""
    }
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [filter, setFilter] = useState(filterTemplate);
    const [empStatusList, setEmpStatusList] = useState([]);
    const [jobTitleList, setJobTitleList] = useState();
    const [companyList, setCompanyList] = useState([]);
    const [selectedFilter, setselectedFilter] = useState('all');
    const [mainData, setMainData] = useState([])
    const filterData = [{ id: "all", value: "All" },
    { id: "expired", value: "Expired" },
    { id: "about-expired", value: "About to expired" },
    { id: "not-expired", value: "Active" }];

    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.employeeController.getAlert + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
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
            { name: 'Status', prop: 'empStatusName' },
            { name: "Company", prop: "companyName" },
            { name: "Emirate Id", prop: "emiratesId" },
            { name: "Emirate Id & VISA Expiry", prop: "emiratesIdExpire" },
            { name: 'Passport Expiry Date', prop: 'passportExpiryDate' },
            { name: 'Work Permit(iqama) Expiry', prop: 'workPEDate' },
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

    const textChangeHandler = (e) => {
        var { type, name, value } = e.target;
        var data = filter;
        if (type === 'select-one' && name !== 'docStatus') {
            value = parseInt(value);
        }
        setFilter({ ...data, [name]: value });
    }
    useEffect(() => {
        var apiList = []
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + "?masterDataTypes=saleh_company&masterDataTypes=employee_status"));
        apiList.push(Api.Get(apiUrls.masterController.jobTitle.getAll + "?pageNo=1&pageSize=10000"));
        Api.MultiCall(apiList)
            .then(res => {
                setEmpStatusList(res[0].data.filter(x => x.masterDataTypeCode === "employee_status"));
                setCompanyList(res[0].data.filter(x => x.masterDataTypeCode === "saleh_company"));
                setJobTitleList(res[1].data.data);
            })
    }, []);


    useEffect(() => {
        Api.Get(apiUrls.employeeController.getAlert + `?PageNo=${pageNo}&PageSize=${pageSize}&empStatusId=${filter.empStatus}&companyId=${filter.companyId}&jobTitleId=${filter.jobTitleId}`).then(res => {
            var tblData = res.data.data;
            setMainData([...res.data.data])
            if (selectedFilter !== 'all') {
                tblData = filterDocs(tblData, selectedFilter);
            }
            tableOptionTemplet.data = tblData;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [pageNo, pageSize, filter, selectedFilter]);

    useEffect(() => {
        if (selectedFilter === '')
            return;
        let filteredData = filterDocs(mainData, selectedFilter);
        tableOptionTemplet.data = filteredData;
        tableOptionTemplet.totalRecords = filteredData.length;
        setTableOption({ ...tableOptionTemplet });
    }, [filter.docStatus])

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

    const getFilterType = (type) => {
        var filterApplied;
        if (type === 'company') {
            if (filter.companyId === 0)
                return "All"
            else {
                filterApplied = companyList.find(x => x.id === filter.companyId);
                if (filterApplied === undefined)
                    return "All";
                else
                    return filterApplied.value;
            }
        }
        if (type === 'empStatus') {
            if (filter.empStatus === 0)
                return "All"
            else {
                filterApplied = empStatusList.find(x => x.id === filter.empStatus);
                if (filterApplied === undefined)
                    return "All";
                else
                    return filterApplied.value;
            }
        }
        if (type === 'jobTitle') {
            if (filter.jobTitleId === 0)
                return "All"
            else {
                filterApplied = jobTitleList.find(x => x.id === filter.jobTitleId);
                if (filterApplied === undefined)
                    return "All";
                else
                    return filterApplied.value;
            }
        }
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className='row d-flex' style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                {/* <div className='col-3' style={{ textAlign: 'left' }}>
                    <span className='rect rect-green'>Not Expired</span>
                    <span className='rect rect-yellow'>About To Expired</span>
                    <span className='rect rect-red'>Expired</span>
                </div> */}
                <div className='d-flex justify-content-end'>
                    <div className='mx-2'>
                        Company <Dropdown data={companyList} defaultText="All" name="companyId" value={filter.companyId} onChange={textChangeHandler} className="form-control-sm" />
                    </div>
                    <div className='mx-1'>
                        Job Title <Dropdown data={jobTitleList} defaultText="All" value={filter.jobTitleId} onChange={textChangeHandler} name="jobTitleId" className="form-control-sm" />
                    </div>
                    <div className='mx-1'>
                        Emp Status <Dropdown data={empStatusList} defaultText="All" value={filter.empStatus} onChange={textChangeHandler} name="empStatus" className="form-control-sm" />
                    </div>
                    <div className='mx-1'>
                        Doc Status <Dropdown data={filterData} value={selectedFilter} onChange={filterHandler} className="form-control-sm" />
                    </div>
                    <div className='mx-1 py-4'>
                        <ButtonBox type="reset" className="btn-sm" onClickHandler={e => { setFilter(filterTemplate); setselectedFilter("all") }} />
                    </div>
                    <div className='mx-1 py-4'>
                        <ReactToPrint
                            trigger={() => {
                                return <button className='btn btn-sm btn-warning mx-2'><i className='bi bi-printer'></i> Print</button>
                            }}
                            content={(el) => (printRef.current)}
                        />
                    </div>
                </div>
            </div>
            <hr />
            <TableView option={tableOption}></TableView>
            <div className='d-none'>
            <PrintEmployeeAlertReport printRef={printRef} tableOption={tableOption} company={ getFilterType('company')} EmpStatus={getFilterType('empStatus')} JobTitle={getFilterType('jobTitle')}/>
            </div>
        </>
    )
}
