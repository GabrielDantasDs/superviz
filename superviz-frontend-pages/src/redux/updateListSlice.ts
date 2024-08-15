import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: boolean = false;

const updateListSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setUpdateList: (state, action: PayloadAction<boolean>) => {
        return action.payload
    },
  },
});

export const { setUpdateList } = updateListSlice.actions;
export default updateListSlice.reducer;