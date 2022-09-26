import React from 'react'

export default function ReceiptFooter({message="THANK YOU FOR YOUR BUSINESS"}) {
    return (
        <div className="card-footer py-1 bg-danger text-white" style={{ fontSize: '10px' }}>
            <p className="text-center mb-2 text-uppercase">{message}</p>
            <p className="text-center d-flex align-items-center gap-3 justify-content-center mb-0">
                <span className=""><i className="bi bi-globe"></i>www.labeachdubai.com</span>
                <span className=""><i className="bi bi-telephone-fill"></i> Mob: 055-4680022</span>
                <span className=""><i className="bi bi-envelope-fill"></i>labeachdubai@gmail.com</span>
            </p>
        </div>
    )
}
