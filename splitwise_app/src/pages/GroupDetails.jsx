import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectGroupById } from '../store/slices/groupSlice';
import { selectExpensesByGroup } from '../store/slices/expenseSlice';
import { makeGetGroupAnalytics } from '../utils/analytics';
import { useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';
import { ArrowLeft, DollarSign, Users, Calendar } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { CategoryPieChart, BalanceBarChart } from '../components/charts/DashboardCharts';
import { format } from 'date-fns';

export default function GroupDetails() {
  const { groupId } = useParams();
  const group = useSelector(selectGroupById(groupId));
  const expenses = useSelector(selectExpensesByGroup(groupId));

  const selectGroupAnalytics = useMemo(makeGetGroupAnalytics, []);
  const analytics = useSelector(state => selectGroupAnalytics(state, groupId));

  if (!group) return <div>Group not found</div>;

  const { totalGroupSpend, memberStats, categoryBreakdown } = analytics;

  // Transform memberStats for charts
  const memberSpendData = Object.entries(memberStats).map(([userId, stats]) => ({
    name: `User ${userId.split('-')[1]}`, // Simplified name
    value: stats.paid
  }));

  const memberNetData = Object.entries(memberStats).map(([userId, stats]) => ({
    name: `User ${userId.split('-')[1]}`,
    value: stats.net
  }));

  const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link to="/app/groups" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
          <p className="text-slate-500">{group.type} • {group.members.length} members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Group Spend"
          value={formatCurrency(totalGroupSpend)}
          subtext={`${expenses.length} expenses recorded`}
          icon={DollarSign}
        />
        <StatsCard
          title="Most Active"
          value={formatCurrency(Math.max(...memberSpendData.map(d => d.value)))}
          subtext="Highest payer"
          icon={Users}
        />
        <StatsCard
          title="Created"
          value={format(new Date(group.created_at), 'MMM yyyy')}
          subtext="Active since"
          icon={Calendar}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceBarChart data={memberNetData} title="Who owes who (Net Balance)" />
        <CategoryPieChart data={categoryData} title="Spending by Category" />
      </div>

      <Card title="Recent Activity">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {expenses.length === 0 ? (
            <p className="p-4 text-slate-500 text-center">No expenses yet.</p>
          ) : expenses.map(expense => (
            <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {format(new Date(expense.date), 'dd/MM')}
                </div>
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-slate-500">{expense.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(expense.amount)}</p>
                <p className="text-xs text-slate-500">Paid by User {expense.paidBy.split('-')[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
