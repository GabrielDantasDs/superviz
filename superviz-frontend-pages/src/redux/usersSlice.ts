import { User } from "@/interfaces/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


type UserState = {
    name: string;
    email: string;
    id_company: string | number;
    id: string | number;
};

const initialState:UserState[] = [];

const usersSlice = createSlice({
    name:  "user",
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<UserState[]>) => {
            return action.payload
        }
    }
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer; 