import React from 'react'
import { common } from '../../utils/common';
import TableAction from './TableAction'

export default function TableView({option}) {
    option = common.defaultIfEmpty(option, {});
    option.headers = common.defaultIfEmpty(option.headers, []);
    option.items = common.defaultIfEmpty(option.items, []);
    option.buttons = common.defaultIfEmpty(option.buttons, []);
    option.handler = common.defaultIfEmpty(option.handler, ()=>{});
  return (
    <>
     <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="example" className="table table-striped table-bordered" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                   {
                                    option.headers.map((ele)=>{
                                      return  <th>{ele}</th>
                                    })
                                   }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Tiger Nixon</td>
                                    <td>System Architect</td>
                                    <td>Edinburgh</td>
                                    <td>61</td>
                                    <td>2011/04/25</td>
                                    <td>
                                       <TableAction></TableAction>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Garrett Winters</td>
                                    <td>Accountant</td>
                                    <td>Tokyo</td>
                                    <td>63</td>
                                    <td>2011/07/25</td>
                                    <td>
                                    <TableAction></TableAction>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Ashton Cox</td>
                                    <td>Junior Technical Author</td>
                                    <td>San Francisco</td>
                                    <td>66</td>
                                    <td>2009/01/12</td>
                                    <td>
                                    <TableAction></TableAction>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Cedric Kelly</td>
                                    <td>Senior Javascript Developer</td>
                                    <td>Edinburgh</td>
                                    <td>22</td>
                                    <td>2012/03/29</td>
                                    <td>
                                    <TableAction></TableAction>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Airi Satou</td>
                                    <td>Accountant</td>
                                    <td>Tokyo</td>
                                    <td>33</td>
                                    <td>2008/11/28</td>
                                    <td>
                                    <TableAction></TableAction>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Brielle Williamson</td>
                                    <td>Integration Specialist</td>
                                    <td>New York</td>
                                    <td>61</td>
                                    <td>2012/12/02</td>
                                    <td>
                                    <TableAction></TableAction>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Herrod Chandler</td>
                                    <td>Sales Assistant</td>
                                    <td>San Francisco</td>
                                    <td>59</td>
                                    <td>2012/08/06</td>
                                    <td>
                                    <TableAction></TableAction>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Office</th>
                                    <th>Age</th>
                                    <th>Start date</th>
                                    <th>Salary</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
    </>
  )
}
