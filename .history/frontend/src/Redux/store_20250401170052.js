import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categorySlice";
import notificationReducer from "./notificationSlice";
export const store = configureStore({
    reducer: {
        category: categoryReducer,
        notifications: notificationReducer,
    },
});
