import React from 'react';

export default function InvoiceHead({ receiptType = "TAX INVOICE", hideTrnNo = false }) {
    // Destructure environment variables
    const {
        REACT_APP_COMPANY_NAME,
        REACT_APP_COMPANY_SUBNAME,
        REACT_APP_COMPANY_MOBILE,
        REACT_APP_LOGO,
        REACT_APP_COMPANY_TRN,
        REACT_APP_COMPANY_CUSTOMER_CARE
    } = process.env;

    // Define common styles
    const styles = {
        smallText: { fontSize: '12px' },
        largeText: { fontSize: '22px' },
        logo: { width: '39%', height: '100px' },
        trn: { fontSize: '12px', padding: '4px', borderRadius: '1000px', border: '1px solid black' },
        customerSupport: { fontSize: '12px', padding: '4px' }
    };

    // Reusable component for address line
    const AddressLine = ({ text, align = 'start', bold = false }) => (
        <div className={`text-${align} ${bold ? 'fw-bold' : ''}`} style={styles.smallText}>
            {text}
        </div>
    );

    return (
        <div className="row">
            <div className="col-4 py-2">
                <AddressLine text={REACT_APP_COMPANY_NAME} align="start" bold={true} />
                <AddressLine text={REACT_APP_COMPANY_SUBNAME} align="start" bold={true} />
                <AddressLine text="Near Immigration Bridge" align="start" />
                <AddressLine text="Old Airport Road" align="start" />
                <AddressLine text="P.O. Box : 75038" align="start" />
                <AddressLine text="Abu Dhabi - U.A.E" align="start" />
                <AddressLine text="Tel : 02-4436530" align="start" />
                <AddressLine text={`Mobile : ${REACT_APP_COMPANY_MOBILE}`} align="start" />
            </div>
            
            <div className="col-4 py-2">
                <div className="text-center">
                    <img style={styles.logo} src={REACT_APP_LOGO} alt="Company Logo" />
                    <div className="text-center text-uppercase" style={styles.smallText}>{receiptType}</div>
                    {!hideTrnNo && (
                        <div className="text-center" style={styles.trn}>
                            TRN : {REACT_APP_COMPANY_TRN}
                        </div>
                    )}
                     {REACT_APP_COMPANY_CUSTOMER_CARE!==undefined && REACT_APP_COMPANY_CUSTOMER_CARE!=='' && (
                        <div  className="text-center" style={styles.customerSupport}>
                            Customer Support : {REACT_APP_COMPANY_CUSTOMER_CARE}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="col-4 py-2">
                <AddressLine text="صالح غريب" align="end" bold={true} />
                <AddressLine text="الخياطة والمنسوجات" align="end" bold={true} />
                <AddressLine text="بالقرب من جسر الهجرة" align="end" />
                <AddressLine text="طريق المطار القديم" align="end" />
                <AddressLine text="ص. ب : ۷٥۰۳۸" align="end" />
                <AddressLine text="أبو ظبي - الإمارات العربية المتحدة" align="end" />
                <AddressLine text="هاتف : ۰۲-٤٤۳٦٥۳۰" align="end" />
                <AddressLine text="محمول : +۹۷۱٥٦۷۸۰۰۱٦٥" align="end" />
            </div>
        </div>
    );
}
