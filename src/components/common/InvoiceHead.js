import React from 'react'

export default function InvoiceHead({ receiptType = "TAX INVOICE", hideTrnNo = false }) {
    const fontSize = '12px'
    const companyNameFontSize="22px"
    return (
        <div className='row '>
            <div className='col-4 py-2'>
                <div className='text-start fw-bold' style={{ fontSize: companyNameFontSize }}>{process.env.REACT_APP_COMPANY_NAME}</div>
                <div className='text-start fw-bold' style={{ fontSize: fontSize }}>{process.env.REACT_APP_COMPANY_SUBNAME}</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Frij Al Murar</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Near Al futtaim Masjid</div>
                <div className='text-start' style={{ fontSize: fontSize }}>P.O. Box : 61975</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Dubai - U.A.E</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Tel : {process.env.REACT_APP_COMPANY_NUMBER}</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Mobile : {process.env.REACT_APP_COMPANY_MOBILE}</div>
            </div>
            <div className='col-4 py-2'>
                <div className='text-center'>
                    <img style={{ width: '39%', height: '100px' }} src={process.env.REACT_APP_LOGO} alt='SALEH GHAREEB TAILORING TEXTILE DUBAI Logo' />
                    <div className='text-center text-uppercase' style={{ fontSize: fontSize }}>{receiptType}</div>
                    {!hideTrnNo && <div className='text-center' style={{ fontSize: fontSize, padding: '4px', borderRadius: '1000px', border: '1px solid black' }} >TRN : 100230766600003</div>}
                </div>
            </div>
            <div className='col-4 py-2'>
                <div className='text-end fw-bold' style={{ fontSize: companyNameFontSize }}>صالح غريب</div>
                <div className='text-end fw-bold' style={{ fontSize: fontSize }}>خياطة المنسوجات – دبي</div>
                <div className='text-end' style={{ fontSize: fontSize }}>فريج المرار</div>
                <div className='text-end' style={{ fontSize: fontSize }}>بالقرب من مسجد الفطيم </div>
                <div className='text-end' style={{ fontSize: fontSize }}>ص.ب. صندوق : ٦۱۹۷٥</div>
                <div className='text-end' style={{ fontSize: fontSize }}>دبي - الإمارات العربية المتحدة</div>
                <div className='text-end' style={{ fontSize: fontSize }}>هاتف : ۰٤-۲۷۲۱۳٤۲</div>
                <div className='text-end' style={{ fontSize: fontSize }}>+جوال : ۹۷۱٥٥٤٦۸۰۰۲۲</div>
            </div>
        </div>
    )
}