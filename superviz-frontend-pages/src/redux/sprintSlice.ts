import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const getInitialState = (): SprintState => {
  let initialId = '';
  let initialTitle = '';
  let initialProjectId = '';

  if (typeof window !== 'undefined') {
    initialId = localStorage.getItem('sprint_id') ?? '';
    initialTitle = localStorage.getItem('sprint_title') ?? '';
    initialProjectId = localStorage.getItem('project_id') ?? '';
  }

  return {
    id: initialId,
    title: initialTitle,
    id_project: initialProjectId
  };
}

interface SprintState {
  id: string;
  title: string;
  id_project: string | number;
}

const initialState: SprintState = {
  id: '',
  title: '',
  id_project: ''
};

const sprintSlice = createSlice({
  name: 'sprint',
  initialState: getInitialState,
  reducers: {
    setSprint: (state, action: PayloadAction<SprintState>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.id_project = action.payload.id_project
    },
  },
});

export const { setSprint } = sprintSlice.actions;
export default sprintSlice.reducer;