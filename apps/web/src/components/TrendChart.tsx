"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TrendChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="h-64" role="img" aria-label="Trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
          <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B8862B" stopOpacity={0.35} /><stop offset="100%" stopColor="#B8862B" stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid stroke="#E6E8E0" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#946A1E" strokeWidth={2} fill="url(#g)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
