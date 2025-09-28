import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function TopReferrersChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          interval={0}
          angle={-30}
          textAnchor="end"
          height={70}
          tick={{ fontSize: 10 }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="referrals" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
