import { User } from "@/interfaces/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


type UserState = {
    name: string;
    email: string;
    id_company: string | number;
    id: string | number;
};

const initialState:UserState = {
    id: "",
    name: "",
    email: "",
    id_company: ""
};

const userSlice = createSlice({
    name:  "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            let user = state;
            user.id = action.payload.id ?? "";
            user.name = action.payload.name;
            user.email = action.payload.email;
            user.id_company = action.payload.id_company ?? ""
        },
        unsetUser: (state) => {
            state = initialState;
        }
    }
});

export const { setUser, unsetUser } = userSlice.actions;
export default userSlice.reducer; 