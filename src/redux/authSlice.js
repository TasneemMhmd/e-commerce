import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    rememberMe: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.user = {
                uid: action.payload.uid,
                email: action.payload.email,
                displayName: action.payload.displayName,
                photoURL: action.payload.photoURL,
            };
            state.isAuthenticated = true;
            state.error = null;

            if (state.rememberMe) {
                localStorage.setItem('user', JSON.stringify(state.user));
                localStorage.setItem('isAuthenticated', 'true');
            } else {
                sessionStorage.setItem('user', JSON.stringify(state.user));
                sessionStorage.setItem('isAuthenticated', 'true');
            }
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
            state.rememberMe = false;
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('isAuthenticated');
        },
        setRememberMe: (state, action) => {
            state.rememberMe = action.payload;
        },
        restoreUser: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = action.payload.isAuthenticated;
            state.rememberMe = action.payload.rememberMe || false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    setRememberMe,
    restoreUser,
    clearError,
} = authSlice.actions;

export default authSlice.reducer;