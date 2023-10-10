import React from 'react'

export default function InvoiceHead({ receiptType = "TAX INVOICE", hideTrnNo = false }) {
    const fontSize = '12px'
    return (
        <div className='row '>
            <div className='col-4 py-2'>
                <div className='text-start fw-bold' style={{ fontSize: '22px' }}>{process.env.REACT_APP_COMPANY_NAME}</div>
                <div className='text-start fw-bold' style={{ fontSize: fontSize }}>{process.env.REACT_APP_COMPANY_SUBNAME}</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Al Mushrif</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Near Immigration Bridge</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Old Airport Road</div>
                <div className='text-start' style={{ fontSize: fontSize }}>P.O. Box : 75038</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Abu Dhabi - U.A.E</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Tel : 02-6399440</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Mobile : {process.env.REACT_APP_COMPANY_MOBILE}</div>
            </div>
            <div className='col-4 py-2'>
                <div className='text-center'>
                    <img style={{ width: '39%', height: '100px' }} src={process.env.REACT_APP_LOGO} alt='SALEH GHAREEB TAILORING TEXTILE BR. Logo' />
                    <div className='text-center text-uppercase' style={{ fontSize: fontSize }}>{receiptType}</div>
                    {!hideTrnNo && <div className='text-center' style={{ fontSize: fontSize, padding: '4px', borderRadius: '1000px', border: '1px solid black' }} >TRN : 104107669400003</div>}
                </div>
            </div>
            <div className='col-4 py-2'>
                <div className='text-end fw-bold' style={{ fontSize: '22px' }}>صالح غريب</div> 
                <div className='text-end fw-bold' style={{ fontSize: fontSize}}>خياطة المنسوجات - فرع</div>
                <div className='text-end' style={{ fontSize: fontSize }}>المشرف</div>
                <div className='text-end' style={{ fontSize: fontSize }}>بالقرب من جسر الهجرة</div>
                <div className='text-end' style={{ fontSize: fontSize }}>طريق المطار القديم</div>
                <div className='text-end' style={{ fontSize: fontSize }}>ص. ب : ۷٥۰۳۸</div>
                <div className='text-end' style={{ fontSize: fontSize }}>أبو ظبي - الإمارات العربية المتحدة</div>
                <div className='text-end' style={{ fontSize: fontSize }}>هاتف: ۰۲-٦۳۹۹٤٤۰</div>
                <div className='text-end' style={{ fontSize: fontSize }}>محمول: +۹۷۱٥۰٦۰۷٥۸۷٥</div>
            </div>
        </div>
    )
}
