import React from 'react'

export default function InvoiceHead() {
    return (
        <div className='row '>
            <div className='col-4 py-2'>
                <div className='text-start fw-bold' style={{fontSize:'12px'}}>Fridge Murar</div>
                <div className='text-start fw-bold' style={{fontSize:'12px'}}>Near Al Futaim Masjid</div>
                <div className='text-start fw-bold' style={{fontSize:'12px'}}>P.O. Box : 61975</div>
                <div className='text-start fw-bold' style={{fontSize:'12px'}}>DUBAI - U.A.E</div>
                <div className='text-start fw-bold' style={{fontSize:'12px'}}>Tel : 04-2721342</div>
                <div className='text-start fw-bold' style={{fontSize:'12px'}}>Mobile : 055-4680022</div>
            </div>
            <div className='col-4 py-2'>
                <div className='text-center'>
                    <img style={{width:'27%'}} src='/assets/images/LaBeachLogo.png' alt='La Beach Logo' />
                    <div className='text-danger text-center fs-5 fw-bold'>لا بيتش للخياطة والتطريز</div>
                    <div className='text-center text-capitalize fw-bold' style={{fontSize:'12px'}}>Tailoring &amp; Embroidery</div>
                    <div className='text-center'>TAX INVOICE</div>
                    <div className='text-center' style={{padding:'5px',borderRadius:'1000px',border:'1px solid black'}} >TRN : 1002307660003</div>
                </div>
            </div>
            <div className='col-4 py-2'>
                <div className='text-end fw-bold' style={{fontSize:'12px'}}>ثلاجة مرار</div>
                <div className='text-end fw-bold' style={{fontSize:'12px'}}>بالقرب من مسجد الفطيم</div>
                <div className='text-end fw-bold' style={{fontSize:'12px'}}>ص. ب : 61975</div>
                <div className='text-end fw-bold' style={{fontSize:'12px'}}>دبي الامارات العربية المتحدة</div>
                <div className='text-end fw-bold' style={{fontSize:'12px'}}>هاتف: 2721342-04</div>
                <div className='text-end fw-bold' style={{fontSize:'12px'}}>محمول: 055-4680022</div>
            </div>
        </div>
    )
}
