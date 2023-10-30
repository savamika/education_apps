// project imports
// import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    isOpen: [], // for active default menu
    // fontFamily: config.fontFamily,
    // borderRadius: config.borderRadius,
    opened: true,
    BASE_URL: 'http://localhost:4000',
    BUTTON_VARIANT: "text",
    DATA_DEBITUR: []
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        case actionTypes.BASE_URL:
            return {
                ...state,
                BASE_URL: action.BASE_URL
            };
        case actionTypes.SET_BUTTON_VARIANT:
            return {
                ...state,
                BUTTON_VARIANT: action.BUTTON_VARIANT
            };
        case actionTypes.SET_DEBITUR_DATA:
            return {
                ...state,
                DEBITUR_DATA: action.newValue
            };
        case actionTypes.GET_DEBITUR_DATA:
            return {
                ...state,
                DEBITUR_DATA: action.DEBITUR_DATA
            };
        default:
            return state;
    }
};

export default customizationReducer;
