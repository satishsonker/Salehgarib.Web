import React from 'react'

export default function CustomerOrderEdit({ data, setData, customerModel, index }) {
    const handleTextChange = (e) => {
        var { value, type, name } = e.target;
        let mainData = customerModel;
        if (type === 'number') {
            value = parseInt(value);
        }
        mainData.orderDetails[index][name] = value
        setData({ ...mainData });

    }
    return (
        <>
            <td>{data.orderNo}</td>
            <td>
                <input type="Date" min={new Date()} onChange={e => handleTextChange(e)} name='orderDeliveryDate' value={data?.orderDeliveryDate} className='form-control form-control-sm'></input>
            </td>
            <td>{data.orderDeliveryDate}</td>
            <td>{data.categoryName}</td>
            <td>{data.designSampleName}</td>
            <td>{parseFloat(data.price).toFixed(2)}</td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='chest' value={data?.chest} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='sleevesLoose' value={data?.sleevesLoose} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='deep' value={data?.deep} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='backDown' value={data?.backDown} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='bottom' value={data?.bottom} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='length' value={data?.length} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='hipps' value={data?.hipps} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='sleeves' value={data?.sleeves} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='shoulder' value={data?.shoulder} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='neck' value={data?.neck} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='extra' value={data?.extra} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='crystal' value={data?.crystal} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="number" min={0} onChange={e => handleTextChange(e)} name='crystalPrice' value={data?.crystalPrice} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='description' value={data?.description} className='form-control form-control-sm'></input>
            </td>
            <td>
                <input type="text" onChange={e => handleTextChange(e)} name='workType' value={data?.workType} className='form-control form-control-sm'></input>
            </td>
            <td>{data?.orderStatus}</td>
            <td>{data?.measurementStatus}</td>
        </>
    )
}