import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import Dropdown from '../common/Dropdown'

export default function UserPermission() {
    //   const permissionModelTemplate = []
    const [roleHeaders, setRoleHeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [roleList, setRoleList] = useState([]);
    // const [permissionModel, setPermissionModel] = useState(permissionModelTemplate);
    const [selectRolePermissions, setSelectRolePermissions] = useState([]);
    const [permissionResourceList, setPermissionResourceList] = useState([])
    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.permissionController.getRole));
        apiList.push(Api.Get(apiUrls.permissionController.getPermissions + '0'));
        apiList.push(Api.Get(apiUrls.permissionController.getPermissionResource));
        Api.MultiCall(apiList)
            .then(res => {
                setIsLoading(false);
                let headers = [];
                // setRoleList(res[0].data);
                res[0].data.forEach(x => {
                    headers.push({ userRoleId: x.userRoleId, roleName: x.name });
                });
                setRoleHeaders(headers);

                setSelectRolePermissions(res[1].data);
                setPermissionResourceList(res[2].data)
            })
           ;
    }, []);

    const hasPermission = (roleId, resourceId) => {
        var resource = selectRolePermissions.find(x => x.permissionResourceId === resourceId);
        if (resource === undefined || resource === null)
            return false;
        return resource.roleId.indexOf(roleId) > -1;

    }

    const setPermission = (e, roleId, resourceId) => {
        let setNewPermission = selectRolePermissions;
        let changedPermission = setNewPermission.find(ele => ele.permissionResourceId === resourceId);
        if (e.target.checked) {
            if (changedPermission === undefined) {
                setNewPermission.push({
                    roleId: [roleId],
                    permissionResourceId: resourceId
                })
            }
            else {
                if (changedPermission?.roleId?.indexOf(roleId) === -1)
                    changedPermission.roleId.push(roleId);
            }
        }
        else
            changedPermission.roleId.pop(roleId);
        setSelectRolePermissions([...setNewPermission]);
    }
    const updatePermission = () => {
        let requestBody = [];
        selectRolePermissions.forEach(res => {
            res.roleId.forEach(role => {
                requestBody.push({ id: 0, userRoleId: role, permissionResourceId: res.permissionResourceId });
            });
        })
        Api.Post(apiUrls.permissionController.updatePermissions, requestBody)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.updateSuccess);
                    toast.info('You must be logout and login again to see the permission changes!')
                }
                else
                    toast.warn(toastMessage.updateError);
            })
    }
    return (
        <>
            <div className='card'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-12'>
                            <button className='btn btn-primary' onClick={e => updatePermission()} >Update</button>
                        </div>
                        <div className='col-12'>
                            {selectRolePermissions.length > 0 && <>
                                {
                                    <div className='card'>
                                        <div className='card-body'>
                                            <div className="table-responsive">
                                                <table className='table table-striped fixTableHead'>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Resource</th>
                                                            <th>Resource Type</th>
                                                            {
                                                                roleHeaders?.map(x => {
                                                                    return <th key={x.userRoleId}>{x.roleName}</th>
                                                                })
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            permissionResourceList?.map((res, index) => {
                                                                return <tr key={res.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{res.name}</td>
                                                                    <td>{res.resourceTypeName}</td>
                                                                    {
                                                                        roleHeaders?.map(x => {
                                                                            return <td key={x.userRoleId} className="text-center">
                                                                                <input value={x} onChange={e => setPermission(e, x.userRoleId, res.id)} checked={hasPermission(x.userRoleId, res.id)} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                                                            </td>
                                                                        })
                                                                    }
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </>}
                        </div>
                        {
                            isLoading && <div className='col-12 text-center text-info my-2'>Loading Permissions...</div>
                        }
                        {
                            !isLoading && selectRolePermissions.length === 0 && <div className='col-12 text-center text-danger my-2'>Permission not found</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
