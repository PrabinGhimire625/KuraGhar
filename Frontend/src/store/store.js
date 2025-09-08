import {configureStore} from "@reduxjs/toolkit";
import  authSlice from "./authSlice"
import friendRequestSlice from "./friendRequestSlice"

const store=configureStore({
    reducer:{
        auth:authSlice,
        friendRequest:friendRequestSlice
    }
})

export default store
