import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ParticipantState {
  id: string;
  title: string;
}

const initialState: ParticipantState = {
  id: '',
  title: '',
};

const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    setMeeting: (state, action: PayloadAction<ParticipantState>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
    },
  },
});

export const { setMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;