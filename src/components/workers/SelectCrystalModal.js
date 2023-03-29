import React, { useState, useEffect, memo } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import ButtonBox from '../common/ButtonBox';
import Inputbox from '../common/Inputbox';
import TableView from '../tables/TableView';

const SelectCrystalModal = ({ kandooraNo, orderDetailId }) => {
const [usedData, setUsedData] = useState({});
  useEffect(() => {

    if(orderDetailId===0)
    return;
    Api.Get(apiUrls.crytalTrackingController.getTrackingOutByOrderDetailId + `${orderDetailId}`)
      .then(res => {
        debugger;
        setUsedData({...res.data});
        tableDetailOptionTemplet.data = res.data[0]?.crystalTrackingOutDetails;
        tableDetailOptionTemplet.totalRecords = res?.data[0]?.crystalTrackingOutDetails.length ?? 0;
        setTableOption({...tableDetailOptionTemplet});
      });
  }, [orderDetailId]);

  const tableDetailOptionTemplet = {
    headers: headerFormat.crystalTrackingOutDetail,
    showTableTop: false,
    showFooter: false,
    data: [],
    totalRecords: 0,
    showAction: false
  }

  const [tableOption, setTableOption] = useState(tableDetailOptionTemplet);

  return (
    <>
      <div className="modal fade" id="used-crystal-model" role="dialog" tabIndex="-1" aria-labelledby="used-crystal-model-label" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="used-crystal-model-label">Used Crystal Detail for {kandooraNo}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body" style={{ overflowY: "auto", maxHeight: "305px" }}>
              <TableView option={tableOption}/>
            </div>
            <div className="modal-footer">
              <ButtonBox modelDismiss={true} type="cancel" className="btn-sm"></ButtonBox>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(SelectCrystalModal)
