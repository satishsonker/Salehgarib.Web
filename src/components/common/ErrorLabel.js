import React, { memo } from 'react';

const ErrorLabel = memo(({ message, fontSize = '11px' }) => {
    if (!message || message === "") return null;

    return (
        <div 
            className='text-danger' 
            style={{
                position: 'absolute',
                fontSize,
                display: "contents"
            }}
        >
            {message}
        </div>
    );
});

ErrorLabel.displayName = 'ErrorLabel';

export default ErrorLabel;
