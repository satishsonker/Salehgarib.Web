import React from 'react'

export default function Footer({isSidebarCollapsed}) {
    return (
        <>
            <div className="page-footer" style={{paddingLeft:isSidebarCollapsed?'50px':'250px'}}>
            <div className='row'>
                        <div className='col-12 text-center text-white'>
                            Copyright © {new Date().getFullYear()} Designed &amp; Developed by
                            {" " + process.env.REACT_APP_COMPANY_NAME}
                        </div>
                    </div>
            </div>
        </>
    )
}
