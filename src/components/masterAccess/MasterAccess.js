import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { toast } from 'react-toastify';
import { headerFormat } from '../../utils/tableHeaderFormat';
import { common } from '../../utils/common';
import { validationMessage } from '../../constants/validationMessage';
import TableView from '../tables/TableView';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
export default function MasterAccess() {
    const accessDataModelTemplet = {
        id: 0,
        userName: "",
        employeeId: 0,
        roleId: 0,
        masterMenuId: 0,
        oldPassword: "",
        password: "",
        confirmPassword: "",
        masterAccessDetails: []
    };
    const [accessDataModel, setAccessDataModel] = useState(accessDataModelTemplet);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState({});
    const [menuList, setMenuList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [jobTitleList, setJobTitleList] = useState([]);
    const [isUsernameExist, setIsUsernameExist] = useState(false);

    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.dropdownController.employee));
        apiList.push(Api.Get(apiUrls.permissionController.getRole));
        apiList.push(Api.Get(apiUrls.masterAccessController.getMenus));
        apiList.push(Api.Get(apiUrls.dropdownController.jobTitle));
        Api.MultiCall(apiList)
            .then(res => {
                setEmployeeList(res[0].data);
                setRoleList(res[1].data);
                setMenuList(res[2].data);
                setJobTitleList(res[3].data);
            });
    }, []);

    const handleTextChange = (e) => {
        var { name, value, type } = e.target;
        var model = accessDataModel;
        if (type === 'select-one') {
            value = parseInt(value);
        }
        if (name === "userName") {
            common.throttling(() => {
                Api.Get(apiUrls.masterAccessController.checkUsername + `?userName=${value}`)
                    .then(res => {
                        setIsUsernameExist(res.data);
                    })
            }, 3000)

        }
        if (name === 'masterMenuId') {
            if (model.masterAccessDetails.find(x => x.masterMenuId === value) === undefined) {
                var menuName = menuList.find(x => x.id === value);
                model.masterAccessDetails.push({ masterMenuId: value, accessId: 0, menuName: menuName?.name });
            }
        }
        setAccessDataModel({ ...model, [name]: value });
    }

    const removeMenu = (menuId) => {
        var model = accessDataModel;
        var newDetails = [];
        model.masterAccessDetails.forEach(ele => {
            if (ele.masterMenuId !== menuId) {
                newDetails.push(ele);
            }
        });
        model.masterAccessDetails = newDetails;
        setAccessDataModel({ ...model });
    }
    useEffect(() => {
        Api.Get(apiUrls.masterAccessController.getAllMasterAccess + `?pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            })
    }, [pageNo, pageSize, isRecordSaving])

    const saveButtonHandler = () => {
        setAccessDataModel({ ...accessDataModelTemplet });
        setIsRecordSaving(true);
    }
    const breadcrumbOption = {
        title: 'Master Access',
        items: [
            {
                title: "Access",
                icon: "bi bi-journal-bookmark-fill",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Add Access",
                icon: 'bx bx-plus',
                modelId: 'add-master-access',
                handler: saveButtonHandler
            }
        ]
    }
    const validateError = () => {
        const { roleId, employeeId, userName, password, confirmPassword,masterAccessDetails } = accessDataModel;
        const newError = {};
        if (masterAccessDetails?.length === 0) newError.masterMenuId = validationMessage.departRequired;
        if (!roleId || roleId === 0) newError.roleId = validationMessage.userRoleRequired;
        if (!employeeId || employeeId === 0) newError.employeeId = validationMessage.employeeRequired;
        if (!userName || userName === "") newError.userName = validationMessage.userNameRequired;
        if (!password || password === "") newError.password = validationMessage.passwordRequired;
        if (password !== "" && password?.length < 8) newError.password = validationMessage.passwordLengthRequired;
        if (isUsernameExist) newError.userName = validationMessage.userNameAlreadyExist;
        if (!confirmPassword || confirmPassword === "") newError.confirmPassword = validationMessage.confirmPasswordRequired;
        return newError;
    }
    const handleSave = () => {
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        let data = accessDataModel;
        if (isRecordSaving) {
            Api.Put(apiUrls.masterAccessController.addMasterAccess, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closePopupCustomerDetails');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.customerController.update, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closePopupCustomerDetails');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (id) => {
        Api.Get(apiUrls.masterAccessController.getMasterAccess + id).then(res => {
            debugger;
            if (res.data.id > 0) {
                setAccessDataModel({ ...res.data });
                setIsRecordSaving(false);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    }
    const handleDelete = (id) => {
        Api.Delete(apiUrls.masterAccessController.deleteMasterAccess + id).then(res => {
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
        Api.Get(apiUrls.masterAccessController.searchMasterAccess + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm.replace('+', "")}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }
    const tableOptionTemplet = {
        headers: headerFormat.masterAccess,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            view: {
                //handler: viewCustomerOrders,
                title: "View Customer Orders"
            },
            popupModelId: "add-master-access",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Master Access</h6>
            <hr />
            <TableView option={tableOption}></TableView>
            <div id="add-master-access" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">User Access</h5>
                            <button type="button" className="btn-close" id='closePopupCustomerDetails' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className="col-12">
                                            <Label text="Depart" isRequired={true} fontSize='12px' />
                                            <Dropdown data={menuList} className="form-control-sm" name="masterMenuId" text="name" onChange={handleTextChange} defaultText="Select Depart" />
                                            <ErrorLabel message={errors?.masterMenuId} />
                                            <div className='menu-con-items'>
                                                {
                                                    accessDataModel?.masterAccessDetails?.map((ele, index) => {
                                                        return <div key={index} className='con-item'>
                                                            <span>{ele?.menuName}</span>
                                                            <span onClick={e=>removeMenu(ele?.masterMenuId)}><i className='bi bi-x text-danger'></i></span>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <Label text="Role" isRequired={true} fontSize='12px' />
                                            <Dropdown data={roleList} className="form-control-sm" value={accessDataModel.roleId} text="name" elementKey="userRoleId" name="roleId" onChange={handleTextChange} defaultText="Select Role" />
                                            <ErrorLabel message={errors?.roleId} />
                                        </div>
                                        <div className="col-12">
                                            <Label text="Employee" isRequired={true} fontSize='12px' />
                                            <Dropdown data={employeeList.filter(x => x.data.userRoleId === accessDataModel.roleId)} className="form-control-sm" value={accessDataModel.employeeId} name="employeeId" onChange={handleTextChange} defaultText="Select Employee/Staff" />
                                            <ErrorLabel message={errors?.employeeId} />
                                        </div>
                                        <div className="col-12">
                                            <Inputbox labelText="Username" disabled={!isRecordSaving} isRequired={true} errorMessage={errors?.userName} name="userName" value={accessDataModel.userName} type="text" className="form-control form-control-sm" onChangeHandler={handleTextChange} />
                                        </div>
                                        <div className="col-12">
                                            <Inputbox labelText="Password" isRequired={true} errorMessage={errors?.password} name="password" value={accessDataModel.password} type="password" className="form-control form-control-sm" onChangeHandler={handleTextChange} />
                                        </div>
                                        <div className="col-12">
                                            <Inputbox labelText="Confirm Password" isRequired={true} errorMessage={errors?.confirmPassword} name="confirmPassword" value={accessDataModel.confirmPassword} type="password" className="form-control form-control-sm" onChangeHandler={handleTextChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox text={isRecordSaving ? "Save" : "Update"} type="save" onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" className="btn-sm" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
