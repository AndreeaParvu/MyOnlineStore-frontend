import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Basket } from "../../app/models/basket";

interface BasketState {
    basket: Basket | null;
    status: string;
}

// Define an initial state value
const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>( //Basket=tipul parametrilor returnati + productId/ quantity=tipul argumentelor
    'basket/addBasketItemAsync', //string action type => numele functiei care o sa apara in Redux dev tools
    async ({productId, quantity}, thunkAPI) => { //parametrii care trebuie pasati ca argument metodei asincrone => API request
        try {
            return await agent.Basket.addItem(productId, quantity); 
        } catch (error: any) {
           return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, 
    {productId: number, quantity: number, name?:string}>(
    'basket/removeBasketItemAsync',
    async ({productId, quantity = 1}, thunkAPI) => {
        try{
            await agent.Basket.removeItem(productId, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        }
    },


    extraReducers: (builder => { //extraReducers allows createSlice to respond to other action types besides the types it has generated
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingAddItem' + action.meta.arg.productId;
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) =>{
            state.basket = action.payload;
            state.status = 'idle';
        });
        builder.addCase(addBasketItemAsync.rejected, (state, action) =>{
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) =>{
            const {productId, quantity} = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i => i.product.id === productId);
            if (itemIndex === -1 || itemIndex === undefined) return;
            state.basket!.items[itemIndex].quantity -= quantity; //! is overwriting the type safety
            if (state.basket?.items[itemIndex].quantity === 0) state.basket.items.splice(itemIndex, 1);
            state.status = 'idle';
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        })
    })
})

export const {setBasket} = basketSlice.actions;