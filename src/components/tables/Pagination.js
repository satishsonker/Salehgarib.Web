import React, { memo, useMemo, useCallback } from 'react';
import { common } from '../../utils/common'

const Pagination = memo(({ option }) => {
    option.totalRecords = common.defaultIfEmpty(option.totalRecords, 0);
    option.showRange = common.defaultIfEmpty(option.showRange, true);

    const totalPages = useMemo(() => Math.ceil(option.totalRecords / option.pageSize), [option.totalRecords, option.pageSize]);
    
    const pageNumbers = useMemo(() => {
        let pages = [];
        let startPage = Math.max(1, option.pageNo - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }, [option.pageNo, totalPages]);

    const handlePageClick = useCallback((pageNumber) => {
        if (pageNumber === option.pageNo || pageNumber < 1 || pageNumber > totalPages) return;
        option.setPageNo(pageNumber);
    }, [option.pageNo, totalPages, option.setPageNo]);

    const handlePrevNext = useCallback((increment) => {
        const newPage = option.pageNo + increment;
        if (newPage >= 1 && newPage <= totalPages) {
            option.setPageNo(newPage);
        }
    }, [option.pageNo, totalPages, option.setPageNo]);

    const getRecordRange = (pno, psize) => {
        psize = parseInt(psize);
        let allRecords = (option.totalRecords === 0 ? 0 : option.totalRecords);
        let recordStart = ((pno - 1) * psize) + 1;
        let recordEnd = parseInt((recordStart - 1) + (psize > allRecords ? allRecords : psize));
        recordEnd = recordEnd > allRecords ? allRecords : recordEnd;

        return `Showing ${recordStart} to ${recordEnd} of ${option.totalRecords} entries.`;
    }

    if (totalPages <= 1) return null;

    return (
        <div className="row mt-3">
            <div className="col-sm-12 col-md-5">
                {option.showRange && <div className="dataTables_info" style={{ fontSize: '12px' }} id="example_info" role="status" aria-live="polite">{getRecordRange(option.pageNo, option.pageSize)}</div>
                }
            </div>
            <div className="col-sm-12 col-md-7">
                <div className="dataTables_paginate paging_simple_numbers">
                    <ul className="pagination pagination-sm" style={{ float: 'right' }}>
                        <li className={`paginate_button page-item previous ${option.pageNo <= 1 ? 'disabled' : ''}`}>
                            <button 
                                className="page-link" 
                                onClick={() => handlePrevNext(-1)}
                                disabled={option.pageNo <= 1}
                            >
                                Previous
                            </button>
                        </li>
                        {pageNumbers.map(number => (
                            <li key={number} className={`paginate_button page-item ${number === option.pageNo ? 'active' : ''}`}>
                                <button 
                                    className="page-link"
                                    onClick={() => handlePageClick(number)}
                                >
                                    {number}
                                </button>
                            </li>
                        ))}
                        <li className={`paginate_button page-item next ${option.pageNo >= totalPages ? 'disabled' : ''}`}>
                            <button 
                                className="page-link" 
                                onClick={() => handlePrevNext(1)}
                                disabled={option.pageNo >= totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
});

Pagination.displayName = 'Pagination';

export default Pagination;
