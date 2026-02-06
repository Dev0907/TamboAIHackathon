import { createSlice } from '@reduxjs/toolkit';
import { USERS, CURRENT_USER_ID } from '../../utils/mockData';

const initialState = {
  currentUser: USERS.find(u => u.id === CURRENT_USER_ID),
  users: USERS,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    login: (state, action) => {
      const user = state.users.find(u => u.id === action.payload) || action.payload;
      state.currentUser = user;
    },
    logout: (state) => {
      state.currentUser = null;
    }
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectAllUsers = (state) => state.users.users;
export const selectUserById = (userId) => (state) => state.users.users.find(u => u.id === userId);
