import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 'helmi_rahmadian',
        BASE_URL: 'http://ajarin.org/api',
        LEVEL: '',
        USER_ID: '',
        USERNAME: '',
        FIRST_NAME: '',
        LAST_NAME: '',
        EMAIL: '',
        ALAMAT: '',
        IS_VERIF: '',
        phoneNumber: '',
        APIRegistration: '',
        APILogin: '',
        APIFindUser: '',
        NOTIF_VISIBLE: 'FALSE',
        NOTIF_MESSAGE: '',
        SPINNER_VISIBLE: 'TRUE',
        SPINNER_MESSAGE: 'Loading...',
        LIST_MENTOR: ''
    },
    reducers: {
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload
        },
        CLEAR_STORE: (state, action) => {
            state.LEVEL = ''
            state.USER_ID = ''
            state.IS_VERIF = ''
            state.phoneNumber = ''
            state.APIRegistration = ''
            state.APILogin = ''
        },
        updateLevel: (state, action) => {
            console.log('action', action);
            state.LEVEL = action.payload
        },
        updatePhoneNumber: (state, action) => {
            state.phoneNumber = action.payload
        },
        updateAPIRegistration: (state, action) => {
            state.APIRegistration = action.payload
        },
        updateAPILogin: (state, action) => {
            state.APILogin = action.payload
        },
        updateAPIFindUser: (state, action) => {
            state.APIFindUser = action.payload
        },
        updateUSERNAME: (state, action) => {
            state.USERNAME = action.payload
        },
        updateUSER_ID: (state, action) => {
            state.USER_ID = action.payload
        },
        updateFIST_NAME: (state, action) => {
            state.FIRST_NAME = action.payload
        },
        updateLAST_NAME: (state, action) => {
            state.LAST_NAME = action.payload
        },
        updateIS_VERIF: (state, action) => {
            state.IS_VERIF = action.payload
        },
        updateSPINNER_VISIBLE: (state, action) => {
            state.SPINNER_VISIBLE = action.payload
        },
        updateSPINNER_MESSAGE: (state, action) => {
            state.SPINNER_MESSAGE = action.payload
        },
        updateEMAIL: (state, action) => {
            state.EMAIL = action.payload
        },
        updateNOTIF_VISIBLE: (state, action) => {
            state.NOTIF_VISIBLE = action.payload
        },
        updateNOTIF_MESSAGE: (state, action) => {
            state.NOTIF_MESSAGE = action.payload
        },
        updateLIST_MENTOR: (state, action) => {
            state.LIST_MENTOR = action.payload
        },
        updateALAMAT: (state, action) => {
            state.ALAMAT = action.payload
        }

    },
})

// Action creators are generated for each case reducer function
export const {
    CLEAR_STORE,
    increment,
    decrement,
    incrementByAmount,
    updateLevel,
    updatePhoneNumber,
    updateAPIRegistration,
    updateAPILogin,
    updateAPIFindUser,
    updateUSER_ID,
    updateFIST_NAME,
    updateLAST_NAME,
    updateUSERNAME,
    updateIS_VERIF,
    updateSPINNER_VISIBLE,
    updateSPINNER_MESSAGE,
    updateEMAIL,
    updateNOTIF_VISIBLE,
    updateNOTIF_MESSAGE,
    updateLIST_MENTOR,
    updateALAMAT
} = counterSlice.actions

export default counterSlice.reducer