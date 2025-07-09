import React, { memo, useMemo } from 'react';
import { common } from '../../utils/common';

const PrintLabel = memo(({ label, option = {}, text }) => {
    const processedOption = useMemo(() => ({
        labelBold: option.labelBold ?? true
    }), [option.labelBold]);

    return (
        <div className='print-lable'>
            <span className='lable'>
                {processedOption.labelBold ? <strong>{label}</strong> : label}
            </span>
            <span className='text'>{text}</span>
        </div>
    );
});

PrintLabel.displayName = 'PrintLabel';

export default PrintLabel;
