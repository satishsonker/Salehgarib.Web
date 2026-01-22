import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

/**
 * Notification Icon Component with Badge
 * Displays notification bell icon with unread count badge
 */
const NotificationIcon = () => {
    const { unreadCount, startPolling, stopPolling } = useNotifications();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const iconRef = useRef(null);

    // Start polling when component mounts
    useEffect(() => {
        startPolling(10); // Poll every 10 seconds
        
        return () => {
            stopPolling();
        };
    }, [startPolling, stopPolling]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                iconRef.current &&
                !iconRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleIconClick = (e) => {
        e.preventDefault();
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <li className="nav-item dropdown" ref={iconRef}>
            <a
                className="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative"
                href="#notifications"
                onClick={handleIconClick}
                style={{ cursor: 'pointer' }}
                data-bs-toggle="dropdown"
                aria-expanded={isDropdownOpen}
            >
                <i className="bi bi-bell-fill" style={{ fontSize: '1.2rem' }}></i>
                {unreadCount > 0 && (
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{
                            fontSize: '0.7rem',
                            padding: '0.25em 0.5em',
                            minWidth: '1.2em',
                            animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none'
                        }}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </a>
            {isDropdownOpen && (
                <div ref={dropdownRef}>
                    <NotificationDropdown onClose={() => setIsDropdownOpen(false)} />
                </div>
            )}
            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: translate(-50%, -50%) scale(1.1);
                    }
                }
            `}</style>
        </li>
    );
};

export default NotificationIcon;

