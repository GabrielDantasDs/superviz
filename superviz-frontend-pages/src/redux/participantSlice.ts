
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ParticipantState {
  id: string;
  name: string;
  id_meeting?: string,
  isHost: boolean,
  joined: boolean
}

const getInitialState = (): ParticipantState => {
  let initialId = '';
  let initialName = '';
  let initialIdMeeting = '';

  if (typeof window !== 'undefined') {
    initialId = localStorage.getItem('id') ?? '';
    initialName = localStorage.getItem('name') ?? '';
    initialIdMeeting = localStorage.getItem('id_meeting') ?? ''
  }

  return {
    id: initialId,
    name: initialName,
    id_meeting: initialIdMeeting,
    isHost: true,
    joined: false
  };
}

const participantSlice = createSlice({
  name: 'participant',
  initialState: getInitialState,
  reducers: {
    setParticipant: (state, action: PayloadAction<ParticipantState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
    joinMeeting: (state) => {
      state.joined = true;
    },
    leftMeeting: (state) => {
      state.joined = false;
    }
  },
});

export const { setParticipant, joinMeeting, leftMeeting } = participantSlice.actions;

export default participantSlice.reducer;
