import {
    AUTH_LOGIN_REQUEST,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_LOGOUT_REQUEST,
    AUTH_LOGOUT_SUCCESS,
    AUTH_LOGOUT_FAILURE
} from '../constants/actionTypes';
import { login as loginRequest } from '../services/requests/auth';

export const login = (credentials) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_REQUEST });

        const {success, data, errorMessage} = await loginRequest(credentials);

        if(success) {
            console.log(data);
            return dispatch({type: AUTH_LOGIN_SUCCESS, payload: data});
        } else {
            return dispatch({type: AUTH_LOGIN_FAILURE, payload: [errorMessage]});
        }
    };
};