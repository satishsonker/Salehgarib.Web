import React from 'react'
import { Link } from 'react-router-dom';
import { common } from '../../utils/common'

export default function Breadcrumb({ option }) {
  option = common.defaultIfEmpty(option, {});
  option.title = common.defaultIfEmpty(option.title, 'Breadcrumb Title');
  option.items = common.defaultIfEmpty(option.items, []);
  option.buttons = common.defaultIfEmpty(option.buttons, []);
  return (
    <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
      <div className="breadcrumb-title pe-3">{option.title}</div>
      <div className="ps-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 p-0">
            <li className="breadcrumb-item">
              <a href="#">
                <i className="bx bx-home-alt"></i>
              </a>
            </li>
            {
              option.items.map((ele) => {
                ele.link = common.defaultIfEmpty(ele.link, "");
                ele.isActive = common.defaultIfEmpty(ele.isActive, true);
                return <li key={ele.name} className={ele.isActive ? "breadcrumb-item active" : "breadcrumb-item"} aria-current={ele.isActive ? 'page' : ''}>{ele.isActive ? <Link to={ele.link}><i className={ele.icon}></i>{ele.name}</Link> : <><i className={ele.icon} /> {ele.name}</>}</li>
              })
            }
          </ol>
        </nav>
      </div>
      <div className="ms-auto">
        <div className="btn-group">
          {
            option.buttons.map((ele) => {
              return <button type="button" key={ele.text} className="btn btn-primary" onClick={e=>ele.handler()} data-bs-toggle="modal" data-bs-target={"#"+ele.modelId}><i className={ele.icon}></i> {ele.text}</button>
            })
          }
        </div>
      </div>
    </div>
  )
}
