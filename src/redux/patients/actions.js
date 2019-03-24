import {
    PATIENTS_GET_LIST,
    PATIENTS_GET_LIST_SUCCESS,
    PATIENTS_GET_LIST_ERROR,
    PATIENTS_GET_LIST_WITH_FILTER,
    PATIENTS_GET_LIST_WITH_ORDER,
    PATIENTS_GET_LIST_SEARCH,
    PATIENTS_ADD_ITEM,
    PATIENTS_ADD_ITEM_SUCCESS,
    PATIENTS_ADD_ITEM_ERROR,
    PATIENTS_REMOVE_ITEM,
    PATIENTS_REMOVE_ITEM_SUCCESS,
    PATIENTS_REMOVE_ITEM_ERROR,
    PATIENTS_SELECTED_ITEMS_CHANGE
} from 'Constants/actionTypes';


export const getPatientsList = () => ({
    type: PATIENTS_GET_LIST
});

export const getPatientsListSuccess = (items) => ({
    type: PATIENTS_GET_LIST_SUCCESS,
    payload: items
});

export const getPatientsListError = (error) => ({
    type: PATIENTS_GET_LIST_ERROR,
    payload: error
});

export const getPatientsListWithFilter = (column, value) => ({
    type: PATIENTS_GET_LIST_WITH_FILTER,
    payload: { column, value }
});

export const getPatientsListWithOrder = (column) => ({
    type: PATIENTS_GET_LIST_WITH_ORDER,
    payload: column
});

export const getPatientsListSearch = (keyword) => ({
    type: PATIENTS_GET_LIST_SEARCH,
    payload: keyword
});

export const addPatientsItem = (item) => ({
    type: PATIENTS_ADD_ITEM,
    payload: item
});

export const addPatientsItemSuccess = (items) => ({
    type: PATIENTS_ADD_ITEM_SUCCESS,
    payload: items
});

export const addPatientsItemError = (error) => ({
    type: PATIENTS_ADD_ITEM_ERROR,
    payload: error
});

export const removePatientsItem = (id) => ({
  type: PATIENTS_REMOVE_ITEM,
  payload: id
});

export const removePatientsItemSuccess = (items) => ({
  type: PATIENTS_REMOVE_ITEM_SUCCESS,
  payload: items
});

export const removePatientsItemError = (error) => ({
  type: PATIENTS_REMOVE_ITEM_ERROR,
  payload: error
});

export const selectedPatientsItemsChange = (selectedItems) => ({
    type: PATIENTS_SELECTED_ITEMS_CHANGE,
    payload: selectedItems
});
