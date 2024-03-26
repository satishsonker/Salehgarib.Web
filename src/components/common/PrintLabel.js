import React from 'react'
import { common } from '../../utils/common'

export default function PrintLabel({ label,option={}, text }) {
    option.labelBold=common.defaultIfEmpty(option.labelBold,true);
    return (
        <div className='print-lable'>
            <span className='lable'>{option.labelBold?<strong>{label}</strong>:label} </span>
            <span className='text'>{text}</span>
        </div>
    )
}
