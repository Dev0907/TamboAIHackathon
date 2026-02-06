import { createSlice } from '@reduxjs/toolkit';
import { GROUPS } from '../../utils/mockData';

const initialState = {
  groups: GROUPS,
};

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
  },
});

export const { addGroup } = groupSlice.actions;
export default groupSlice.reducer;

// Selectors
export const selectGroups = (state) => state.groups.groups;
export const selectGroupById = (id) => (state) => state.groups.groups.find(g => g.id === id);
