
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ParticipantState {
  id: string;
  name: string;
  id_sprint?: string,
  isHost: boolean,
  joined: boolean
}

const getInitialState = (): ParticipantState => {
  let initialId = '';
  let initialName = '';
  let initialIdSprint = '';

  if (typeof window !== 'undefined') {
    let user = localStorage.getItem('user');
  
    if (user != null) {
      let parsed_user = JSON.parse(user);

      initialId = parsed_user.id
      initialName = parsed_user.name
    }

  }

  return {
    id: initialId,
    name: initialName,
    id_sprint: initialIdSprint,
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
    joinSprint: (state) => {
      state.joined = true;
    },
    leftSprint: (state) => {
      state.joined = false;
    }
  },
});

export const { setParticipant, joinSprint, leftSprint } = participantSlice.actions;

export default participantSlice.reducer;
