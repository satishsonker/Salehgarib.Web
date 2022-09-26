import React from 'react'

export default function Footer() {
    return (
        <>
            <div className="page-footer">
                <div className="page-footer-inner"> Copyright © <script>document.write(new
                    Date().getFullYear())</script>Designed &amp; developed by
                     {" "+process.env.REACT_APP_COMPANY_NAME}
                </div>
                <div className="scroll-to-top" style={{display: 'block'}}>
                    <i className="material-icons">eject</i>
                </div>
            </div>
        </>
    )
}
