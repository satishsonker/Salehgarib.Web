import React from 'react'
import { PieChart, Pie, Cell, Label, LabelList } from 'recharts';
import { common } from '../../utils/common';

export default function SalehPieChart({ data, h = 350, w = 350, outerRadius }) {
    outerRadius = common.defaultIfEmpty(outerRadius, (w / 100) * 30)
    data = common.defaultIfEmpty(data, [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#7DFF33', '#33FFE6', '#8033FF'];
    data?.map((ele, index) => {
        data[index].fill = COLORS[index];
    })
    const actualData = [
        {
            data: data
        }
    ]
    return (<>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'space-around' }}>
            <div>
                <PieChart width={w} height={h} >
                    {actualData.map((s, index) => {
                        return <Pie key={index}
                            dataKey="value"
                            isAnimationActive={true}
                            data={s.data}
                            cx={w / 2.1}
                            cy={h / 2.1}
                            outerRadius={outerRadius}
                            innerRadius={0}
                            fill="#fff"
                            label
                        ></Pie>
                    })
                    }
                    {/* <Pie
                    data={data}
                    cx={w / 2}
                    cy={h / 2}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={outerRadius}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    <LabelList dataKey="name" position="outside" color='#fff' style={{ stroke: 'red', fontSize: '10px', fill: 'rgba(0, 0, 0, 0.87)' }} />
                    {data.map((entry, index) => (
                        <> <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        </>
                    ))}
                </Pie> */}
                </PieChart>
            </div>
            <div>
                <ul className="list-group">
                    {actualData.map((s, sIndex) => {
                        var sum = 0;
                        s.data.filter(x => {
                            sum += x.value
                        });
                        return s.data.map((t,tIndex) => {
                            return <li key={(sIndex*10000000)+tIndex} className="list-group-item d-flex justify-content-between align-items-center">
                                <span className="badge text-black badge-pill" style={{ background: t.fill }}>{t.name}-{((t.value / sum) * 100).toFixed(2)}%</span>
                            </li>
                        })
                    })}
                </ul>
            </div>
        </div>

    </>
    )
}
