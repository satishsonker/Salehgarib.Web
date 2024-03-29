import React from 'react'
import { Link } from 'react-router-dom';
import { common } from '../../utils/common'
import { useNavigate } from 'react-router-dom';

export default function Breadcrumb({ option }) {
  let navigate = useNavigate();
  const buttonType = {
    link: 'link',
    button: 'button'
  }
  option = common.defaultIfEmpty(option, {});
  option.title = common.defaultIfEmpty(option.title, 'Breadcrumb Title');
  option.items = common.defaultIfEmpty(option.items, []);
  option.buttons = common.defaultIfEmpty(option.buttons, []);
  const customButtonHandler = (ele) => {

    ele.type = common.defaultIfEmpty(ele.type, buttonType.button);
    ele.url = common.defaultIfEmpty(ele.url, '/');
    if (ele.type === buttonType.button)
      ele.handler();
    else {
      navigate(ele.url);
    }
  }
  const btnColors=["btn-warning","btn-primary","btn-success","btn-secondary","btn-danger","btn-info","btn-dark"]
  return (
    <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
      <div className="breadcrumb-title pe-3 text-uppercase" style={{ fontSize: '15px' }}>{option.title}</div>
      <div className="ps-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 p-0">
            <li key={111} className="breadcrumb-item">
              <Link title='Home' to='/dashboard'>
                <i className="bx bx-home-alt"></i>
              </Link>
            </li>
            {
              option.items.map((ele, index) => {
                ele.link = common.defaultIfEmpty(ele.link, "");
                ele.title = ele.name !== undefined && ele.title === undefined ? ele.name : ele.title;
                ele.isActive = common.defaultIfEmpty(ele.isActive, true);
                return <li key={index} className={ele.isActive ? "breadcrumb-item active" : "breadcrumb-item"} aria-current={ele.isActive ? 'page' : ''}>
                  {ele.isActive ? <Link title={ele.title} to={ele.link}><i className={ele.icon}></i> {ele.name}</Link> : <><i title={ele.title} className={ele.icon} /> {ele.name}</>}
                </li>
              })
            }
          </ol>
        </nav>
      </div>
      <div className="ms-auto">
        <div className="btn-group">
          {
            option.buttons.map((ele, index) => {
              return <button title={ele.text} type="button" key={index} className={"btn btn-sm "+btnColors[index]} style={{ fontSize: 'var(--app-font-size)',cursor:"pointer" }} onClick={e => customButtonHandler(ele)} data-bs-toggle="modal" data-bs-target={"#" + ele.modelId}><i className={ele.icon}></i> {ele.text}</button>
            })
          }
        </div>
      </div>
    </div>
  )
}
