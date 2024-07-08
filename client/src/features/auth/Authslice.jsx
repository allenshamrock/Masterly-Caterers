import {createSlice} from '@reduxjs/toolkit'

const AuthSlice = createSlice({
    name:'auth',
    initialState:{
        isLoggedIn:false,
        user:[],
        username:null,
        isAdmin:null,
        accessToken:null
    },
    reducers:{
        setCredentials:(state,action)=>{
        const {username,user,isAdmin,accessToken,id} = action.payload
            state.isLoggedIn=true,
            state.username=username,
            state.user=user,
            state.accessToken=accessToken,
            state.id=id,
            state.isAdmin=isAdmin
        },
        logout:(state,action)=>{
            state.username = null,
            state.accessToken = null,
            state.id = null,
            state.isAdmin = null,
            state.user =null,
        }
    }
})

export const {setCredentials,logout} =AuthSlice.actions
export default AuthSlice.reducer

export const selectCurrentUser = (state) =>state?.auth?.username //export the current user  information after login
export const selectCurrentToken = (state) =>state?.auth?.accessToken //export the current user access token after login
export const selectCurrentIsAdmin = (state) =>state?.auth?.user?.isAdmin
export const selectUserData=(state)=>state?.auth.user