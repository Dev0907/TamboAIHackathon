import { useSelector } from 'react-redux';
import { selectAllExpenses } from '../store/slices/expenseSlice';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';
import { format } from 'date-fns';

export default function Expenses() {
  const expenses = useSelector(selectAllExpenses);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Recent Expenses</h1>
      <Card>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {expenses.map(expense => (
            <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
                  {format(new Date(expense.date), 'MMM d')}
                </div>
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-slate-500">{expense.category} • Paid by User {expense.paidBy.split('-')[1]}</p>
                </div>
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(expense.amount)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
