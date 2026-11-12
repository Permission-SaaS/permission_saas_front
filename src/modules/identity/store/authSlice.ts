import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = { user: null };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    loggedOut: (state) => {
      state.user = null;
    },
  },
  selectors: {
    selectCurrentUser: (state) => state.user,
    selectIsLoggedIn: (state) => state.user !== null,
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;
export const { selectCurrentUser, selectIsLoggedIn } = authSlice.selectors;
