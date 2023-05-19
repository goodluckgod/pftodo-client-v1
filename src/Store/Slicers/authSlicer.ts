import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthState, User } from '../../Types/Auth';

const initialState: AuthState = {
	user: {
		name: '',
		email: '',
		avatar: '',
		token: '',
	},
	isLoggedIn: false,
};

const authSlicer = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login: (state, action: PayloadAction<AuthState>) => {
			state.user = action.payload.user;
			state.isLoggedIn = true;
		},
		logout: (state) => {
			state.user = initialState.user;
			state.isLoggedIn = false;
		},
		update: (state, action: PayloadAction<User>) => {
			if (action.payload.name) state.user.name = action.payload.name;
			if (action.payload.email) state.user.email = action.payload.email;
			if (action.payload.avatar) state.user.avatar = action.payload.avatar;
			if (action.payload.token) state.user.token = action.payload.token;

			state.isLoggedIn = true;
		},
	},
});

export const { login, logout, update } = authSlicer.actions;

export default authSlicer.reducer;
