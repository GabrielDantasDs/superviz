import { configureStore } from '@reduxjs/toolkit';
import participantReducer from './participantSlice';
import meetingReducer from './meetingSlice';
import projectReducer from './projectSlice';
import listsReducer from './listsSlice';
import updateLisdReducer from './updateListSlice';

export const store = configureStore({
  reducer: {
    participant: participantReducer,
    meeting: meetingReducer,
    project: projectReducer,
    lists: listsReducer,
    updateList: updateLisdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
