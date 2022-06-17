import React from 'react'

export default function TableAction() {
    return (
        <>
            <div className="table-actions d-flex align-items-center gap-3 fs-6">
                <a href="#" className="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Views" aria-label="Views"><i className="bi bi-eye-fill"></i></a>
                <a href="#" className="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit" aria-label="Edit"><i className="bi bi-pencil-fill"></i></a>
                <a href="#" className="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i className="bi bi-trash-fill"></i></a>
            </div>
        </>
    )
}
