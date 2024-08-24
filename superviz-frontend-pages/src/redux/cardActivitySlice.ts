import { CardActivity } from "@/interfaces/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState:CardActivity[] = [];

const cardActivitySlice = createSlice({
    name: 'cardActivity',
    initialState,
    reducers: {
        setCardActivity: (state, action:PayloadAction<CardActivity[]>) => {
            return action.payload;
        },
        addNewActivity: (state, action:PayloadAction<CardActivity>) => {
            let cards_activities = state;
            cards_activities.push(action.payload);

            return cards_activities;
        }
    }
})

export const { setCardActivity, addNewActivity } = cardActivitySlice.actions;
export default cardActivitySlice.reducer;