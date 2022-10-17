import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import Dropdown from '../common/Dropdown'

export default function UserPermission() {
    const permissionModelTemplate = {
        userId: 0
    }
    const [userList, setUserList] = useState([]);
    const [permissionModel, setPermissionModel] = useState(permissionModelTemplate);
    const [selectUserPermissions, setSelectUserPermissions] = useState([])
    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.authController.getUsers));
        Api.MultiCall(apiList)
            .then(res => {
                setUserList(res[0].data);
            })
            .catch(err => {

            })
    }, []);

    const onUserSelectHandler = (data) => {
        debugger;
        setPermissionModel({ ...permissionModel, ['userId']: data.id });
        if (data.id > 0) {
            Api.Get(apiUrls.permissionController.getPermissions + data.id)
                .then(res => {
                    setSelectUserPermissions(res.data);
                })
        }
    }

    return (
        <>
            <div className='card'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-12'>
                            UserName <Dropdown data={userList} searchable={true} value={permissionModel.userId} elemenyKey="id" text="name" defaultText='Select User' defaultValue='' itemOnClick={onUserSelectHandler} />
                        </div>
                        <div className='col-12'>
                            {selectUserPermissions.length > 0 && <>
                                {
                                    <div className='card'>
                                        <div className='card-body'>
                                            <table className='table table-striped'>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Resource</th>
                                                        <th>Resource Type</th>
                                                        <th>Create</th>
                                                        <th>View</th>
                                                        <th>Update</th>
                                                        <th>Delete</th>
                                                        <th>Print</th>
                                                        <th>Cancel</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        selectUserPermissions?.map((res, index) => {
                                                            return <tr key={res.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{res.permissionResourceName}</td>
                                                                <td>{res.permissionResourceType}</td>
                                                                <td>
                                                                    <div className="form-check form-switch">
                                                                        <input checked={res.create ? "checked" : ""} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="form-check form-switch">
                                                                        <input checked={res.view ? "checked" : ""} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="form-check form-switch">
                                                                        <input checked={res.update ? "checked" : ""} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="form-check form-switch">
                                                                        <input checked={res.delete ? "checked" : ""} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="form-check form-switch">
                                                                        <input checked={res.print ? "checked" : ""} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="form-check form-switch">
                                                                        <input checked={res.cancel ? "checked" : ""} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
                            </>}
                        </div>
                        {
                        selectUserPermissions.length === 0 &&  <div className='col-12 text-center text-danger my-2'>User not selected or permission not found</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
