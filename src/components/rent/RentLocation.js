import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import RegexFormat from '../../utils/RegexFormat';
import Breadcrumb from '../common/Breadcrumb';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function RentLocation() {
    const rentLocationTemplate = {
        id: 0,
        address: '',
        locationName: '',
        remark: ''
    }
    const [rentLocationModel, setRentLocationModel] = useState(rentLocationTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [errors, setErrors] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.rentController.deleteLocation + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        }).catch(err => {
            toast.error(toastMessage.deleteError);
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.rentController.searchLocation + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = rentLocationModel;
        data[name] = value;
        setRentLocationModel({ ...data });

        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null })
        }
    }
    const handleSave = (e) => {
        debugger;
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }

        let data = common.assignDefaultValue(rentLocationTemplate, rentLocationModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.rentController.addLocation, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-rentLocation');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.rentController.updateLocation, rentLocationModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('add-rentLocation');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (rentLocationId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.rentController.getLocation + rentLocationId).then(res => {
            if (res.data.id > 0) {
                setRentLocationModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'Location', prop: 'locationName' },
            { name: 'Address', prop: 'address' },
            { name: 'Remark', prop: 'remark' }
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            popupModelId: "add-rentLocation",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };


    const saveButtonHandler = () => {

        setRentLocationModel({ ...rentLocationTemplate });
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
   

    const breadcrumbOption = {
        title: 'Holiday',
        items: [
            {
                title: "Rent Location",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Rent Location",
                icon: 'bx bx-plus',
                modelId: 'add-rentLocation',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.rentController.getAllLocation + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setRentLocationModel({ ...rentLocationTemplate });
        }
    }, [isRecordSaving]);

   

    const validateError = () => {
        const { locationName } = rentLocationModel;
        const newError = {};
        if (!locationName || locationName === "") newError.locationName = validationMessage.locationNameRequired;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Rent Location Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-rentLocation" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Rent Location</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Rent Location" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="locationName" value={rentLocationModel.locationName} type="text" id='value' className="form-control" />
                                                <ErrorLabel message={errors?.locationName}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Location Address"></Label>
                                                <input required onChange={e => handleTextChange(e)} name="address" value={rentLocationModel.address} type="text" id='value' className="form-control" />
                                                <ErrorLabel message={errors?.address}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Location Remark"></Label>
                                                <input required onChange={e => handleTextChange(e)} name="remark" value={rentLocationModel.remark} type="text" id='value' className="form-control" />
                                                <ErrorLabel message={errors?.remark}></ErrorLabel>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" onClick={e => handleSave(e)} className="btn btn-info text-white waves-effect" >{isRecordSaving ? 'Save' : 'Update'}</button>
                            <button type="button" className="btn btn-danger waves-effect" id='closePopup' data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>

    )
}
