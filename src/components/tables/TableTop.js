import React,{useCallback} from 'react'
import { common } from '../../utils/common'

export default function TableTop({ handlePageSizeChange, searchHandler,searchPlaceHolderText="Enter minimum 3 charactor", showPaging = true,width="auto" }) {
    const debounce = (func) => {
        let timer;
        return function (...args) {
          const context = this;
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            timer = null;
            func.apply(context, args);
          }, 2000);
        };
      };

      const debouncedSearchFn = useCallback(debounce(searchHandler), []);
    return (
        <div className="row mb-4">
            <div className="col-6">
                {showPaging && <div className="dataTables_length" id="example_length">
                    <label style={{ fontWeight: "normal", textAlign: "left", whiteSpace: "nowrap",fontSize:'12px' }}><span>Show </span>
                        <select onChange={e => handlePageSizeChange(e)} style={{ width: "auto", display: "inline-block",fontSize:'12px' }} name="example_length" aria-controls="example" className="form-select form-select-sm">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="75">75</option>
                            <option value="100">100</option>
                        </select>
                        <span> entries </span>
                    </label>
                </div>
                }
            </div>
            <div className="col-6">
                <div id="example_filter" className="dataTables_filter" style={{ textAlign: "right" }}>
                    <label style={{ fontWeight: "normal", textAlign: "right", whiteSpace: "nowrap",width: width,fontSize:'12px' }}>Search:
                        <input 
                        style={{ marginLeft: "0.5em", display: "inline-block", width: width,fontSize:'12px' }} 
                        placeholder={searchPlaceHolderText} 
                        type="search" 
                        onChange={e =>debouncedSearchFn(e.target.value)} 
                        className="form-control form-control-sm table-search" 
                        aria-controls="example" />
                    </label>
                </div>
            </div>
        </div>
    )
}
