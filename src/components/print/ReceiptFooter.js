import React from 'react'
import useAppSettings from '../../hooks/useApplicationSettings'
import { common } from '../../utils/common';
export default function ReceiptFooter({message="THANK YOU FOR YOUR BUSINESS"}) {
    const applicationSettings = useAppSettings();

    return (
        <div className="card-footer py-1 bg-danger text-white" style={{ fontSize: '10px' }}>
            <p className="text-center mb-2 fs-6 text-uppercase">{message}</p>
            <p className="text-center d-flex align-items-center gap-3 justify-content-center mb-0" style={{fontSize:'13px'}}>
                <span className=""><i className="bi bi-globe"></i>  { common.defaultIfEmpty(applicationSettings?.en_company_website?.value,process.env.REACT_APP_COMPANY_WEBSITE)}</span>
                {/* <span className=""><i className="bi bi-telephone-fill"></i> Mobile: {common.defaultIfEmpty(applicationSettings?.en_company_telephone?.value,process.env.REACT_APP_COMPANY_MOBILE)}</span> */}
                <span className=""><i className="bi bi-envelope-fill"></i>    {common.defaultIfEmpty(applicationSettings?.en_company_email?.value,process.env.REACT_APP_COMPANY_EMAIL)}</span>
            </p>
        </div>
    )
}
