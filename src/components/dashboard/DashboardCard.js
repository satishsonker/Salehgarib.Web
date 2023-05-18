import React from 'react'

export default function DashboardCard({
    title,
    subtitle,
    value,
    icon,
    colorClass
}) {
    return (
        <div className="col" data-toggle="tooltip" title={title+" "+ (subtitle??"")}>
            <div className="card radius-10 dashboard-card-hover">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <div>
                            <div className="text-secondary">{title}</div>
                            <div className="text-secondary" style={{ fontSize: '10px' }}>{subtitle}</div>
                            <h4 className="">{value}</h4>
                        </div>
                        <div className={"widget-icon-large text-white ms-auto "+colorClass}><i className={"bi "+icon}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
