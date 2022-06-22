import React from 'react'

export default function TableTop({handlePageSizeChange,searchHandler}) {
    return (
        <div className="row mb-4">
            <div className="col-sm-12 col-md-6">
                <div className="dataTables_length" id="example_length">
                    <label style={{fontWeight: "normal",textAlign: "left",whiteSpace: "nowrap"}}><spna>Show </spna> 
                        <select onChange={e => handlePageSizeChange(e)} style={{width: "auto",display: "inline-block"}} name="example_length" aria-controls="example" className="form-select form-select-sm">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span> entries </span> 
                    </label>
                </div>
            </div>
            <div className="col-sm-12 col-md-6">
                <div id="example_filter" className="dataTables_filter" style={{textAlign:"right"}}>
                    <label style={{fontWeight: "normal",textAlign: "left",whiteSpace: "nowrap"}}>Search:
                        <input style={{marginLeft:"0.5em",display:"inline-block",width:"auto"}} type="search" onChange={e => searchHandler(e.target.value)} className="form-control form-control-sm" placeholder="" aria-controls="example" />
                    </label>
                </div>
            </div>
        </div>
    )
}
