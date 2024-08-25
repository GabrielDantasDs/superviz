import { User } from "@/interfaces/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


type UserState = {
    name: string;
    email: string;
    id_company: string | number;
    id: string | number;
};

const getInitialState = (): UserState => {
    let initialId = '';
    let initialName = '';
    let initialEmail = '';
    let initialIdCompany = '';
  
    if (typeof window !== 'undefined') {
      let user = localStorage.getItem('user');
  
      if (user !== null) {
        let parsed_user = JSON.parse(user);

        initialId = parsed_user.id;
        initialName = parsed_user.name;
        initialEmail = parsed_user.email;
        initialIdCompany = parsed_user.id_company;
      } 
      
    }
  
    return {id: initialId, name: initialName, email: initialEmail, id_company: initialIdCompany}
  }

const initialState:UserState = {
    id: "",
    name: "",
    email: "",
    id_company: ""
};

const userSlice = createSlice({
    name:  "user",
    initialState: getInitialState,
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