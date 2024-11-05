import React from 'react';

export default function InvoiceHead({ receiptType = "TAX INVOICE", hideTrnNo = false }) {
    // Destructure environment variables for better readability
    const {
        REACT_APP_COMPANY_NAME,
        REACT_APP_COMPANY_SUBNAME,
        REACT_APP_COMPANY_MOBILE,
        REACT_APP_LOGO,
        REACT_APP_COMPANY_CUSTOMER_CARE,
REACT_APP_COMPANY_TRN
    } = process.env;

    // Centralized styles
    const styles = {
        smallText: { fontSize: '12px' },
        largeText: { fontSize: '22px' },
        logo: { width: '39%', height: '100px' },
        trn: { fontSize: '12px', padding: '4px', borderRadius: '1000px', border: '1px solid black' },
        customerSupport:{ fontSize: '13px', padding: '4px',fontWeight:'bold'}
    };

    // Reusable component for each line of text
    const AddressLine = ({ text, align = 'start', bold = false, style = {} }) => (
        <div className={`text-${align} ${bold ? 'fw-bold' : ''}`} style={{ ...styles.smallText, ...style }}>
            {text}
        </div>
    );

    return (
        <div className="row">
            {/* Left Section with Company Information */}
            <div className="col-4 py-2 pb-0">
                <AddressLine text={REACT_APP_COMPANY_NAME} align="start" bold={true} style={styles.largeText} />
                <AddressLine text={REACT_APP_COMPANY_SUBNAME} align="start" bold={true} />
                <AddressLine text="Fridge Al Murar" align="start" />
                <AddressLine text="Near Al futtaim Masjid" align="start" />
                <AddressLine text="P.O. Box : 61975" align="start" />
                <AddressLine text="Dubai - U.A.E" align="start" />
                <AddressLine text="Tel : 04-2721342" align="start" />
                <AddressLine text={`Mobile : ${REACT_APP_COMPANY_MOBILE}`} align="start" />
            </div>
            
            {/* Center Section with Logo and Receipt Type */}
            <div className="col-4 p-0">
                <div className="text-center">
                    <img style={styles.logo} src={REACT_APP_LOGO} alt="Company Logo" />
                    <div className="text-center text-uppercase fw-bold" style={styles.smallText}>{receiptType}</div>
                    {!hideTrnNo && (
                        <div className="text-center" style={styles.trn}>
                            TRN : {REACT_APP_COMPANY_TRN}
                        </div>
                    )}                    
                </div>
            </div>
            
            {/* Right Section with Arabic Information */}
            <div className="col-4 p-0">
            <AddressLine text='صالح غريب' align="end" bold={true} style={styles.largeText} />
                <AddressLine text='خياطة المنسوجات – دبي' align="end" bold={true}/>
                <AddressLine text='فريج المرار' align="end" />
                <AddressLine text='بالقرب من مسجد الفطيم ' align="end" />
                <AddressLine text='ص.ب. صندوق : ٦۱۹۷٥' align="end" />
                <AddressLine text='دبي - الإمارات العربية المتحدة' align="end" />
                <AddressLine text='هاتف :٠٤-٢٧٢١٣٤٢' align="end" />
                <AddressLine text='جوال : ٠٥٢٧٥٣٦٤٥٠' align="end" />
            </div>
            <div className='col-12 text-center'>
                 {REACT_APP_COMPANY_CUSTOMER_CARE!==undefined && REACT_APP_COMPANY_CUSTOMER_CARE!=='' && (
                        <div  className="text-center fw-bold pt-0" style={styles.customerSupport}>
                          <i className="bi bi-headset"></i>  Customer Support : {REACT_APP_COMPANY_CUSTOMER_CARE}
                        </div>
                    )}
            </div>
        </div>
    );
}
