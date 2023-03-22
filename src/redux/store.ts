import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';
import rootReducer from "redux/rootReducer";

export const store = configureStore({
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false
    })
  ],
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
