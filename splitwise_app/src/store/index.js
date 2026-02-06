import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import groupReducer from './slices/groupSlice';
import expenseReducer from './slices/expenseSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('splitwise_app_v2');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('splitwise_app_v2', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

export const store = configureStore({
  reducer: {
    users: userReducer,
    groups: groupReducer,
    expenses: expenseReducer,
  },
  preloadedState: loadState()
});

store.subscribe(() => {
  saveState(store.getState());
});
