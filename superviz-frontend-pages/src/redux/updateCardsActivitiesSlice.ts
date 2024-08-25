import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: boolean = false;

const updateCardsActivitiesSlice = createSlice({
  name: 'update_cards_activities',
  initialState,
  reducers: {
    setUpdateCardsActivities: (state, action: PayloadAction<boolean>) => {
        return action.payload
    },
  },
});

export const { setUpdateCardsActivities } = updateCardsActivitiesSlice.actions;
export default updateCardsActivitiesSlice.reducer;