import React from 'react'

export default function ReceiptFooter({message="THANK YOU FOR YOUR BUSINESS"}) {
    return (
        <div className="card-footer py-1 bg-danger text-white" style={{ fontSize: '10px' }}>
            <p className="text-center mb-2 text-uppercase">{message}</p>
            <p className="text-center d-flex align-items-center gap-3 justify-content-center mb-0">
                <span className=""><i className="bi bi-globe"></i>{process.env.REACT_APP_COMPANY_WEBSITE}</span>
                <span className=""><i className="bi bi-telephone-fill"></i> Mob: {process.env.REACT_APP_COMPANY_NUMBER}</span>
                <span className=""><i className="bi bi-envelope-fill"></i>{process.env.REACT_APP_COMPANY_EMAIL}</span>
            </p>
        </div>
    )
}
