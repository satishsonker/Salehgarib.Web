import { useMemo, useEffect, useState } from "react";
import '../../../src/css/WorktypeOption.css';
import { Api } from "../../apis/Api";
import { apiUrls } from "../../apis/ApiUrls";
import { toast } from "react-toastify";
import { toastMessage } from "../../constants/ConstantValues";
import ButtonBox from "../common/ButtonBox";

export default function WorkTypeOptions({
    workTypeList = [],
    workDescriptionList = [],
    orderDetailId = 0
}) {
    const [savedData, setSavedData] = useState([]);
    const [serverDataCount, setServerDataCount] = useState(0)
    useEffect(() => {
        if (orderDetailId <= 0) return;
        Api.Get(apiUrls.workDescriptionController.getOrderWorkDescription + orderDetailId)
            .then(res => {
                setSavedData(res.data);
                setServerDataCount(res.data.length);
            });
    }, [orderDetailId])

    const typesByCode = useMemo(() => {
        const m = {};
        workTypeList.forEach((wt) => {
            const c = String(wt.code);
            m[c] = m[c] || [];
            m[c].push(wt);
        });
        return m;
    }, [workTypeList]);

    const descByCode = useMemo(() => {
        const m = {};
        workDescriptionList.forEach((d) => {
            const c = String(d.code);
            m[c] = m[c] || [];
            m[c].push(d);
        });
        return m;
    }, [workDescriptionList]);

    const [selectedRadio, setSelectedRadio] = useState(() => {
        const init = {};
        savedData.forEach((s) => {
            if (s.workTypeCode && s.workTypeId) init[String(s.workTypeCode)] = s.workTypeId;
        });
        return init;
    });

    useEffect(() => {
        if (savedData?.length <= 0) return;

        const r = { ...selectedRadio };
        savedData.forEach((s) => {
            const code = String(s.workTypeCode);
            if (!r[code] && s.workTypeId) r[code] = s.workTypeId;
        });

        setSelectedRadio(r);
        // Object.keys(typesByCode).forEach((code) => {
        //     if (!r[code] && typesByCode[code] && typesByCode[code].length > 0) {
        //         r[code] = typesByCode[code][0].id;
        //     }
        // });
    }, [savedData]);

    const makeSelectedObject = ({ desc, code, workTypeId }) => {
        return {
            id: 0,
            orderDetailId: orderDetailId,
            workDescriptionId: desc?.id,
            workTypeCode: String(code),
            value: desc?.value,
            workTypeId: workTypeId ?? null,
            workType: null,
            isNew: true,
            updatedAt: new Date().toISOString(),
        };
    };

    const toggleChip = (desc, code) => {
        const codeStr = String(code);
        const existingIndex = savedData.findIndex(
            (s) => String(s.workDescriptionId) === String(desc.id) && String(s.workTypeCode) === codeStr
        );


        if (existingIndex !== -1) {
            const newSel = [...savedData];
            newSel.splice(existingIndex, 1);
            setSavedData(newSel);
            return;
        }

        let workTypeId = selectedRadio[codeStr];
        if (!workTypeId) {
            const typesForCode = typesByCode[codeStr] || [];
            workTypeId = typesForCode.length ? typesForCode[0].id : null;
            if (workTypeId) {
                setSelectedRadio((p) => ({ ...p, [codeStr]: workTypeId }));
            }
        }

        const newObj = makeSelectedObject({ desc, code: codeStr, workTypeId, isNew: true });
        setSavedData((p) => [...p, newObj]);
    };

    const onRadioChange = (code, newWorkTypeId) => {
        const codeStr = String(code);
        setSelectedRadio((p) => ({ ...p, [codeStr]: newWorkTypeId }));

        setSavedData((prev) =>
            prev.map((s) => {
                if (String(s.workTypeCode) === codeStr) {
                    return { ...s, workTypeId: newWorkTypeId, isNew: true, updatedAt: new Date().toISOString() };
                }
                return s;
            })
        );

        setServerDataCount((prevCount) => prevCount + 2);

        if (savedData.filter(x => String(x.workTypeCode) === codeStr).length === 0) {
            debugger;
            var desc={id:0,value:""};
            const newObj = makeSelectedObject({desc, code:codeStr, workTypeId: newWorkTypeId });
            setSavedData((p) => [...p, newObj]);
        };
    };
    const handleUpdate = () => {
        if (savedData.filter(x => x.isNew)?.length > 0) {
            Api.Post(apiUrls.workDescriptionController.saveOrderWorkDescription, savedData).then(res => {
                if (res.data > 0) {
                    toast.success("Work Desciptions " + toastMessage.updateSuccess);
                }
                else {
                    toast.warn(toastMessage.updateError);
                }
            })
        }
    }

    const isChipSelected = (desc, code) =>
        savedData.some((s) => String(s.workDescriptionId) === String(desc.id) && String(s.workTypeCode) === String(code));

    const codes = useMemo(() => Object.keys(typesByCode).sort(), [typesByCode]);

    return (
        <>
            {codes.length === 0 && <div className="text-sm text-gray-500">No work types found.</div>}

            {codes.map((code) => {
                const types = typesByCode[code];
                const descs = descByCode[code] || [];
                return (
                    <div key={code} className="col-lg-4 col-md-6 col-sm-12">

                        <div className="card" style={{ minHeight: '100px' }}>
                            <div className="card-header text-white bg-success">
                                {types.map((t) => (
                                    <label key={t.id} className="inline-flex items-center space-x-2 mr-2 header-format">
                                        <input
                                            type="radio"
                                            name={`group-${code}`}
                                            value={t.id}
                                            checked={String(selectedRadio[code]) === String(t.id)}
                                            onChange={() => onRadioChange(code, t.id)}
                                            className="form-radio"
                                        />
                                        <span className="text-sm px-1 fw-bold">{t.value}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="card-body px-1 text-center">
                                <div className="flex flex-wrap gap-2">
                                    {descs.length === 0 && <div className="text-sm badge bg-warning text-dark">No descriptions for this Work type.</div>}
                                    {descs.map((d) => {
                                        const selected = isChipSelected(d, code);
                                        return (
                                            <button
                                                key={d.id}
                                                onClick={() => toggleChip(d, code)}
                                                onMouseEnter={() => {
                                                    /* hover handled by tailwind class changes */
                                                }}
                                                className={`work-description-badge ${selected ? "active" : ""}`}
                                                title={`Click to ${selected ? "deselect" : "select"} '${d.value}'`}
                                            >
                                                {d.value}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>


                        {/* Chips area */}

                    </div>
                );
            })}
            {serverDataCount !== savedData.length ? "true" : "false"}
            {savedData.length}-{serverDataCount}
            <div className="mt-3 text-end">
                <ButtonBox
                    type="update"
                    className="btn-sm"
                    text="Update Work Descriptions"
                    onClickHandler={handleUpdate}
                    disabled={!(serverDataCount !== savedData.length)}
                />
            </div>
        </>
    );
}