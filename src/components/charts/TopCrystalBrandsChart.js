import React, { useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import Dropdown from "../common/Dropdown";

export default function TopCrystalBrandsChart({ data = [] }) {
    const [limit, setLimit] = useState(5); // default Top 5

    // Process + sort data
    const chartData = useMemo(() => {
        const brandMap = {};

        data.forEach((item) => {
            const brand = item.crystalBrand || "Unknown";
            brandMap[brand] = (brandMap[brand] || 0) + (item.releasePieceQty || 0);
        });

        let result = Object.entries(brandMap)
            .map(([brand, qty]) => ({ brand, releasePieceQty: qty }))
            .sort((a, b) => b.releasePieceQty - a.releasePieceQty);

        if (limit > 0) {
            result = result.slice(0, limit);
        }

        return result;
    }, [data, limit]);

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h5 className="card-title text-center">Top Crystal Brands by Consumption</h5>
                <div
                    style={{ width: "100%", height: "500px" }} // 👈 MUST give fixed height
                    className="bg-white shadow-md rounded-2xl p-6"
                >
                    {/* Header with Filter */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-center text-gray-500">
                                Based on <span className="font-medium">Release Piece Quantity</span>
                            </p>
                        </div>
                       <div style={{ maxWidth: '200px' }} className="d-flex align-items-center">
                        <span className="me-2 fw-bold">Show:</span>
                         <Dropdown  data={[{ id: 5, value: 'Top 5' }, { id: 10, value: 'Top 10' }, { id: 0, value: 'All' }]} onChange={(e) => setLimit(e.target.value)} value={limit} className="form-control form-control-sm" />
                       </div>

                    </div>

                    {/* Chart */}
                    <ResponsiveContainer width="90%" height="80%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="brand"
                                angle={-35}
                                textAnchor="end"
                                interval={0}
                                tick={{ fontSize: 12, fill: "#374151" }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#374151" }}
                                tickFormatter={(val) => val.toLocaleString()}
                            />
                            <Tooltip
                                formatter={(value) => [value.toLocaleString(), "Pieces"]}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Bar
                                dataKey="releasePieceQty"
                                name="Release Qty"
                                fill="#3b82f6"
                                radius={[6, 6, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
