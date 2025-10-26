import { common } from "./common";

// Delivery date formatter
 const formatDeliveryDate = (rowData, header) => {

    if (!rowData) return '';
    debugger;
    
    const deliveryDate = new Date(rowData);
    const today = new Date();
    const diffTime = deliveryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let color, label;
    if (diffDays < 0) {
        color = 'danger';
        label = `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
        color = 'warning';
        label = 'Due Today';
    } else if (diffDays <= 2) {
        color = 'warning';
        label = `${diffDays} days left`;
    } else if (diffDays <= 5) {
        color = 'info';
        label = `${diffDays} days left`;
    } else {
        color = 'success';
        label = `${diffDays} days left`;
    }
    
    return (
        <div style={{fontSize: '12px', lineHeight: '1.2'}}>
            <div>{common.getHtmlDate(deliveryDate,'ddmmyyyy')}</div>
            <div className={`badge bg-${color} text-white`} style={{fontSize: '10px', marginTop: '2px'}}>
                {label}
            </div>
        </div>
    );
};

export { formatDeliveryDate };