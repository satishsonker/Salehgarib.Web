import React from "react";

const SummaryTotals = ({ data, param }) => {
    // helper to calculate sum for a given property
    const calculateTotal = (param) => {
        return data.reduce((sum, item) => {
            const value = typeof param?.callback === 'function' ? param?.callback(Number(item[param?.prop]) || 0) : Number(item[param?.prop]) || 0;
            return sum + value;
        }, 0);
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignContent: 'flex-end', alignItems: 'flex-end' }}>
            {param.map((p, index) => {
                const total = calculateTotal(p).toFixed(2);
                return (
                    <div key={index} style={{border: '1px solid',borderRadius: '4px',padding: '0 5px',marginTop:'5px',minWidth:'270px', borderLeft: '5px solid red',display: 'flex',justifyContent: 'space-between'}}>
                        <span style={{ fontWeight: 'bold' }}>{p.displayText} :</span>  
                        <span style={{ width: '100px', fontWeight: 'bold', fontSize: '16px', display: 'inline-block', textAlign: 'right' }}>{total}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default SummaryTotals;
