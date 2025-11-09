import React, { useState, useEffect } from 'react'
import WorkTypeHeader from './WorkTypeHeader'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';

export default function WorkTypeSelector({ workTypeList, workDescriptionList, selectWorkDescription, isWDSelected, orderDetailId, setSelectedWorkDescription }) {
    const [selectWorkTypeOption, setSelectWorkTypeOption] = useState(null);
    const [newWorkTypeList, setNewWorkTypeList] = useState([]);
    const [newWorkDescriptionList, setNewWorkDescriptionList] = useState([]);
    const [savedOrderWorkDescription, setSavedOrderWorkDescription] = useState([]);
    const organizeWorkTypeAndDescription = () => {
        var newWorkTypeLists = [];
        var newWorkDescriptionLists = [];
        workTypeList.forEach(wt => {
            var exists = newWorkTypeLists.find(x => x.code === wt.code);
            if (!exists) {
                newWorkTypeLists.push(wt);
            }

            if (workDescriptionList !== undefined) {
                workDescriptionList.forEach(wd => {
                    var exists = newWorkDescriptionLists.find(x => x.id === wd.id);
                    if (!exists) {
                        var workTypeId = 0;
                        if (selectWorkTypeOption === null) {
                            workTypeId = workTypeList.find(x => x.code === wd.code)?.id;
                            newWorkDescriptionLists.push({ ...wd, ["workTypeId"]: workTypeId });
                        }
                        else {
                            workTypeId = selectWorkTypeOption.id;
                            if (selectWorkTypeOption.code === wd.code) {
                                wd["workTypeId"] = workTypeId;
                                newWorkDescriptionLists.push({ ...wd });
                            }
                            else {
                                workTypeId = workTypeList.find(x => x.code === wd.code)?.id;
                                newWorkDescriptionLists.push({ ...wd, ["workTypeId"]: workTypeId });
                            }

                        }
                    }
                });
            }
        });
        setNewWorkTypeList(newWorkTypeLists);
        setNewWorkDescriptionList(newWorkDescriptionLists);
    }
    useEffect(() => {
        organizeWorkTypeAndDescription();
        Api.Get(apiUrls.workDescriptionController.getOrderWorkDescription + orderDetailId)
            .then((res) => {
                if (res && res.data) {
                    var workData = res.data;
                    setSavedOrderWorkDescription([...workData]);
                    setSelectedWorkDescription([...workData]);
                }
            });
    }, [orderDetailId])


    useEffect(() => {
        if(selectWorkTypeOption===null || selectWorkTypeOption===undefined) return;
        organizeWorkTypeAndDescription();
        var modal = savedOrderWorkDescription;
        modal.forEach(swd => {
            if (swd.workTypeCode === selectWorkTypeOption.code) {
                swd["workTypeId"] = selectWorkTypeOption.id;
            }
        })
        setSavedOrderWorkDescription([...modal]);
    }, [selectWorkTypeOption]);

    const selectedWorkType = (code) => {
        var code= [
            ...new Set(
                savedOrderWorkDescription
                    ?.filter(x => x.workTypeCode === code)
                    .map(x => x.workTypeId)
            ),
        ];
        return code?.length ? code : [0];

    }

    if (!workTypeList?.length) return null;

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                {newWorkTypeList?.map((ele, index) => {
                    return <React.Fragment key={index}>
                        {newWorkDescriptionList.find(x => x.code === ele.code) !== undefined && <>
                            <WorkTypeHeader key={index} headerData={workTypeList.filter(x => x.code === ele.code)} setSelectWorkTypeOption={setSelectWorkTypeOption} selectedWorkTypeId={selectedWorkType(ele.code)}></WorkTypeHeader>
                            {newWorkDescriptionList.filter(x => x.code === ele.code).map((wd, ind) => {
                                return <div key={ind} onClick={e => selectWorkDescription(wd)} className={isWDSelected(wd.id) ? 'work-description-badge bg-info' : "work-description-badge"} style={{ fontSize: '10px' }}>
                                    {wd.value}</div>
                            })}
                        </>}
                    </React.Fragment>
                })}
            </div>
        </>
    )
}
