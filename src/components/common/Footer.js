import React from 'react'
import useAppSettings from '../../hooks/useApplicationSettings'
import { common } from '../../utils/common';

export default function Footer({isSidebarCollapsed}) {
    const applicationSettings = useAppSettings();
    var companyName=common.defaultIfEmpty(applicationSettings?.en_companyname?.value, process.env.REACT_APP_COMPANY_NAME);
    var companySubName=common.defaultIfEmpty(applicationSettings?.en_companysubname?.value, process.env.REACT_APP_COMPANY_SUBNAME);
    return (
        <>
            <div className="page-footer" style={{paddingLeft:isSidebarCollapsed?'50px':'250px'}}>
            <div className='row'>
                        <div className='col-12 text-center text-white'>
                            Copyright © {new Date().getFullYear()} Designed &amp; Developed by
                            {" " + companyName} {companySubName}
                        </div>
                    </div>
            </div>
        </>
    )
}
