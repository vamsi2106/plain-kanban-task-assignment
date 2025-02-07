import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';
// import taskReducer from './taskSlice';
// import groupReducer from './groupSlice';
// import kanbanReducer from "./kanbanSlice";

export const store = configureStore({
    reducer: {
        projects: projectReducer,
        // tasks: taskReducer,
        // groups: groupReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;