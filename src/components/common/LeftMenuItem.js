import React from 'react'
import { Link } from 'react-router-dom'
import { common } from '../../utils/common'

export default function LeftMenuItem({ link, icon, menuName, title }) {
    title = common.defaultIfEmpty(title, menuName);
    return (
        <>
            <Link to={"/" + link} title={title}>
                {icon !== "" && <div className="parent-icon">
                    <i className={"bi " + icon}></i>
                </div>
                }
                <div className={icon !== "" ?"menu-title":""}>{menuName}</div>
            </Link>
        </>
    )
}
