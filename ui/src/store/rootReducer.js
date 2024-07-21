import { combineReducers } from "@reduxjs/toolkit";
import roomSlice from "./reducers/roomSlice";

const rootReducer = combineReducers({
    roomSlice,
});

export default rootReducer;
