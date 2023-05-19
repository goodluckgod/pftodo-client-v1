import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Title {
	value: string;
}

const initialState: Title = {
	value: '',
};

const titleSlicer = createSlice({
	name: 'title',
	initialState,
	reducers: {
		setTitle: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
		},
	},
});

export const { setTitle } = titleSlicer.actions;

export default titleSlicer.reducer;
