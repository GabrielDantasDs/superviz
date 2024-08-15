import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const getInitialState = (): MeetingState => {
  let initialId = '';
  let initialTitle = '';
  let initialProjectId = '';

  if (typeof window !== 'undefined') {
    initialId = localStorage.getItem('meeting_id') ?? '';
    initialTitle = localStorage.getItem('meeting_title') ?? '';
    initialProjectId = localStorage.getItem('project_id') ?? '';
  }

  return {
    id: initialId,
    title: initialTitle,
    id_project: initialProjectId
  };
}

interface MeetingState {
  id: string;
  title: string;
  id_project: string | number;
}

const initialState: MeetingState = {
  id: '',
  title: '',
  id_project: ''
};

const meetingSlice = createSlice({
  name: 'meeting',
  initialState: getInitialState,
  reducers: {
    setMeeting: (state, action: PayloadAction<MeetingState>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
    },
  },
});

export const { setMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;