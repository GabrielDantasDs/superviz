import { configureStore } from '@reduxjs/toolkit';
import participantReducer from './participantSlice';

export const store = configureStore({
  reducer: {
    participant: participantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
