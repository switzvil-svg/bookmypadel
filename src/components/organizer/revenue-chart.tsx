"use client";

import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2F5BFF" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#2F5BFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#E1E5F0" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#5B6479" }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#5B6479" }}
            width={68}
            tickFormatter={(value: number) => `${value.toLocaleString("fr-FR")} €`}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #E1E5F0", fontSize: 13 }}
            formatter={(value: number) => [`${value} €`, "Revenus"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#2F5BFF" strokeWidth={2.5} fill="url(#revenueFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
