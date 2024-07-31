import { configureStore } from '@reduxjs/toolkit';
import participantReducer from './participantSlice';
import meetingReducer from './meetingSlice';
import projectReducer from './projectSlice';

export const store = configureStore({
  reducer: {
    participant: participantReducer,
    meeting: meetingReducer,
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
