'use client';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import insightReducer from '../slice/insights.slice'
import filterReducer from "../slice/filtered.slice"
import { fetchFiltersList } from '../thunk/insightThunk';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [],
};

const rootReducer = combineReducers({
  insights: insightReducer,
  filterList: filterReducer
});

export type RootState = ReturnType<typeof rootReducer>;



const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>['store'];
export type AppDispatch = AppStore['dispatch'];