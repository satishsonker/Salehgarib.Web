import React from 'react'

export default function DashboardCard({
    title,
    subtitle,
    value,
    icon,
    colorClass
}) {
    const formattedValue = value !== undefined && value !== null ? value.toLocaleString() : '0';
    
    return (
        <div className="col" data-toggle="tooltip" title={title + " " + (subtitle ?? "")}>
            <div 
                className="card border-0 shadow-sm dashboard-card-hover h-100" 
                style={{ 
                    borderRadius: '15px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
            >
                <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="flex-grow-1">
                            <div className="text-muted small mb-1" style={{ fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {title}
                            </div>
                            {subtitle && (
                                <div className="text-muted" style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                                    {subtitle}
                                </div>
                            )}
                            <h3 className="mb-0" style={{ 
                                color: '#293445', 
                                fontWeight: '700',
                                fontSize: '2rem',
                                lineHeight: '1.2'
                            }}>
                                {formattedValue}
                            </h3>
                        </div>
                        <div 
                            className={"widget-icon-large text-white d-flex align-items-center justify-content-center "+colorClass}
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '12px',
                                fontSize: '1.8rem',
                                flexShrink: 0
                            }}
                        >
                            <i className={"bi "+icon}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
