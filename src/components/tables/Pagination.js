import React, { useState, useEffect } from 'react'
import { usePagination, DOTS } from '../../hooks/usePaginagtion';
import { common } from '../../utils/common'

export default function Pagination({ option }) {

    option.totalRecords = common.defaultIfEmpty(option.totalRecords, 0);
    option.showRange = common.defaultIfEmpty(option.showRange, true);

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

    const paginationRange = usePagination({
        currentPage: option.pageNo,
        totalCount: option.totalRecords,
        siblingCount: 2,
        pageSize: option.pageSize
    });

    const handlePageChange = (nextPage) => {
        if (nextPage === 'next')
            nextPage = totalPageCount[totalPageCount.length - 1] === option.pageNo ? option.pageNo : option.pageNo + 1;
        else if (nextPage === 'prev')
            nextPage = totalPageCount[0] === option.pageNo ? totalPageCount[totalPageCount.length - 1] : option.pageNo - 1;
debugger;
        option.setPageNo(nextPage);
    }

    const getRecordRange = (pno, psize) => {
        psize = parseInt(psize);
        let allRecords = (option.totalRecords === 0 ? 0 : option.totalRecords);
        let recordStart = ((pno - 1) * psize) + 1;
        let recordEnd = parseInt((recordStart - 1) + (psize > allRecords ? allRecords : psize));
        recordEnd = recordEnd > allRecords ? allRecords : recordEnd;

        return `Showing ${recordStart} to ${recordEnd} of ${option.totalRecords} entries.`;
    }

    if (totalPageCount < 1)
        return <></>

    return (
        <div className="row mt-4">
            <div className="col-sm-12 col-md-5 text-start">
                {option.showRange && <div className="dataTables_info" style={{ fontSize: '12px' }} id="example_info" role="status" aria-live="polite">{getRecordRange(option.pageNo, option.pageSize)}</div>
                }
            </div>
            <div className="col-sm-12 col-md-7 text-end">
                <div className="dataTables_paginate paging_simple_numbers" style={{ margin: "0", whiteSpace: "nowrap", textAlign: "right" }} id="example_paginate">
                    <ul className="pagination" style={{ margin: "2px 0", whiteSpace: "nowrap", justifyContent: "flex-end" }}>
                        {option.pageNo > 0 && <li onClick={e => handlePageChange('prev')} className="paginate_button page-item previous" id="example_previous">
                            <button style={{ fontSize: '12px' }} aria-controls="example" data-dt-idx="0" tabIndex="0" className="page-link">Prev</button>
                        </li>
                        }

                        {
                            paginationRange?.map((currentPageNo, pageNoIndex) => {
                                return <li key={pageNoIndex} onClick={e => handlePageChange(currentPageNo)} className={common.concatClassIfNotEmpty("paginate_button page-item", "active", option.pageNo === currentPageNo)}>
                                    <button style={{ fontSize: '12px' }} aria-controls="example" data-dt-idx="1" tabIndex="0" className="page-link">{currentPageNo}</button>
                                </li>
                            })
                        }

                        {option.pageNo <= totalPageCount[totalPageCount.length - 1] && <li onClick={e => handlePageChange('next')} className="paginate_button page-item next" id="example_next">
                            <button style={{ fontSize: '12px' }} aria-controls="example" data-dt-idx="2" tabIndex="0" className="page-link">Next</button>
                        </li>
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
