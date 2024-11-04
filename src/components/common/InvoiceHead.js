import React from 'react';

export default function InvoiceHead({ receiptType = "TAX INVOICE", hideTrnNo = false }) {
    // Destructure environment variables for cleaner code
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
        fontSizeSmall: { fontSize: '12px' },
        companyNameFontSize: { fontSize: '22px' },
        logo: { width: '39%', height: '100px' },
        trnStyle: { fontSize: '12px', padding: '4px', borderRadius: '1000px', border: '1px solid black' },
        customerSupport: { fontSize: '12px', padding: '4px' }
    };

    // Reusable component for address lines
    const AddressLine = ({ text, alignment = 'start', bold = false }) => (
        <div className={`text-${alignment} ${bold ? 'fw-bold' : ''}`} style={styles.fontSizeSmall}>
            {text}
        </div>
    );

    return (
        <div className="row">
            <div className="col-4 py-2">
                <AddressLine text={REACT_APP_COMPANY_NAME} alignment="start" bold={true} />
                <AddressLine text={REACT_APP_COMPANY_SUBNAME} alignment="start" bold={true} />
                <AddressLine text="Near Immigration Bridge" alignment="start" />
                <AddressLine text="Old Airport Road" alignment="start" />
                <AddressLine text="P.O. Box : 75038" alignment="start" />
                <AddressLine text="Abu Dhabi - U.A.E" alignment="start" />
                <AddressLine text="Tel : 02-4436530" alignment="start" />
                <AddressLine text={`Mobile : ${REACT_APP_COMPANY_MOBILE}`} alignment="start" />
            </div>
            
            <div className="col-4 py-2">
                <div className="text-center">
                    <img style={styles.logo} src={REACT_APP_LOGO} alt="Company Logo" />
                    <div className="text-center text-uppercase" style={styles.fontSizeSmall}>{receiptType}</div>
                    {!hideTrnNo && (
                        <div className="text-center" style={styles.trnStyle}>
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
                <AddressLine text="صالح غريب" alignment="end" bold={true} />
                <AddressLine text="الخياطة والمنسوجات" alignment="end" bold={true} />
                <AddressLine text="بالقرب من جسر الهجرة" alignment="end" />
                <AddressLine text="طريق المطار القديم" alignment="end" />
                <AddressLine text="ص. ب : ۷٥۰۳۸" alignment="end" />
                <AddressLine text="أبو ظبي - الإمارات العربية المتحدة" alignment="end" />
                <AddressLine text="هاتف : ۰۲-٤٤۳٦٥۳۰" alignment="end" />
                <AddressLine text="محمول : +۹۷۱٥٦۷۸۰۰۱٦٥" alignment="end" />
            </div>
        </div>
    );
}
