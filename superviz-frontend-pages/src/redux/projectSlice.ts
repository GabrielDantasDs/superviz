import { List } from '@/interfaces/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getInitialState = (): ProjectState => {
  let initialId = '';
  let initialName = '';
  let initialLists = [];

  if (typeof window !== 'undefined') {
    initialId = localStorage.getItem('project_id') ?? '';
    initialName = localStorage.getItem('project_title') ?? '';

    let project_lists = localStorage.getItem('project_lists');

    if ( project_lists !== null) {
      initialLists = JSON.parse(project_lists)
    } else {
      initialLists = [];
    }
    
  }

  return {
    id: initialId,
    name: initialName,
    lists: initialLists
  };
}

interface ProjectState {
  id: string;
  name: string;
  lists: List[]
}

const initialState: ProjectState = {
  id: '',
  name: '',
  lists: []
};

const projectSlice = createSlice({
  name: 'project',
  initialState: getInitialState,
  reducers: {
    setProject: (state, action: PayloadAction<ProjectState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.lists = action.payload.lists;
    },
  },
});

export const { setProject } = projectSlice.actions;
export default projectSlice.reducer;