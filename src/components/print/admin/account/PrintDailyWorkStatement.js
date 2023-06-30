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
        if (props?.data.length === 0)
            return 0;
            if(prop==='packet')
            {
                return props?.data?.reduce((sum, ele) => {
                    return sum += ele?.crystalTrackingOutDetails?.reduce((sum1, ele1) => {
                        return sum1 += ele1?.releasePacketQty;
                    }, 0)
                }, 0);
            }
            else  if(prop==='piece')
            {
                return props?.data?.reduce((sum, ele) => {
                    return sum += ele?.crystalTrackingOutDetails?.reduce((sum1, ele1) => {
                        return sum1 += ele1?.releasePieceQty;
                    }, 0)
                }, 0);
            }
            else  if(prop==='crystalAmount')
            {
                return props?.data?.reduce((sum, ele) => {
                    return sum += ele?.crystalTrackingOutDetails?.reduce((sum1, ele1) => {
                        return sum1 += (ele1?.articalLabourCharge+ele1.crystalLabourCharge);
                    }, 0)
                }, 0);
            }
        return props?.data?.reduce((sum, ele) => {
            return sum += ele[prop];
        }, 0);
    }

    const headers = workTypeCode !== "4" ? headerFormat.dailyWorkStatement : headerFormat.crystalDailyWorkStatement;
    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Daily Work Statement Report'></InvoiceHead>
            <div className='card'>
                <div className='card-body'>
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
                                            return <td key={hIndex} className='text-center'>{hEle?.prop.indexOf('date') > -1 ? common.getHtmlDate(res[hEle?.prop]) : res[hEle?.prop]}</td>
                                        })}
                                    </tr>
                                })
                            }
                            {
                                workTypeCode === "4" && props.data?.map((res, index) => {
                                    return <tr key={index}>
                                        <td className='text-center'>{res?.employeeId}</td>
                                        <td className='text-center'>{res?.employeeName}</td>
                                        <td className='text-center'>{res?.orderNo}</td>
                                        <td className='text-center'>{common.getHtmlDate(res?.releaseDate)}</td>
                                        <td className='text-center'>{res?.crystalTrackingOutDetails?.reduce((sum1, ele1) => {
                                            return sum1 += (ele1?.releasePieceQty);
                                        }, 0)}</td>
                                        <td className='text-center'>{common.printDecimal(res?.crystalTrackingOutDetails?.reduce((sum1, ele1) => {
                                            return sum1 += (ele1?.releasePacketQty);
                                        }, 0))}</td>
                                        <td className='text-center'>{common.printDecimal(res?.crystalTrackingOutDetails?.reduce((sum1, ele1) => {
                                            return sum1 += (ele1?.articalLabourCharge + ele1.crystalLabourCharge);
                                        }, 0))}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    {workTypeCode !== "4" && <div className='row'>
                        <div className='col-11 text-end'>
                            <Label text="Total Qty"></Label>
                        </div>
                        <div className='col-1 text-end'>
                            <Label bold={true} text={props?.data?.length}></Label>
                        </div>
                        <div className='col-11 text-end'>
                            <Label text="Total Amount"></Label>
                        </div>
                        <div className='col-1 text-end'>
                            <Label bold={true} text={common.printDecimal(calculate()?.totalAmount)}></Label>
                        </div>
                        <div className='col-11 text-end'>
                            <Label text="Avg Amount"></Label>
                        </div>
                        <div className='col-1 text-end'>
                            <Label bold={true} text={common.printDecimal(calculate()?.avgAmount)}></Label>
                        </div>
                    </div>
                    }
                     {workTypeCode === "4" && <div className='row'>
                            <div className='col-2'>
                                <Label text={"Total Qty : "+props.data.length} />
                            </div>
                            <div className='col-2'>
                            <Label text={"Crystal Used :"+calculateSum("piece")} />
                            </div>
                            <div className='col-2'>
                               <Label text={"Total Packet :"+common.printDecimal(calculateSum('packet'))} />
                            </div>
                            <div className='col-2'>
                                <Label text={"Total Amount :"+common.printDecimal(calculateSum('crystalAmount'))} />
                            </div>
                            <div className='col-2'>
                                <Label helpText="Avg= Total Amount/ Total Packets used" text={"Avg. Amount :"+common.printDecimal(calculateSum('crystalAmount') /calculateSum("packet"))} />
                            </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
});
