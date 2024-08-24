import { configureStore } from '@reduxjs/toolkit';
import participantReducer from './participantSlice';
import sprintReducer from './sprintSlice';
import projectReducer from './projectSlice';
import listsReducer from './listsSlice';
import updateLisdReducer from './updateListSlice';
import cardActivityReducer from './cardActivitySlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    participant: participantReducer,
    sprint: sprintReducer,
    project: projectReducer,
    lists: listsReducer,
    updateList: updateLisdReducer,
    cards_activities: cardActivityReducer,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
