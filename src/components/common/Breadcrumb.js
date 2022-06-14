import React from 'react'
import { common } from '../../utils/common'

export default function Breadcrumb({option}) {
    option=common.defaultIfEmpty(option,{});
    option.title=common.defaultIfEmpty(option.title,'Breadcrumb Title');
  return (
    <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
    <div class="breadcrumb-title pe-3">{option.title}</div>
    <div class="ps-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 p-0">
                <li class="breadcrumb-item"><a href="javascript:;"><i class="bx bx-home-alt"></i></a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Data Table</li>
            </ol>
        </nav>
    </div>
    <div class="ms-auto">
        <div class="btn-group">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-contact"><i class="bx bx-plus"></i> Add employee details</button>
      </div>
    </div>
</div>
  )
}
