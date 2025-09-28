import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function WithdrawalsChart({ data }) {
  const chartData = data.map((item) => ({
    date: item._id || "N/A",
    amount: item.totalAmount || 0,
    count: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#4CAF50" />
        <Bar dataKey="count" fill="#FF9800" />
      </BarChart>
    </ResponsiveContainer>
  );
}
