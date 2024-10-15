import React from 'react'
import Label from '../../common/Label'
import { common } from '../../../utils/common'
import Barcode from 'react-barcode/lib/react-barcode'

export default function FabricInvoiceCommonHeader({ salesman, customerName, saleDate, contact, deleiverDate, invoiceNo, taxInvoiceNo }) {
  return (
        <div className="card-header py-2 bg-light">
            <div className="row row-cols-12 row-cols-lg-12">
                <div className="col-3">
                    <Label fontSize='15px' bold={true} text="Invoice No."></Label>
                    <div className='fs-5 fw-bold'>{invoiceNo}</div>
                    {taxInvoiceNo !== undefined && taxInvoiceNo!==0 && <>
                        <Label fontSize='19px' bold={true} text="Tax Invoice No."></Label>
                        <div className='fs-2 fw-bold'>{taxInvoiceNo}</div>
                    </>}
                </div>
                <div className="col-3">
                    <Label fontSize='13px' bold={true} text="Customer Name"></Label>
                    <div style={{ fontSize: '1.5rem' }} className='fw-bold'>{customerName}</div>
                    <Label fontSize='13px' bold={true} text="Purchase Date"></Label>
                    <div>{common.getHtmlDate(saleDate, 'ddmmyyyy')}</div>
                </div>
                <div className="col-3">
                    <Label fontSize='13px' bold={true} text="Contact No"></Label>
                    <div>{contact}</div>
                    <Label fontSize='13px' bold={true} text="Delivery Date"></Label>
                    <div>{common.getHtmlDate(deleiverDate, 'ddmmyyyy')}</div>
                </div>
                <div className="col-3">
                    <Label fontSize='13px' bold={true} text="Salesman"></Label>
                    <div style={{ fontSize: '1rem' }} className='fw-bold'>{salesman}</div>
                    
                    {<Barcode displayValue={true} value={invoiceNo} width={2.5} height={30} />}
                   
                   
                </div>
            </div>
        </div>
    )
}
