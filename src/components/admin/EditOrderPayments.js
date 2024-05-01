import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

export default function EditOrderPayments() {
    const breadcrumbOption = {
        title: 'Edit Order Payments',
        items: [
            {
                title: "Admin",
                icon: "bi bi-person-square",
                isActive: false,
            },
            {
                title: "Edit Payments",
                icon: "bi bi-person-check-fill",
                isActive: false,
            }
        ]
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Edit Payments</h6>
            <hr />
        </>
    )
}
