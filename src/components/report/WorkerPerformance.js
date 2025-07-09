import React, { useEffect, useState } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import Inputbox from '../common/Inputbox';
import TableView from '../tables/TableView';
import { headerFormat } from '../../utils/tableHeaderFormat';
import ButtonBox from '../common/ButtonBox';

export default function WorkerPerformance() {
    const filterModelTemplate = {
        workType: 22,
        fromDate:common.getHtmlDate(common.getFirstDateOfMonth(new Date())),
        toDate:common.getHtmlDate(common.getLastDateOfMonth(new Date()))
    };
    const [filterModel, setFilterModel] = useState(filterModelTemplate)
    const [reportData, setReportData] = useState([]);
    const [workType, setWorkType] = useState([]);
    const [fetchData, setFetchData] = useState(0);


    useEffect(() => {
        Api.Get(apiUrls.masterDataController.getByMasterDataType + `?masterDataType=work_type`).then(res => {
            setWorkType(res.data);
        });
    }, []);

    const fetchDataHandler = () => {
        setFetchData(fetchData + 1);
    }

    useEffect(() => {
        if (filterModel.workType === 0)
            return;
        Api.Get(apiUrls.reportController.getWorkerPerformance + `${filterModel.workType}&fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`)
            .then(res => {
                var data = res.data;
                data.forEach(element => {
                    element.avgAmount = element?.avgAmount?.toFixed(2);
                });
                tableOptionTemplet.data = res?.data;
                tableOptionTemplet.totalRecords = res?.data?.length;
                setTableOption({ ...tableOptionTemplet });
                setReportData(res.data);
            });
    }, [fetchData]);

    const breadcrumbOption = {
        title: 'Worker Performance',
        items: [
            {
                title: "Report",
                icon: "bi bi-clipboard-data",
                isActive: false,
            },
            {
                title: "Report",
                icon: "bi bi-file-bar-graph",
                isActive: false,
            }
        ]
    }

    const handleTextChange = (e) => {
        var { type, name, value } = e.target;
        let data = filterModel;
        if (type === 'select-one') {
            value = parseInt(value);
        }

        data[name] = value;
        setFilterModel({ ...data });
    }
    const tableOptionTemplet = {
        headers: headerFormat.workerPerformance,
        data: [],
        totalRecords: 0,
        showPagination: false,
        showAction: false
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex flex-row-reverse">
                <div className="p-2">
                    <ButtonBox type="go" className="btn-sm" onClickHandler={fetchDataHandler} />
                </div>
                <div className="p-2">
                    <Inputbox type="date" showLabel={false} name="toDate" value={filterModel.toDate} onChangeHandler={handleTextChange} className=" form-control-sm" />
                </div>
                <div className="p-2">
                    <Inputbox type="date" showLabel={false} name="fromDate" value={filterModel.fromDate} onChangeHandler={handleTextChange} className="form-control-sm" />
                </div>
                <div className="p-2">
                    <Dropdown onChange={handleTextChange} data={workType} name="workType" value={filterModel.workType} className="form-control form-control-sm" />
                </div>
            </div>
            <TableView option={tableOption}></TableView>
            {/* <div className='card'>
                <div className='card-body'>
                    <BarChart
                        width={900}
                        height={300}
                        data={reportData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis dataKey="amount"/>
                        <XAxis dataKey="workerName" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" label="Amount" stackId="a" fill="#8884d8" />
                        <Bar dataKey="avgAmount" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="qty" stackId="a" fill="#ea6323" />
                    </BarChart>
                </div>
            </div> 
            */}
        </>
    )
}
