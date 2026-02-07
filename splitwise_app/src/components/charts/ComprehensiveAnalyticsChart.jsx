import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'];

export function ComprehensiveAnalyticsChart({ expenses, title = "Expense Analysis" }) {
  const [chartType, setChartType] = useState('bar');

  // 1. Process Data: Group by Date and Category
  const processedData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    // Map: Date -> { date, Food: 100, Transport: 50, ... }
    const dateMap = {};
    const categories = new Set();

    expenses.forEach(e => {
      const dateKey = format(new Date(e.date), 'MMM dd');
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { date: dateKey, total: 0 };
      }
      if (!dateMap[dateKey][e.category]) {
        dateMap[dateKey][e.category] = 0;
      }
      dateMap[dateKey][e.category] += e.amount;
      dateMap[dateKey].total += e.amount;
      categories.add(e.category);
    });

    // Convert to Array and Sort by Date
    // Note: Simple string sort might fail for cross-month/year, ideally sort by timestamp then format
    // But for this hackathon context, we'll trust the order or just reverse standard array if needed.
    // Better: Sort expenses by date first, then aggregating preserves order.

    // Let's re-do to ensure date order
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    const orderedDateMap = {};

    sortedExpenses.forEach(e => {
      const dateKey = format(new Date(e.date), 'MMM dd');
      if (!orderedDateMap[dateKey]) {
        orderedDateMap[dateKey] = { date: dateKey }; // Initialize
      }
      if (!orderedDateMap[dateKey][e.category]) {
        orderedDateMap[dateKey][e.category] = 0;
      }
      orderedDateMap[dateKey][e.category] += e.amount;
      categories.add(e.category);
    });

    return {
      data: Object.values(orderedDateMap),
      categories: Array.from(categories)
    };
  }, [expenses]);

  // For Pie Chart: Aggregate by Category only
  const pieData = useMemo(() => {
    if (!expenses) return [];
    const catMap = {};
    expenses.forEach(e => {
      if (!catMap[e.category]) catMap[e.category] = 0;
      catMap[e.category] += e.amount;
    });
    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [expenses]);


  const renderChart = () => {
    if (!processedData.data || processedData.data.length === 0) {
      return <div className="flex h-full items-center justify-center text-slate-400">No data available</div>;
    }

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend iconType="circle" />
              {processedData.categories.map((cat, index) => (
                <Line
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend iconType="circle" />
              {processedData.categories.map((cat, index) => (
                <Bar
                  key={cat}
                  dataKey={cat}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                  radius={index === processedData.categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
          {['bar', 'line', 'pie'].map(type => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartType === type
                  ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[300px] w-full p-4">
        {renderChart()}
      </div>
    </div>
  );
}
