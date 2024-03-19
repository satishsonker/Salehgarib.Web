import React from 'react'
import { common } from '../../../../utils/common';
import { headerFormat } from '../../../../utils/tableHeaderFormat';
import InvoiceHead from '../../../common/InvoiceHead'
import Label from '../../../common/Label';

export const PrintDailyWorkStatement = React.forwardRef((props, ref) => {
    if (props == undefined || props?.data?.length === 0 || props.workTypeCode === "")
        return;
    const workTypeCode = props?.workTypeCode;
    const calculate = () => {
        var obj = {
            totalQty: props?.data?.length,
            totalAmount: 0,
            avgAmount: 0
        }
        obj.totalAmount = props?.data?.reduce((sum, ele) => {
            return sum += ele.amount;
        }, 0);
        obj.avgAmount = obj.totalAmount / obj.totalQty;
        return obj;
    };

    const calculateSum = (prop) => {
        console.table(props.data);
        if (props.data.length === 0)
            return 0;
        if (prop === 'packet') {
            return props.data?.reduce((sum, ele) => {
                return sum += ele?.releasePackets
            }, 0);
        }
        else if (prop === 'count') {
            return props.data?.length;
        }
        else if (prop === 'piece') {
            return props.data?.reduce((sum, ele) => {
                return sum += ele?.crystalUsed
            }, 0);
        }
        else if (prop === 'crystalAmount') {
            return props.data?.reduce((sum, ele) => {
                return sum += ele?.amount
            }, 0);
        }
        else if (prop === 'requiredPacket') {
            return props.data?.reduce((sum, ele) => {
                return sum += ele?.requiredPackets
            }, 0);
        }
        return props.data?.reduce((sum, ele) => {
            return sum += ele[prop];
        }, 0);
    }

    const headers = workTypeCode !== "4" ? headerFormat.dailyWorkStatement : headerFormat.crystalDailyWorkStatement;
    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Daily Work Statement Report'></InvoiceHead>
            <div className='card'>
                <div className='card-body'>
                    <div className='d-flex justify-content-between'>
                    <strong>Work Type : {common.workType[workTypeCode]}</strong>
                            <strong>Report For : {props.filterData?.fromDate} - {props.filterData?.toDate}</strong>
                            <strong>Print On : {common.getHtmlDate(new Date(),"ddmmyyyy")}</strong>
                    </div>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                {headers?.map((ele, index) => {
                                    return <th key={index} className='text-center'>{ele?.name}</th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                workTypeCode !== "4" && props.data?.map((res, index) => {
                                    return <tr key={index}>
                                        {headers?.map((hEle, hIndex) => {
                                            if(hEle?.prop.indexOf('amount')>-1)
                                            return <td key={hIndex} className='text-end'>{common.printDecimal(res[hEle?.prop])}</td>
                                            else
                                            return <td key={hIndex} className='text-start'>{hEle?.prop.indexOf('date') > -1 ? common.getHtmlDate(res[hEle?.prop]) : res[hEle?.prop]}</td>
                                        })}
                                    </tr>
                                })
                            }
                            {
                                workTypeCode === "4" && props.data?.map((res, index) => {
                                    return <tr key={index}>
                                        <td className='text-center'>{res?.employeeId}</td>
                                        <td className='text-start'>{res?.employeeName}</td>
                                        <td className='text-center'>{res?.orderNo}</td>
                                        <td className='text-center'>{common.getHtmlDate(res?.date,'ddmmyyyy')}</td>
                                        <td className='text-center'>{res?.crystalUsed}</td>
                                        <td className='text-center'>{common.printDecimal(res?.requiredPackets)}</td>
                                        <td className='text-center'>{common.printDecimal(res?.releasePackets)}</td>
                                        <td className='text-center'>{common.printDecimal(res?.amount)}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    {workTypeCode !== "4" && <div className='row'>
                        <div className='col-10 text-end'>
                            <Label text="Total Qty"></Label>
                        </div>
                        <div className='col-2 text-end'>
                            <Label bold={true} text={props?.data?.length}></Label>
                        </div>
                        <div className='col-10 text-end'>
                            <Label text="Total Amount"></Label>
                        </div>
                        <div className='col-2 text-end'>
                            <Label bold={true} text={common.printDecimal(calculate()?.totalAmount)}></Label>
                        </div>
                        <div className='col-10 text-end'>
                            <Label text="Avg Amount"></Label>
                        </div>
                        <div className='col-2 text-end'>
                            <Label bold={true} text={common.printDecimal(calculate()?.avgAmount)}></Label>
                        </div>
                    </div>
                    }
                     {workTypeCode === "4" && <div className='row'>
                            <div className='col-2'>
                                <div className='labelAmount'>
                                    <span className='text'>Total Qty</span>
                                    <span className='amount'>{props.data.length}</span>
                                </div>
                            </div>
                            <div className='col-2'>
                                <div className='labelAmount'>
                                    <span className='text'>Crystal Used</span>
                                    <span className='amount'>{calculateSum("crystalUsed")}</span>
                                </div>
                            </div>
                            <div className='col-2'>
                                <div className='labelAmount'>
                                    <span className='text'>Required Packet</span>
                                    <span className='amount'>{common.printDecimal(calculateSum('requiredPacket'))}</span>
                                </div>
                            </div>
                            <div className='col-2'>
                                <div className='labelAmount'>
                                    <span className='text'>Total Packet</span>
                                    <span className='amount'>{common.printDecimal(calculateSum('packet'))}</span>
                                </div>
                            </div>
                            <div className='col-2'>
                            <div className='labelAmount'>
                                    <span className='text'>Total Amount</span>
                                    <span className='amount'>{common.printDecimal(calculateSum('crystalAmount'))}</span>
                                </div>
                                </div>
                            <div className='col-2'>
                            <div className='labelAmount'>
                                    <span className='text'>Avg. Amount</span>
                                    <span className='amount'>{common.printDecimal(calculateSum('crystalAmount') / calculateSum("count"))}</span>
                                </div>
                                </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
});
