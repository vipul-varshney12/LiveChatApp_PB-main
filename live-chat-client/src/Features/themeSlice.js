import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "themeSlice",
  initialState: true,
  reducers: {
    toggleTheme: (state) => {
      return (state = !state);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
//The createSlice function is used to define a Redux slice, which includes the slice's name, initial state, and a set of reducers

/* Reducers are pure functions in Redux responsible for specifying how the
 application's state should change in response to different actions*/


 /* 
  A Redux slice encapsulates the logic related to a specific
   slice of the overall application state,
 */