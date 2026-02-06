import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm font-bold text-brand-600">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function SpendingAreaChart({ data, title }) {
  if (!data || data.length === 0) return <EmptyState title={title} />;

  return (
    <Card title={title} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#8b5cf6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function CategoryPieChart({ data, title }) {
  if (!data || data.length === 0) return <EmptyState title={title} />;

  return (
    <Card title={title} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function BalanceBarChart({ data, title }) {
  // data: { name: "User", value: 100 }
  if (!data || data.length === 0) return <EmptyState title={title} />;

  return (
    <Card title={title} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
          <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(val) => formatCurrency(val)} />
          <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function EmptyState({ title }) {
  return (
    <Card title={title} className="h-[400px]">
      <div className="h-full flex items-center justify-center text-center text-slate-400">
        <p>No data available to visualize</p>
      </div>
    </Card>
  );
}
