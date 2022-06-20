import React from 'react'

export default function TableTop({handlePageSizeChange,searchHandler}) {
    return (
        <div className="row">
            <div className="col-sm-12 col-md-6">
                <div className="dataTables_length" id="example_length">
                    <label>Show
                        <select onChange={e => handlePageSizeChange(e)} name="example_length" aria-controls="example" className="form-select form-select-sm">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        entries
                    </label>
                </div>
            </div>
            <div className="col-sm-12 col-md-6">
                <div id="example_filter" className="dataTables_filter">
                    <label>Search:
                        <input type="search" onChange={e => searchHandler(e.target.value)} className="form-control form-control-sm" placeholder="" aria-controls="example" />
                    </label>
                </div>
            </div>
        </div>
    )
}
