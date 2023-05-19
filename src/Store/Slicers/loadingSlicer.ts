import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Loading {
	value: boolean;
}

const initialState: Loading = {
	value: false,
};

const loadingSlicer = createSlice({
	name: 'loading',
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.value = action.payload;
		},
	},
});

export const { setLoading } = loadingSlicer.actions;

export default loadingSlicer.reducer;
