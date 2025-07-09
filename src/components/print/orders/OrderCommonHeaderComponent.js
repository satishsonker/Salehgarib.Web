import React, { memo } from 'react';
import { common } from '../../../utils/common';
import Label from '../../common/Label';
import Barcode from 'react-barcode/lib/react-barcode';

const OrderCommonHeaderComponent = memo(({ 
    orderNo, 
    salesman, 
    customerName, 
    orderDate, 
    contact, 
    orderDeliveryDate, 
    invoiceNo, 
    taxInvoiceNo 
}) => {
    return (
        <div className="card-header py-2 bg-light">
            <div className="row row-cols-12 row-cols-lg-12">
                <div className="col-3">
                    {taxInvoiceNo !== undefined ? (
                        <>
                            <Label isUpperCase={true} fontSize='15px' bold={true} text="Invoice No" />
                            <div className='fs-5 fw-bold'>{taxInvoiceNo}</div>
                            <Label isUpperCase={true} fontSize='13px' bold={true} text="Order No" />
                            <div className='fs-1fw-bold' style={{ fontFamily: 'Saira Stencil One' }}>{orderNo}</div>
                        </>
                    ) : (
                        <>
                            <Label isUpperCase={true} fontSize='19px' bold={true} text="Order No" />
                            <div className='fs-2 fw-bold' style={{ fontFamily: 'Saira Stencil One' }}>{orderNo}</div>
                        </>
                    )}
                </div>
                <div className="col-3">
                    <Label isUpperCase={true} fontSize='13px' bold={true} text="Customer Name" />
                    <div style={{ fontSize: '1.5rem' }} className='fw-bold text-uppercase'>{customerName}</div>
                    <Label isUpperCase={true} fontSize='13px' bold={true} text="Order Date" />
                    <div>{common.getHtmlDate(orderDate, 'ddmmyyyy')}</div>
                </div>
                <div className="col-3">
                    <Label isUpperCase={true} fontSize='13px' bold={true} text="Contact No." />
                    <div>{contact}</div>
                    <Label fontSize='13px' bold={true} text="Delivery Date" />
                    <div>{common.getHtmlDate(orderDeliveryDate, 'ddmmyyyy')}</div>
                </div>
                <div className="col-3">
                    <Label isUpperCase={true} fontSize='13px' bold={true} text="Salesman" />
                    <div style={{ fontSize: '13px' }} className='fw-bold'>{salesman}</div>

                    {invoiceNo !== undefined && (
                        <>
                            <Label isUpperCase={true} fontSize='13px' bold={true} text="Invoice No" />
                            <div className='fs-6 fw-bold'>{invoiceNo}</div>
                        </>
                    )}
                    <div className='mt-2'>
                        {invoiceNo === undefined && !isNaN(parseInt(orderNo)) && (
                            <Barcode 
                                displayValue={false} 
                                value={orderNo} 
                                width={2} 
                                height={30}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

OrderCommonHeaderComponent.displayName = 'OrderCommonHeaderComponent';

export default OrderCommonHeaderComponent;
