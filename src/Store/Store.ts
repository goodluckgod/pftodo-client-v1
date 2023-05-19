import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage';

import titleReducer from './Slicers/titleSlicer';
import authReducer from './Slicers/authSlicer';
import loadingReducer from './Slicers/loadingSlicer';

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['loading'],
};

const reducers = combineReducers({
	title: titleReducer,
	auth: authReducer,
	loading: loadingReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
	reducer: persistedReducer,
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
