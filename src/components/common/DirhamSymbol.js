import React from 'react';

const DirhamSymbol = ({ amount, show = true, size = '9' }) => {
    const isValidAmount = amount !== undefined && amount !== null && amount !== '';

    if (!isValidAmount) {
        show = false;
    }

    return (
        <span>
            {show && <span style={{ fontSize: `${size}px` }} className="uae-symbol">ê</span>}
            {isValidAmount && <span> {amount}</span>}
        </span>
    );
};

export default DirhamSymbol;
