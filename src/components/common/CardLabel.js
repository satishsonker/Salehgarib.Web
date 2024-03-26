import React from 'react'

export default function CardLabel({text,value,title,valueFontSize}) {
    return (
        <div className='labelAmount' title={title}>
            <span className='text'>{text}</span>
            <span className='amount' style={{fontSize:valueFontSize}}>{value}</span>
        </div>
    )
}
