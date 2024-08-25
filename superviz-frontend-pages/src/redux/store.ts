import { configureStore } from '@reduxjs/toolkit';
import participantReducer from './participantSlice';
import sprintReducer from './sprintSlice';
import projectReducer from './projectSlice';
import listsReducer from './listsSlice';
import updateLisdReducer from './updateListSlice';
import cardActivityReducer from './cardActivitySlice';
import userReducer from './userSlice';
import usersReducer from './usersSlice';
import updateCardsActivitiesReducer from './updateCardsActivitiesSlice';

export const store = configureStore({
  reducer: {
    participant: participantReducer,
    sprint: sprintReducer,
    project: projectReducer,
    lists: listsReducer,
    updateList: updateLisdReducer,
    updateCardsActivities: updateCardsActivitiesReducer,
    cards_activities: cardActivityReducer,
    user: userReducer,
    users: usersReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
