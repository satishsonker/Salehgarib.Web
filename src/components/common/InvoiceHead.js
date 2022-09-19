import React from 'react'

export default function InvoiceHead() {
    return (
        <div className='row'>
            <div className='col-4'>
                <div className='text-start fs-6 fw-bold'>Fridge Murar</div>
                <div className='text-start fs-6 fw-bold'>Near Al Futaim Masjid</div>
                <div className='text-start fs-6 fw-bold'>P.O. Box : 61975</div>
                <div className='text-start fs-6 fw-bold'>DUBAI - U.A.E</div>
                <div className='text-start fs-6 fw-bold'>Tel : 04-2721342</div>
                <div className='text-start fs-6 fw-bold'>Mobile : 055-4680022</div>
            </div>
            <div className='col-4'>
                <div className='text-center'>
                    <img style={{width:'27%'}} src='/assets/images/LaBeachLogo.png' alt='La Beach Logo' />
                    <div className='text-danger text-center fs-5 fw-bold'>لا بيتش للخياطة والتطريز</div>
                    <div className='text-center text-capitalize fs-6 fw-bold'>Tailoring &amp; Embroidery</div>
                    <div className='text-center' style={{padding:'5px',borderRadius:'1000px',border:'1px solid black'}} >TRN : 1002307660003</div>
                </div>
            </div>
            <div className='col-4'>
                <div className='text-end fs-6 fw-bold'>ثلاجة مرار</div>
                <div className='text-end fs-6 fw-bold'>بالقرب من مسجد الفطيم</div>
                <div className='text-end fs-6 fw-bold'>ص. ب : 61975</div>
                <div className='text-end fs-6 fw-bold'>دبي الامارات العربية المتحدة</div>
                <div className='text-end fs-6 fw-bold'>هاتف: 2721342-04</div>
                <div className='text-end fs-6 fw-bold'>محمول: 055-4680022</div>
            </div>
        </div>
    )
}
