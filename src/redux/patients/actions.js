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
    PATIENTS_SELECTED_ITEMS_CHANGE,
    PATIENTS_DISCHARGE_ITEM,
    PATIENTS_DISCHARGE_ITEM_SUCCESS,
    PATIENTS_DISCHARGE_ITEM_ERROR,
    PATIENTS_DISCHARGED_REMOVE_ITEM,
    PATIENTS_DISCHARGED_REMOVE_ITEM_SUCCESS,
    PATIENTS_DISCHARGED_REMOVE_ITEM_ERROR,
    PATIENTS_GET_LIST_DISCHARGED,
    PATIENTS_GET_LIST_DISCHARGED_SUCCESS,
    PATIENTS_GET_LIST_DISCHARGED_ERROR,
    PATIENTS_GET_LIST_ALL,
    PATIENTS_GET_LIST_ALL_SUCCESS,
    PATIENTS_GET_LIST_ALL_ERROR,
    PATIENTS_ADMIT_ITEM,
    PATIENTS_ADMIT_ITEM_SUCCESS,
    PATIENTS_ADMIT_ITEM_ERROR,
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

export const dischargePatientsItem = (id) => ({
    type: PATIENTS_DISCHARGE_ITEM,
    payload: id
});

export const dischargePatientsItemSuccess = (items) => ({
    type: PATIENTS_DISCHARGE_ITEM_SUCCESS,
    payload: items
});

export const dischargePatientsItemError = (error) => ({
    type: PATIENTS_DISCHARGE_ITEM_ERROR,
    payload: error
});

export const removeDischargedPatientsItem = (id) => ({
    type: PATIENTS_DISCHARGED_REMOVE_ITEM,
    payload: id
  });
  
  export const removeDischargedPatientsItemSuccess = (items) => ({
    type: PATIENTS_DISCHARGED_REMOVE_ITEM_SUCCESS,
    payload: items
  });
  
  export const removeDischargedPatientsItemError = (error) => ({
    type: PATIENTS_DISCHARGED_REMOVE_ITEM_ERROR,
    payload: error
  });

export const getDischargedPatientsList = () => ({
    type: PATIENTS_GET_LIST_DISCHARGED
});

export const getDischargedPatientsListSuccess = (items) => ({
    type: PATIENTS_GET_LIST_DISCHARGED_SUCCESS,
    payload: items
});

export const getDischargedPatientsListError = (error) => ({
    type: PATIENTS_GET_LIST_DISCHARGED_ERROR,
    payload: error
});

export const getAllPatientsList = () => ({
    type: PATIENTS_GET_LIST_ALL
});

export const getAllPatientsListSuccess = (items) => ({
    type: PATIENTS_GET_LIST_ALL_SUCCESS,
    payload: items
});

export const getAllPatientsListError = (error) => ({
    type: PATIENTS_GET_LIST_ALL_ERROR,
    payload: error
});

export const admitPatientsItem = (id) => ({
    type: PATIENTS_ADMIT_ITEM,
    payload: id
});

export const admitPatientsItemSuccess = (items) => ({
    type: PATIENTS_ADMIT_ITEM_SUCCESS,
    payload: items
});

export const admitPatientsItemError = (error) => ({
    type: PATIENTS_ADMIT_ITEM_ERROR,
    payload: error
});