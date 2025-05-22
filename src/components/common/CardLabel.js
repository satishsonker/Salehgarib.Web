import React, { memo } from 'react';

const CardLabel = memo(({ text, value, title, valueFontSize }) => {
    return (
        <div className='labelAmount' title={title}>
            <span className='text'>{text}</span>
            <span 
                className='amount' 
                style={valueFontSize ? { fontSize: valueFontSize } : undefined}
            >
                {value}
            </span>
        </div>
    );
});

CardLabel.displayName = 'CardLabel';

export default CardLabel;
