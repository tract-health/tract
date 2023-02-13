import {
    WARDS_GET_LIST,
    WARDS_GET_LIST_SUCCESS,
    WARDS_GET_LIST_ERROR,
} from 'Constants/actionTypes';


export const getWardsList = () => ({
    type: WARDS_GET_LIST
});

export const getWardsListSuccess = (items) => ({
    type: WARDS_GET_LIST_SUCCESS,
    payload: items
});

export const getWardsListError = (error) => ({
    type: WARDS_GET_LIST_ERROR,
    payload: error
});