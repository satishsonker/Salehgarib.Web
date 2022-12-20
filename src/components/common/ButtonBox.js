import React from 'react'
import { common } from '../../utils/common'

export default function ButtonBox({
    text,
    onClickHandler,
    className,
    btnList,
    icon
}) {
    btnList = common.defaultIfEmpty(btnList, [])
    return (
        <>
            {btnList.length === 0 && <button type='button' onClick={e => onClickHandler()} className={'btn ' + className}><i className={icon}></i> {text}</button>}
            {btnList.length > 0 &&
                <div className="btn-group" role="group" aria-label="Basic example">
                    {
                        btnList.map((ele,index) => {
                            return <button key={index} type='button' onClick={e => ele.onClickHandler()} className={'btn ' + ele.className}><i className={ele.icon}></i> {ele.text}</button>
                        })
                    }

                </div>
            }
        </>
    )
}
