import React from 'react'

export default function InvoiceHead({ receiptType = "TAX INVOICE", hideTrnNo = false }) {
    const fontSize = '12px'
    return (
        <div className='row '>
            <div className='col-4 py-2'>
                <div className='text-start fw-bold' style={{ fontSize: '13px' }}>{process.env.REACT_APP_COMPANY_NAME}</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Fridge Murar</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Near Al Futaim Masjid</div>
                <div className='text-start' style={{ fontSize: fontSize }}>P.O. Box : 61975</div>
                <div className='text-start' style={{ fontSize: fontSize }}>DUBAI - U.A.E</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Tel : 04-2721342</div>
                <div className='text-start' style={{ fontSize: fontSize }}>Mobile : +971554680022</div>
            </div>
            <div className='col-4 py-2'>
                <div className='text-center'>
                    <img style={{ width: '39%', height: '100px' }} src={process.env.REACT_APP_LOGO} alt='SALEH GHAREEB TAILORING TEXTILE Logo' />
                    <div className='text-center text-uppercase' style={{ fontSize: fontSize }}>{receiptType}</div>
                    {!hideTrnNo && <div className='text-center' style={{ fontSize: fontSize, padding: '4px', borderRadius: '1000px', border: '1px solid black' }} >TRN : 100230766600003</div>}
                </div>
            </div>
            <div className='col-4 py-2'>
                <div className='text-end fw-bold' style={{ fontSize: '13px' }}>صالح غريب للخياطة المنسوجات</div>
                <div className='text-end' style={{ fontSize: fontSize }}>ثلاجة مرار</div>
                <div className='text-end' style={{ fontSize: fontSize }}>بالقرب من مسجد الفطيم</div>
                <div className='text-end' style={{ fontSize: fontSize }}>ص. ب : ٦١٩٧٥</div>
                <div className='text-end' style={{ fontSize: fontSize }}>دبي الامارات العربية المتحدة</div>
                <div className='text-end' style={{ fontSize: fontSize }}>هاتف:  +٩٧١٤٢٧٢١٣٤٢</div>
                <div className='text-end' style={{ fontSize: fontSize }}>محمول: +٩٧١٥٥٤٦٨٠٠٢٢</div>
            </div>
        </div>
    )
}
