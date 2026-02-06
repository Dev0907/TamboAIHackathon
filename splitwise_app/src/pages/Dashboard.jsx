import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/userSlice';
import { makeGetUserAnalytics } from '../utils/analytics';
import { StatsCard } from '../components/ui/StatsCard';
import { SpendingAreaChart, CategoryPieChart, BalanceBarChart } from '../components/charts/DashboardCharts';
import { DollarSign, CreditCard, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function Dashboard() {
  const currentUser = useSelector(selectCurrentUser);
  const selectUserAnalytics = useMemo(makeGetUserAnalytics, []);

  const analytics = useSelector(state =>
    currentUser ? selectUserAnalytics(state, currentUser.id) : null
  );

  if (!currentUser || !analytics) return <div className="p-8">Loading...</div>;

  const { totalPaid, totalShare, netBalance, balanceMap, categoryBreakdown, spendingHistory } = analytics;

  // Convert balanceMap to chart data
  const balanceData = Object.entries(balanceMap)
    .map(([id, amount]) => ({ name: `User ${id.split('-')[1]}`, value: amount }))
    .filter(item => item.value !== 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, {currentUser.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Net Balance"
          value={formatCurrency(netBalance)}
          subtext={netBalance >= 0 ? "You are owed in total" : "You owe in total"}
          trend={12} // Mock trend
          trendLabel="vs last month"
          icon={DollarSign}
          className={netBalance >= 0 ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-red-500"}
        />
        <StatsCard
          title="Total Spending"
          value={formatCurrency(totalShare)}
          subtext="Your share of expenses"
          icon={CreditCard}
        />
        <StatsCard
          title="Total Paid"
          value={formatCurrency(totalPaid)}
          subtext="Amount you physically paid"
          icon={TrendingUp}
        />
        <StatsCard
          title="Active Groups"
          value="2"
          subtext="Groups you belong to"
          icon={Users}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingAreaChart data={spendingHistory} title="Spending Trend" />
        <CategoryPieChart data={categoryBreakdown} title="Expense Breakdown" />
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BalanceBarChart data={balanceData} title="Balances with Friends" />
        </div>
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-bold mb-4">Smart Insights</h3>
          <ul className="space-y-4 text-brand-100">
            <li className="flex items-start gap-3">
              <span className="bg-white/20 p-1.5 rounded-lg text-white">💡</span>
              <p className="text-sm">You spend <span className="font-bold text-white">22% more</span> when traveling compared to home expenses.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 p-1.5 rounded-lg text-white">🏆</span>
              <p className="text-sm">You are the top payer in <span className="font-bold text-white">Vegas Trip</span> group.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 p-1.5 rounded-lg text-white">📉</span>
              <p className="text-sm">Your dining out expenses decreased by 15% this month. Great job!</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
