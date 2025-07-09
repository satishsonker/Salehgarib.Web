import React from 'react';
import useAppSettings from '../../hooks/useApplicationSettings'
import { common } from '../../utils/common';

export default function InvoiceHead({ receiptType = "TAX INVOICE", hideTrnNo = false }) {
    const applicationSettings = useAppSettings();

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
        fontSizeMid: { fontSize: '15px' },
        fontSizeBig: { fontSize: '17px' },
        companyNameFontSize: { fontSize: '22px' },
        logo: { width: '39%', height: '100px' },
        trnStyle: { fontSize: '12px', padding: '4px', borderRadius: '1000px', border: '1px solid black' },
        customerSupport: { fontSize: '12px', padding: '4px' }
    };

    // Reusable component for address lines
    const AddressLine = ({ text, alignment = 'start', bold = false,style=styles.fontSizeSmall }) => (
        <div className={`text-${alignment} ${bold ? 'fw-bold' : ''}`} style={style}>
            {text}
        </div>
    );

    return (
        <div className="row" style={{ paddingRight: "0px !important"}}>
            <div className="col-4 py-0">
                <AddressLine text={common.defaultIfEmpty(applicationSettings?.en_companyname?.value,REACT_APP_COMPANY_NAME)} alignment="start" bold={true} />
                <AddressLine text={common.defaultIfEmpty(applicationSettings?.en_companysubname?.value, REACT_APP_COMPANY_SUBNAME)} alignment="start" bold={true} />
                <AddressLine text={common.defaultIfEmpty(applicationSettings?.en_addressline1?.value, "Near Immigration Bridge")} alignment="start" />
                <AddressLine text={common.defaultIfEmpty(applicationSettings?.en_addressline2?.value, "Old Airport Road")} alignment="start" />
                {common.defaultIfEmpty(applicationSettings?.en_addressline3?.value,"")!=="" && <AddressLine text={common.defaultIfEmpty(applicationSettings?.en_addressline3?.value,"")} alignment="start" />}
                <AddressLine text={common.defaultIfEmpty(applicationSettings?.en_address_city?.value, "Abu Dhabi - U.A.E")} alignment="start" />
                <AddressLine text={`P.O. Box :${common.defaultIfEmpty(applicationSettings?.en_postbox?.value, "75038")}`} alignment="start" />
                <AddressLine text={`Tel :  ${common.defaultIfEmpty(applicationSettings?.en_company_telephone?.value, "02-4436530")}`} alignment="start" />
                <AddressLine text={`Mobile : ${common.defaultIfEmpty(applicationSettings?.en_company_mobile?.value, REACT_APP_COMPANY_MOBILE)}`} alignment="start" />
            </div>

            <div className="col-4 py-0">
                <div className="text-center">
                    <img style={styles.logo} src={REACT_APP_LOGO} alt="Company Logo" />
                    <div className="text-center text-uppercase" style={styles.fontSizeSmall}>{receiptType}</div>
                    {!hideTrnNo && (
                        <div className="text-center" style={styles.trnStyle}>
                            TRN : {common.defaultIfEmpty(applicationSettings?.trn?.value, REACT_APP_COMPANY_TRN)}
                        </div>
                    )}                   
                </div>
            </div>

            <div className="col-4" style={{paddingRight: "0px !important"}}>
                <AddressLine style={styles.fontSizeBig} text={common.defaultIfEmpty(applicationSettings?.ar_companyname?.value,REACT_APP_COMPANY_NAME)} alignment="end" bold={true} />
                <AddressLine text={common.defaultIfEmpty(applicationSettings?.ar_companysubname?.value,REACT_APP_COMPANY_SUBNAME)} alignment="end" bold={true} />
                <AddressLine text={common.defaultIfEmpty(applicationSettings?.ar_addressline1?.value,"Near Immigration Bridge")} alignment="end" />
                <AddressLine text={common.defaultIfEmpty(applicationSettings?.ar_addressline2?.value,"Old Airport Road")} alignment="end" />
                {common.defaultIfEmpty(applicationSettings?.ar_addressline3?.value,"")!=="" && <AddressLine text={common.defaultIfEmpty(applicationSettings?.ar_addressline3?.value,"")} alignment="end" />}
                <AddressLine text={common.defaultIfEmpty(applicationSettings?.ar_address_city?.value,"Abu Dhabi - U.A.E")} alignment="end" />
                <AddressLine text={`ص.ب :${common.defaultIfEmpty(applicationSettings?.ar_postbox?.value,"75038")}`} alignment="end" />
                <AddressLine text={`هاتف :  ${common.defaultIfEmpty(applicationSettings?.ar_company_telephone?.value,"02-4436530")}`} alignment="end" />
                <AddressLine text={`جوال : ${common.defaultIfEmpty(applicationSettings?.ar_company_mobile?.value,REACT_APP_COMPANY_MOBILE)}`} alignment="end" />
            </div>
            <div className='col-12 text-center fw-bold'>
            {(common.defaultIfEmpty(applicationSettings?.en_cust_support_number, REACT_APP_COMPANY_CUSTOMER_CARE) !== undefined && (common.defaultIfEmpty(applicationSettings?.en_cust_support_number, REACT_APP_COMPANY_CUSTOMER_CARE)) !== '') && (
                        <div className="text-center text-uppercase " style={styles.fontSizeMid}>
                            {common.defaultIfEmpty(applicationSettings?.en_cust_support_heading?.value, "Customer Support")} : {common.defaultIfEmpty(applicationSettings?.en_cust_support_number?.value, REACT_APP_COMPANY_CUSTOMER_CARE)}
                        </div>
                    )}
            </div>
        </div>
    );
}
