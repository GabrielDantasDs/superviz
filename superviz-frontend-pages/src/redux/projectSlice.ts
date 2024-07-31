import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  id: string;
  name: string;
}

const initialState: ProjectState = {
  id: '',
  name: '',
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<ProjectState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
  },
});

export const { setProject } = projectSlice.actions;
export default projectSlice.reducer;