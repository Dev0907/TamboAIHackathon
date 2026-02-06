import { createSlice } from '@reduxjs/toolkit';
import { EXPENSES } from '../../utils/mockData';

const initialState = {
  expenses: EXPENSES,
};

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.unshift(action.payload); // Add new expenses to the top
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
    }
  },
});

export const { addExpense, deleteExpense } = expenseSlice.actions;
export default expenseSlice.reducer;

// Selectors
export const selectAllExpenses = (state) => state.expenses.expenses;
export const selectExpensesByGroup = (groupId) => (state) =>
  state.expenses.expenses.filter(e => e.groupId === groupId);
