import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../../store/slices/expenseSlice';
import { selectAllUsers } from '../../store/slices/userSlice';
import { selectGroups } from '../../store/slices/groupSlice';
import { CURRENT_USER_ID } from '../../utils/mockData';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';

export default function AddExpenseModal({ isOpen, onClose }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [groupId, setGroupId] = useState('');
  const [category, setCategory] = useState('Food');

  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const groups = useSelector(selectGroups);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !groupId) return;

    const group = groups.find(g => g.id === groupId);
    const memberIds = group ? group.members : [CURRENT_USER_ID]; // Fallback
    const splitAmt = parseFloat((parseFloat(amount) / memberIds.length).toFixed(2));

    const newExpense = {
      id: uuidv4(),
      description,
      amount: parseFloat(amount),
      paidBy: CURRENT_USER_ID,
      groupId,
      date: new Date().toISOString(),
      category,
      splits: memberIds.map(mid => ({
        userId: mid,
        amount: splitAmt
      }))
    };

    dispatch(addExpense(newExpense));
    onClose();
    // Reset form
    setDescription('');
    setAmount('');
    setGroupId('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg">Add Expense</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              placeholder="e.g. Dinner at Mario's"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Group</label>
              <select
                value={groupId}
                onChange={e => setGroupId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value="">Select Group</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                {['Food', 'Transport', 'Utilities', 'Rent', 'Entertainment', 'Travel', 'Household'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all mt-4"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
