import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number;
    title: string;
}

// Define an initial state value for the app
const initialState: CounterState = {
    data: 42,
    title: 'YARC (yer another redux counter with redux toolkit)'
}

// Create a "reducer" function that determines what the new state
// should be when something happens in the app
export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        // Reducers usually look at the type of action that happened
        // to decide how to update the state
        increment: (state, action) => {
            state.data += action.payload
        },
        decrement: (state, action) => {
            state.data -= action.payload
        },
    }
})

export const {increment, decrement} = counterSlice.actions;