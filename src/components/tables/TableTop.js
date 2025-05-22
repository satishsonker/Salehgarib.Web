import React, { memo, useCallback, useMemo } from 'react';
import { common } from '../../utils/common';

const TableTop = memo(({ 
    handlePageSizeChange, 
    searchHandler, 
    sortBy, 
    setSortBy, 
    searchPlaceHolderText = "Enter minimum 3 characters", 
    showPaging = true, 
    width = "auto", 
    options,
    showSorting = true 
}) => {
    options = common.defaultIfEmpty(options, {});

    const debounce = useCallback((func) => {
        let timer;
        return (...args) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                func(...args);
            }, 500); // Reduced from 2000ms to 500ms for better responsiveness
        };
    }, []);

    const handleSortChange = useCallback((e) => {
        const { name, value } = e.target;
        setSortBy(prev => ({ ...prev, [name]: value }));
    }, [setSortBy]);

    const toggleSortDirection = useCallback(() => {
        setSortBy(prev => ({
            ...prev,
            type: prev?.type === 'desc' ? 'asc' : 'desc'
        }));
    }, [setSortBy]);

    const debouncedSearchFn = useMemo(() => debounce(searchHandler), [debounce, searchHandler]);

    const pageSizeOptions = useMemo(() => [
        20, 30, 40, 50, 75, 100, 150, 200, 300, 400, 500, 1000
    ], []);

    const renderPageSizeOptions = useMemo(() => (
        pageSizeOptions.map(size => (
            <option key={size} value={size}>{size}</option>
        ))
    ), [pageSizeOptions]);

    const renderHeaderOptions = useMemo(() => (
        options?.headers?.map((res, ind) => (
            <option key={ind} value={res?.prop}>{res?.name}</option>
        ))
    ), [options?.headers]);

    return (
        <div className="row mb-4">
            <div className="col-4">
                {showPaging && (
                    <div className="dataTables_length" id="example_length">
                        <label style={{ fontWeight: "normal", textAlign: "left", whiteSpace: "nowrap", fontSize: '12px' }}>
                            <span>Show </span>
                            <select 
                                onChange={handlePageSizeChange}
                                style={{ width: "auto", display: "inline-block", fontSize: '12px' }}
                                name="example_length"
                                aria-controls="example"
                                className="form-select form-select-sm"
                            >
                                {renderPageSizeOptions}
                            </select>
                            <span> Records </span>
                        </label>
                    </div>
                )}
            </div>
            {showSorting && (
                <div className="col-4">
                    <label style={{ fontWeight: "normal", textAlign: "left", whiteSpace: "nowrap", fontSize: '12px' }}>Sort by </label>
                    <select 
                        name="column" 
                        onChange={handleSortChange}
                        style={{ width: "auto", display: "inline-block", fontSize: '12px' }}
                        className="form-select form-select-sm"
                    >
                        <option value="default">Default</option>
                        {renderHeaderOptions}
                    </select>
                    <i 
                        style={{ fontSize: '22px', cursor: 'pointer' }}
                        onClick={toggleSortDirection}
                        className={`bi bi-sort-${sortBy?.type === 'asc' ? 'down' : 'up'} mx-2 text-${sortBy?.type === 'asc' ? 'success' : 'danger'}`}
                    />
                </div>
            )}
            <div className={showSorting ? "col-4" : 'col-8'}>
                <div id="example_filter" className="dataTables_filter" style={{ textAlign: "right" }}>
                    <label style={{ fontWeight: "normal", textAlign: "right", whiteSpace: "nowrap", width: width, fontSize: '12px' }}>
                        Search:
                        <input
                            style={{ marginLeft: "0.5em", display: "inline-block", width: width, fontSize: '12px' }}
                            placeholder={searchPlaceHolderText}
                            type="search"
                            onChange={e => debouncedSearchFn(e.target.value)}
                            className="form-control form-control-sm table-search"
                            aria-controls="example"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
});

TableTop.displayName = 'TableTop';

export default TableTop;
