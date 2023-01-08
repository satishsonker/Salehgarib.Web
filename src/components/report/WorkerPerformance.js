import React, { useEffect, useState } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import Inputbox from '../common/Inputbox';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

export default function WorkerPerformance() {
    const filterModelTemplate = {
        workType: 22,
        fromDate: common.getHtmlDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1))),
        toDate: common.getHtmlDate(new Date())
    };
    const [filterModel, setFilterModel] = useState(filterModelTemplate)
    const [reportData, setReportData] = useState([]);
    const [workType, setWorkType] = useState([])


    useEffect(() => {
        Api.Get(apiUrls.masterDataController.getByMasterDataType + `?masterDataType=work_type`).then(res => {
            setWorkType(res.data);
        });
    }, []);

    useEffect(() => {
        if(filterModel.workType===0)
        return;
        Api.Get(apiUrls.reportController.getWorkerPerformance + `${filterModel.workType}&fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`)
            .then(res => {
                setReportData(res.data);
            });
    }, [filterModel]);

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

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex flex-row-reverse">

                <div className="p-2">
                    <Inputbox type="date" showLabel={false} name="toDate" value={filterModel.toDate} onChangeHandler={handleTextChange} className=" form-control-sm" />
                </div>
                <div className="p-2">
                    <Inputbox type="date" showLabel={false} name="fromDate" value={filterModel.fromDate} onChangeHandler={handleTextChange} className="form-control-sm" />
                </div>
                <div className="p-2">
                    <Dropdown onChange={handleTextChange} data={workType} name="workType" value={filterModel.workType} className="form-control form-control-sm" />
                </div>

            </div> <div className='card'>
                <div className='card-body'>
                    <BarChart
                        width={500}
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
                        <XAxis dataKey="workerName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" label="Amount" stackId="a" fill="#8884d8" />
                        <Bar dataKey="avgAmount" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="qty" stackId="a" fill="#ea6323" />
                    </BarChart>
                </div>
            </div>
        </>
    )
}
