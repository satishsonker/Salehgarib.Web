import React from 'react'
import { common } from '../../utils/common';

export default function CustomerOrderEdit({ data, setData, customerModel, index, parentTextChange }) {
    const handleTextChange = (e) => {
        var { value, type, name } = e.target;
        let mainData = customerModel;
        if (type === 'number') {
            value = parseInt(value);
        }
        mainData.orderDetails[index][name] = value
        let { subTotalAmount, price, crystalPrice, crystal } = mainData.orderDetails[index];
        crystal = isNaN(parseFloat(crystal)) ? 0 : parseFloat(crystal);
        subTotalAmount = price + (crystal * crystalPrice);
        let { vatAmount, amountWithVat } = common.calculateVAT(subTotalAmount, common.vat);
        mainData.orderDetails[index].subTotalAmount = subTotalAmount;
        mainData.orderDetails[index].VATAmount = vatAmount;
        mainData.orderDetails[index].totalAmount = amountWithVat;

        
        let grandSubTotal = 0;
        mainData.orderDetails.forEach(element => {
            grandSubTotal+=element.subTotalAmount
        });
        let textChangeEvent = {
            target: {
                name: "subTotalAmount",
                value: grandSubTotal,
                type: 'number'
            }
        }
        parentTextChange(textChangeEvent);
        setData({ ...mainData });

    }
    return (
        <>
            <td>{data.orderNo}</td>
            <td>{data.orderType}</td>
            <td>
                <input type="Date" min={new Date()} onChange={e => handleTextChange(e)} name='orderDeliveryDate' value={data?.orderDeliveryDate} className='form-control form-control-sm'></input>
            </td>
            <td>{data.categoryName}</td>
            <td>{data.designSampleName}</td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='length' value={data?.length} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='chest' value={data?.chest} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='waist' value={data?.waist} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='hipps' value={data?.hipps} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='bottom' value={data?.bottom} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='sleeves' value={data?.sleeve} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='sleevesLoose' value={data?.sleeveLoose} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='shoulder' value={data?.shoulder} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='neck' value={data?.neck} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='deep' value={data?.deep} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='backDown' value={data?.backDown} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='extra' value={data?.extra} className='form-control form-control-sm'></input>
            </td>  
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='size' value={data?.size} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='measurementCustomerName' value={data?.measurementCustomerName} className='form-control form-control-sm'></input>
            </td> 
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='description' value={data?.description} className='form-control form-control-sm'></input>
            </td> 
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='workType' value={data?.workType} className='form-control form-control-sm'></input>
            </td>
            <td>{data.orderStatus}</td>
            <td>{data.measurementStatus}</td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='crystal' value={data?.crystal} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='price' value={data?.price?.toFixed(2)} className='form-control form-control-sm'></input>
            </td>
            <td>{common.printDecimal(data?.subTotalAmount)}</td>
            <td>{common.printDecimal(data?.VATAmount)}</td>
            <td>{common.printDecimal(data?.totalAmount)}</td>
        </>
    )
}
