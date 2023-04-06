import React from 'react'
import { common } from '../../../../utils/common';
import { headerFormat } from '../../../../utils/tableHeaderFormat';
import InvoiceHead from '../../../common/InvoiceHead'
import Label from '../../../common/Label';

export const PrintDailyWorkStatement = React.forwardRef((props, ref) => {
    if (props == undefined || props?.data?.length === 0 || props.workTypeCode === "")
        return;
    const workTypeCode = props.props?.workTypeCode;
    const calculate=()=>{
        var obj={
            totalQty:props?.data?.length,
            totalAmount:0,
            avgAmount:0
        }
        obj.totalAmount=props?.data?.reduce((sum,ele)=>{
            return sum+=ele.amount;
        },0);
        obj.avgAmount=obj.totalAmount/obj.totalQty;
        return obj;
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
                                props.data?.map((res, index) => {
                                  return  <tr key={index}>
                                        {headers?.map((hEle, hIndex) => {
                                            return <th key={hIndex} className='text-center'>{hEle?.prop.indexOf('date')>-1?common.getHtmlDate(res[hEle?.prop]):res[hEle?.prop]}</th>
                                        })}
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    <div className='row'>
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
                </div>
            </div>
        </div>
    )
});
