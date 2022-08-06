import { configureStore } from '@reduxjs/toolkit';
import nightmareReducer from './nightmaresSlice';

export default configureStore({
  reducer: {
    nightmares: nightmareReducer
  },
})