import React from 'react'
import { PieChart, Pie,Cell, Label, LabelList } from 'recharts';
import { common } from '../../utils/common';

export default function SalehPieChart({data,h=350,w=350,outerRadius}) {
    outerRadius=common.defaultIfEmpty(outerRadius,(w/2)-((w/100)*30))
    data=common.defaultIfEmpty(data, [
            { name: 'Group A', value: 400 },
            { name: 'Group B', value: 300 },
            { name: 'Group C', value: 300 },
            { name: 'Group D', value: 200 },
        ]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042','#7DFF33','#33FFE6','#8033FF'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index,a,b,c,d,e,f,g }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }
    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <PieChart width={w} height={h} >
                <Pie
                    data={data}
                    cx={w/2}
                    cy={h/2}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={outerRadius}
                    fill="#8884d8"
                    dataKey="value" 
                    nameKey="name"
                >
                     <LabelList dataKey="name"  position="outside" color='#fff'   style={{stroke:'red',fontSize:'10px', fill: 'rgba(0, 0, 0, 0.87)' }}/>
                    {data.map((entry, index) => (
                       <> <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        </>
                    ))}
                </Pie>
            </PieChart>
        </div>
    )
}
