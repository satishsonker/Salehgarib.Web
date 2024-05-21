import React from 'react'
import { common } from '../../../../utils/common'
import { headerFormat } from '../../../../utils/tableHeaderFormat'
import InvoiceHead from '../../../common/InvoiceHead'

export default function PrintEachKandooraExpReport({ data, filterData, printRef }) {
    const getFooterSum = (propName) => {
        if(["orderDate","orderNo","customerName","modalNo","profitPercentage"].indexOf(propName)>-1)
        return ""
      return  data?.reduce((sum, ele) => {
            var input=parseFloat(ele[propName]);
            return sum += isNaN(input)?0:input;
        }, 0)
    }
    return (
        <>
            <div className='card' ref={printRef}>
                <div className='card-body'>
                    <InvoiceHead receiptType="Each Kandoora Expense Report" />
                    <hr />
                    <div className='row'>
                        <div className='col-12 text-center fw-bold my-2'>
                            Report Date : {common.getHtmlDate(filterData.fromDate, 'ddmmyyyy')} To {common.getHtmlDate(filterData.toDate, 'ddmmyyyy')}
                        </div>
                        <div className='col-12'>
                            <table className='table table-bordered' style={{ fontSize: '11px' }}>
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        {headerFormat.eachKandooraExpReortPrint.map((ele, index) => {
                                            return <th key={index}>{ele.name}</th>
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((dEle, dIndex) => {
                                        return <tr key={dIndex}>
                                            <td className='text-center'>{dIndex+1}</td>
                                            {headerFormat.eachKandooraExpReortPrint.map((ele, index) => {
                                                if(ele?.prop==="orderNo")
                                                    return <td className='text-center' key={index}>{
                                                        dEle[ele.prop]
                                                    }</td>
                                                    if(ele?.prop==="orderDate")
                                                        return <td className='text-center' key={index}>{
                                                           common.getHtmlDate(dEle[ele.prop],"ddmmyyyy")
                                                        }</td>
                                                return <td className='text-center' key={index}>{
                                                    isNaN(parseFloat(dEle[ele.prop])) ? dEle[ele.prop] : common.printDecimal(dEle[ele.prop])
                                                }</td>
                                            })}
                                        </tr>
                                    })}
                                </tbody>
                                <tfoot>
                                <tr>
                                        {headerFormat.eachKandooraExpReort.map((ele, index) => {
                                            return <th key={index}>{common.printDecimal(getFooterSum(ele.prop))}</th>
                                        })}
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
