import { createSlice } from "@reduxjs/toolkit";
import state from "../initialState";

const roomSlice = createSlice({
  name: "room",
  initialState: state,
  reducers: {
    saveRoomData: (state, action) => {
      state.rooms = action.payload;
    },
    saveLoginData:(state,action) =>{
      state.token = action.payload
    }
  },
});

export default roomSlice.reducer;
export const room_action = roomSlice.actions;
