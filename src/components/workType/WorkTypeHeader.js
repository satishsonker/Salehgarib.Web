import React from 'react';
import PropTypes from 'prop-types';

const WorkTypeHeader = ({ headerData, setSelectWorkTypeOption, selectedWorkTypeId }) => {
    // Early return if no data
    if (!headerData?.length) return null;

    // Styles
    const headerStyles = {
        container: {
            width: '100%',
            borderBottom: '2px solid #dee2e6',
            marginBottom: '0.75rem',
            padding: '0.5rem 0',
            backgroundColor: '#f8f9fa'
        },
        singleHeader: {
            fontSize: '1rem',
            fontWeight: '500',
            color: '#495057',
            padding: '0.25rem 0'
        },
        radioGroup: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.25rem 0'
        },
        radioLabel: {
            fontSize: '1rem',
            display: 'flex',
            fontWeight: '500',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            transition: 'background-color 0.2s ease'
        },
        radioInput: {
            marginRight: '0.5rem'
        }
    };

    // Single header render
    if (headerData.length === 1) {
        return (
            <div style={headerStyles.container}>
                <div style={headerStyles.singleHeader}>
                    {headerData[0].value}
                </div>
            </div>
        );
    }

    // Multiple headers with radio buttons
    return (
        <div style={headerStyles.container}>
            <div style={headerStyles.radioGroup}>
                {headerData.map((header, index) => (
                    <label
                        key={header.id}
                        className="form-check form-check-inline"
                        htmlFor={`workType_${header.id}`}
                        style={headerStyles.radioLabel}
                    >
                        <input
                            className="form-check-input"
                            type="radio"
                            name={`workType_${header.code}`}
                            id={`workType_${header.id}`}
                            checked={selectedWorkTypeId.includes(header.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectWorkTypeOption({...header});
                                }
                            }}
                            style={headerStyles.radioInput}
                        />
                        <span className="form-check-label">
                            {header.value}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

// PropTypes for better development experience and documentation
WorkTypeHeader.propTypes = {
    headerData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            code: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    )
};

// Default props
WorkTypeHeader.defaultProps = {
    headerData: []
};

export default React.memo(WorkTypeHeader);
