import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chat/chatSlice';
import documentsReducer from '../features/documents/documentsSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    counter: counterReducer,
    documents: documentsReducer,
    users: usersReducer,
  },
});
