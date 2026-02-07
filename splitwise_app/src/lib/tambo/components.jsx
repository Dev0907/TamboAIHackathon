import { z } from 'zod';
import { formatCurrency } from '../utils';
import { ComprehensiveAnalyticsChart } from '../../components/charts/ComprehensiveAnalyticsChart';

// 1. Prediction Component Definition
export const PredictionCard = ({ nextMonth, trend, confidence, reason }) => (
  <div className="flex flex-col gap-2 w-full p-4 border rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
    <p className="text-xs font-semibold text-indigo-600 uppercase">Next Month Forecast</p>
    <h3 className="text-2xl font-bold">{formatCurrency(nextMonth)}</h3>
    <div className="flex items-center gap-2">
      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${trend === 'up' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
        {trend === 'up' ? '↗ Increasing' : '↘ Decreasing'}
      </span>
      <span className="text-xs text-slate-500">({confidence}% conf)</span>
    </div>
    <p className="text-xs italic text-slate-600">"{reason}"</p>
  </div>
);

export const PredictionSchema = z.object({
  nextMonth: z.number().describe("Forecasted expense amount"),
  trend: z.enum(['up', 'down']).describe("Direction of spending trend"),
  confidence: z.number().describe("Confidence score 0-100"),
  reason: z.string().describe("Explanation for the forecast")
});

// 2. Health Component
export const HealthCard = ({ score, status, color }) => (
  <div className="p-4 border rounded-xl bg-slate-50">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-medium">Health Score</span>
      <span className={`text-lg font-bold ${color}`}>{score}/100</span>
    </div>
    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
      <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${score}%` }} />
    </div>
    <p className="text-xs mt-2">Status: {status}</p>
  </div>
);

export const HealthSchema = z.object({
  score: z.number(),
  status: z.string(),
  color: z.string()
});

// Register all components

export const ComprehensiveAnalyticsSchema = z.object({
  expenses: z.array(z.object({
    id: z.string().optional(),
    amount: z.number(),
    date: z.string(),
    category: z.string(),
    description: z.string().optional()
  })).describe("List of expenses to visualize"),
  title: z.string().optional().describe("Title of the chart")
});

export const tamboComponents = [
  {
    name: "PredictionCard",
    description: "Displays future expense forecast",
    component: PredictionCard,
    propsSchema: PredictionSchema
  },
  {
    name: "HealthCard",
    description: "Displays group financial health score",
    component: HealthCard,
    propsSchema: HealthSchema
  },
  {
    name: "ComprehensiveAnalyticsChart",
    description: "Displays detailed expense analysis with Bar, Line, and Pie charts",
    component: ComprehensiveAnalyticsChart,
    propsSchema: ComprehensiveAnalyticsSchema
  }
];
