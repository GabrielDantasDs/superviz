import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ParticipantState {
  id: string;
  name: string;
}

const initialState: ParticipantState = {
  id: '',
  name: '',
};

const participantSlice = createSlice({
  name: 'participant',
  initialState,
  reducers: {
    setParticipant: (state, action: PayloadAction<ParticipantState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
  },
});

export const { setParticipant } = participantSlice.actions;
export default participantSlice.reducer;
