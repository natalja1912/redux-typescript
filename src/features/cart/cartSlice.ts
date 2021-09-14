import { createSlice, PayloadAction, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../../app/store";
import {checkout, CartItems} from '../../app/api';

export interface CartState {
    items: {[productID: string]: number};
    checkoutState: CheckoutState,
    errorMessage: string,
}

export interface Items {
    [productID: string]: number;
}

type CheckoutState = 'LOADING' | 'READY' | 'ERROR';

const initialState: CartState = {
    items: {},
    checkoutState: 'READY',
    errorMessage: '',
}

export const checkoutCart = createAsyncThunk("cart/checkout", async(_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const items = state.cart.items;
    const response =  await checkout(items);
    return response;
})

/*export function checkout(){
    return function checkoutThunk(dispatch: AppDispatch){
        dispatch({type: 'cart/checkout/pending'});
        setTimeout(function(){
            dispatch({type: 'cart/checkout/fulfilled'});
        }, 500)
    }
} */

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<string>) {
            const id = action.payload;
            if (state.items[id]){
                state.items[id]++;
            }
            else {
                state.items[id] = 1;
            }
        },
        removeFromCart(state, action: PayloadAction<string>) {
            delete state.items[action.payload];
        },
        updateQuantity(state, action: PayloadAction<{id: string, quantity: number}>) {
            const {id, quantity} =  action.payload;
            state.items[id] = quantity;
        }
        },
        extraReducers: function(builder){
            builder.addCase(checkoutCart.pending, (state, action) => {
                state.checkoutState = 'LOADING';
            });
            builder.addCase(checkoutCart.fulfilled, (state, action: PayloadAction<{success: boolean}>) => {
                const {success} = action.payload;
                if (success){
                    state.checkoutState = 'READY';
                    state.items = {};
                }
                else {
                    state.checkoutState = 'ERROR';
                }
            });
            builder.addCase(checkoutCart.rejected, (state, action) => {
                state.checkoutState = 'ERROR';
                state.errorMessage = action.error.message || '';
            });
        }
});

export const {addToCart, removeFromCart, updateQuantity} = cartSlice.actions;
export default cartSlice.reducer;

export const getMemoizedNumItems = createSelector(
    (state: RootState) => state.cart.items,
    (items: Items) => {
        let numItems = 0;
        for (let id in items){
            numItems += items[id];
        }
        return numItems;
    }
)

export const getTotalPrice = createSelector(
    (state: RootState) => state.cart.items,
    (state: RootState) => state.products.products,
    (items, products) => {
        let totalPrice = 0;
        for (let id in items){
            totalPrice += products[id].price * items[id];
        }
        return totalPrice;
    }
)