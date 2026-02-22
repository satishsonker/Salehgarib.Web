import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { common } from '../../utils/common'

export default function LeftMenuItem({ link, icon, menuName, title, hasAccess }) {
    const location = useLocation();
    title = common.defaultIfEmpty(title, menuName);
    const isActive = location.pathname === `/${link}` || location.hash === `#/${link}`;
    
    return (
        <>
            {hasAccess(menuName) && (
                <Link 
                    to={"/" + link} 
                    title={title}
                    className={`menu-item-link ${isActive ? 'active' : ''}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        margin: '2px 0',
                        textDecoration: 'none',
                        color: isActive ? '#015f95' : '#5f5f5f',
                        backgroundColor: isActive ? 'rgba(1, 95, 149, 0.1)' : 'transparent',
                        fontWeight: isActive ? '600' : '400',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                        if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'rgba(1, 95, 149, 0.05)';
                            e.currentTarget.style.color = '#015f95';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#5f5f5f';
                        }
                    }}
                >
                    {icon !== "" && (
                        <div className="parent-icon" style={{
                            fontSize: '18px',
                            marginRight: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px'
                        }}>
                            <i className={"bi " + icon}></i>
                        </div>
                    )}
                    <div className={icon !== "" ? "menu-title" : ""} style={{
                        flex: 1,
                        fontSize: '13px',
                        letterSpacing: '0.3px'
                    }}>
                        {menuName}
                    </div>
                    {isActive && (
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '3px',
                            height: '60%',
                            backgroundColor: '#015f95',
                            borderRadius: '0 3px 3px 0'
                        }}></div>
                    )}
                </Link>
            )}
        </>
    )
}
