import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from './slices/applicationSlice';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import personalInfoReducer from './slices/personalInfoSlice';

export const store = configureStore({
  reducer: {
    application: applicationReducer,
    user: userReducer,
    chat: chatReducer,
    personalInfo: personalInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 