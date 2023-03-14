import React, { useState, useEffect, memo } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import ButtonBox from '../common/ButtonBox';
import Inputbox from '../common/Inputbox';

const SelectCrystalModal = ({ setModelData }) => {
  const [crystalData, setCrystalData] = useState([]);
  const [selectedCrystalData, setSelectedCrystalData] = useState([]);
  const [searchTearm, setSearchTearm] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Api.Get(apiUrls.stockController.getCrystal)
    //   .then(res => {
    //     setCrystalData(res.data);
    //   });
  }, []);
  const getSearchResult = () => {
    if (searchTearm === "" || searchTearm === undefined)
      return crystalData??[];
    else
      return crystalData.filter(x => x.product?.toLowerCase().indexOf(searchTearm?.toLowerCase()) > -1 || x.brand?.toLowerCase().indexOf(searchTearm?.toLowerCase()) > -1)??[];
  }
  const checkHandler = (e, data) => {
    var model = selectedCrystalData;
    if (e.target.checked) {
      if (model.find(x => x.productStockId === data.productStockId) === undefined) {
        model.push(data);
        setHasError(true);
      }
    }
    else {
      model = common.removeByAttr(model, "productStockId", data.productStockId);
    }
    setSelectedCrystalData([...model]);
  }
  const textChangeHandler = (e, data) => {
    var model = selectedCrystalData;
    var selectedData = model.find(x => x.productStockId === data.productStockId);
    if (selectedData !== undefined) {
      var value=parseInt(e.target.value);
      selectedData["enteredPieces"] = isNaN(value)?"":value;
    }
    setSelectedCrystalData([...model]);
    if(selectedCrystalData.find(x=> x.enteredPieces==="" ||x.enteredPieces===undefined || x.enteredPieces<1))
    {
      setHasError(true);
    }else
    {
      setHasError(false);
    }
  }

  const selectBtnHandler = () => {
      setModelData([...selectedCrystalData]);
  }

  const searchTermTextChangeHandler = (e) => {
    setSearchTearm(e.target.value);
  }
  return (
    <>
      <div className="modal fade" id="select-crystal-model" role="dialog" tabIndex="-1" aria-labelledby="select-crystal-model-label" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="select-crystal-model-label">Select Crystal</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body" style={{ overflowY: "auto", maxHeight: "305px" }}>
              <div className='row'>
                <div className='col-12'>
                  <Inputbox type="text" labelText="Search Crystal" value={searchTearm} onChangeHandler={searchTermTextChangeHandler}></Inputbox>
                </div>
                <div className='col-12'>
                  <table className='table table-bordered table-stripe' style={{ fontSize: 'var(--app-font-size)' }}>
                    <thead>
                      <tr>
                        <th className='text-center'>Action</th>
                        <th className='text-center'>Sr.</th>
                        <th className='text-center'>Name</th>
                        <th className='text-center'>Shape</th>
                        <th className='text-center'>Available Qty</th>
                        <th className='text-center'>Available Pieces</th>
                        <th className='text-center'>Enter Pieces</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSearchResult()?.map((res, index) => {
                        return <tr key={index}>
                          <td className='text-center'><Inputbox checked={selectedCrystalData.find(x => x.productStockId === res.productStockId) !== undefined} onChangeHandler={checkHandler} onChangeHandlerData={res} overrideClass={true} showLabel={false} type="checkbox" /> </td>
                          <td className='text-center'>{index + 1}</td>
                          <td>{`${res.brand}-${res.product}-${res.size}`}</td>
                          <td className='text-center'>{res.shape}</td>
                          <td className='text-center'>{res.availableQty}</td>
                          <td className='text-center'>{res.availablePiece === 0 ? res.availableQty * 1440 : res.availablePiece}</td>
                          <td className='text-center'>
                            {selectedCrystalData.find(x => x.productStockId === res.productStockId) !== undefined && <>
                              <Inputbox value={selectedCrystalData.find(x => x.productStockId === res.productStockId)?.enteredPieces ?? 0} onChangeHandler={textChangeHandler} onChangeHandlerData={res} className="form-control-sm" showLabel={false} type="number" min={0} max={res.availablePiece === 0 ? res.availableQty * 1440 : res.availablePiece}></Inputbox>
                              {selectedCrystalData.find(x => x.productStockId === res.productStockId)?.enteredPieces<1 && <div className='text-center text-danger' style={{ fontSize: '11px' }}>Enter value</div>}
                            </>
                            }
                          </td>
                        </tr>
                      })}
                      <tr>
                        <td colSpan={5}></td>
                        <td className='fw-bold text-center'>Total Pieces</td>
                        <td className='fw-bold text-center'>{common.printDecimal(selectedCrystalData.reduce((sum, ele) => {
                          return sum += ele.enteredPieces ?? 0;
                        }, 0))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            <div className="modal-footer">
              {!hasError && <ButtonBox type="save" modelDismiss={true} onClickHandler={selectBtnHandler} text="Select"></ButtonBox>}
              <ButtonBox modelDismiss={true} text="Close" className="btn-danger"></ButtonBox>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(SelectCrystalModal)
