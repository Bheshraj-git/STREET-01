"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { formatPrice } from "@/lib/utils";

export function RevenueChart({
    data,
}: {
    data: { date: string; revenue: number; orders: number }[];
}) {
    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="var(--muted-foreground)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v: string) => v.slice(5)}
                        interval={4}
                    />
                    <YAxis
                        stroke="var(--muted-foreground)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v: number) =>
                            v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
                        }
                        width={40}
                    />
                    <Tooltip
                        contentStyle={{
                            background: "var(--foreground)",
                            color: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: 0,
                            fontSize: 12,
                        }}
                        labelFormatter={(label: string) =>
                            new Date(label).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })
                        }
                        formatter={(value: number, name: string) => {
                            if (name === "revenue") return [formatPrice(value), "Revenue"];
                            return [value, "Orders"];
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--accent)"
                        strokeWidth={1.5}
                        fill="url(#rev)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}