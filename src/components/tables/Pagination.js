import React, { useState, useEffect } from 'react'
import { common } from '../../utils/common'

export default function Pagination({ option}) {
    option.totalRecords = common.defaultIfEmpty(option.totalRecords, 0);

    const [totalPageCount, setTotalPageCount] = useState([1]);
    useEffect(() => {
        let totalPage = (option.totalRecords / option.pageSize);
        let totalPages = [];
        if (totalPage > parseInt(totalPage)) {
            totalPage += 1;
        }
        for (let index = 1; index <= totalPage; index++) {
            totalPages.push(index);
        }
        setTotalPageCount(totalPages);
    }, [option.totalRecords, option.pageNo, option.pageSize]);

    const handlePageChange = (nextPage) => {
        if (nextPage === 'next')
            nextPage = totalPageCount[totalPageCount.length-1] === option.pageNo ? option.pageNo : option.pageNo + 1;
        else if (nextPage === 'prev')
            nextPage = totalPageCount[0] === option.pageNo ? totalPageCount[totalPageCount.length-1] : option.pageNo - 1;

            option.setPageNo(nextPage);
    }

    const getRecordRange = (pno, psize) => {
        psize=parseInt(psize);
        let allRecords = (option.totalRecords === 0 ? 0 : option.totalRecords);
        let recordStart = ((pno - 1) * psize) + 1;
        let recordEnd = parseInt((recordStart - 1) + (psize > allRecords ? allRecords : psize));
        recordEnd = recordEnd > allRecords ? allRecords : recordEnd;
       
        return `Showing ${recordStart} to ${recordEnd} of ${option.totalRecords} entries.`;
    }

    if (totalPageCount < 1)
        return <></>

    return (
        <div className="row">
            <div className="col-sm-12 col-md-5">
                <div className="dataTables_info" id="example_info" role="status" aria-live="polite">{getRecordRange(option.pageNo,option.pageSize)}</div>
            </div>
            <div className="col-sm-12 col-md-7">
                <div className="dataTables_paginate paging_simple_numbers" id="example_paginate">
                    <ul className="pagination">
                        {option.pageNo > 1 && <li onClick={e => handlePageChange('prev')} className="paginate_button page-item previous" id="example_previous">
                            <a href="#" aria-controls="example" data-dt-idx="0" tabIndex="0" className="page-link">Prev</a>
                        </li>
                        }

                        {
                            totalPageCount.map((currentPageNo, pageNoIndex) => {
                                return <li key={pageNoIndex} onClick={e => handlePageChange(currentPageNo)} className={common.concatClassIfNotEmpty("paginate_button page-item", "active", option.pageNo === currentPageNo)}>
                                    <a href="#" aria-controls="example" data-dt-idx="1" tabIndex="0" className="page-link">{currentPageNo}</a>
                                </li>
                            })
                        }

                        {option.pageNo < totalPageCount[totalPageCount.length-1] && <li onClick={e => handlePageChange('next')} className="paginate_button page-item next" id="example_next">
                            <a href="#" aria-controls="example" data-dt-idx="2" tabIndex="0" className="page-link">Next</a>
                        </li>
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
