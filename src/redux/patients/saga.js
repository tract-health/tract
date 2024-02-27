import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { getDateWithFormat } from "Util/Utils";
import { database } from '../../firebase'
import {
  PATIENTS_GET_LIST,
  PATIENTS_ADD_ITEM,
  PATIENTS_REMOVE_ITEM,
  PATIENTS_DISCHARGE_ITEM,
  PATIENTS_GET_LIST_DISCHARGED,
  PATIENTS_GET_LIST_ALL,
  PATIENTS_ADMIT_ITEM,
  PATIENTS_DISCHARGED_REMOVE_ITEM
} from 'Constants/actionTypes'

import {
  getPatientsListSuccess,
  getPatientsListError,
  addPatientsItemSuccess,
  addPatientsItemError,
  removePatientsItemSuccess,
  removePatientsItemError,
  dischargePatientsItemSuccess,
  dischargePatientsItemError,
  removeDischargedPatientsItemSuccess,
  removeDischargedPatientsItemError,
  getDischargedPatientsListSuccess,
  getDischargedPatientsListError,
  getAllPatientsListSuccess,
  getAllPatientsListError,
  admitPatientsItemSuccess,
  admitPatientsItemError
} from "./actions";


const getPatientsListRequest = async () => {
  return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/patients')
    .once('value')
    .then(response => {
      response = response.val();
      const array = [];
      for (let k in response) {
        if (response.hasOwnProperty(k)) {
          let item = response[k];
          item.id = k;
          array.push(item)
        }
      }
      return array
    }).catch(error => error);
};

function* getPatientsListItems() {
  try {
    const response = yield call(getPatientsListRequest);
    yield put(getPatientsListSuccess(response));
  } catch (error) {
    yield put(getPatientsListError(error));
  }
}

const addPatientsItemRequest = async item => {
  item.createDate = getDateWithFormat();

  // search in discharged patients first
  return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/dischargedPatients/' + item.id)
    .once('value')
    .then(response => {
      // if no entry in discharged patients by the same ID
      if (!response.exists()) {
        return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/patients/' + item.id)
          .once('value')
          .then(response => {
            // if found update existing entry
            if (response.exists()) {
              return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/patients/' + item.id).update({
                name: item.name
              }).then(response => {
                return getPatientsListRequest()
              }).catch(error => error);
            }
            // if not found add a new entry
            else {
              return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/patients/' + item.id).set({
                name: item.name,
                createDate: item.createDate,
                assessmentLevel: null,
                surveys: null,
                planner: null
              }).then(response => {
                return getPatientsListRequest()
              }).catch(error => error);
            }
          }).catch(error => error);
      }
      // if same entry exists in discharged patients
      else {
        // get the values
        let existingPatientName = item.name;
        let existingPatientCreateDate = response.val().createDate;
        let existingPatientSurveys = null;
        let existingPatientAssessmentLevel = null;
        let existingPatientPlanner = null
        if (response.val().surveys) {
          existingPatientSurveys = response.val().surveys;
        } 
        if (response.val().assessmentLevel) {
          existingPatientAssessmentLevel = response.val().assessmentLevel;
        }
        if (response.val().planner) {
          existingPatientPlanner = response.val().planner;
        } 
        // add that entry into active patients
        return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/patients/' + item.id)
          .set({
            name: existingPatientName,
            createDate: existingPatientCreateDate,
            assessmentLevel: existingPatientAssessmentLevel,
            surveys: existingPatientSurveys,
            planner: existingPatientPlanner
          })
          .then(response => {
            // delete entry from discharged patients
            return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/dischargedPatients/' + item.id)
              .remove()
              .then(response => {
                return getPatientsListRequest()
              })
              .catch(error => error); 
          })
          .catch(error => error); 
      }
    })
    .catch(error => error); 
};

function* addPatientsItem({ payload }) {
  try {
    const response = yield call(addPatientsItemRequest, payload);
    yield put(addPatientsItemSuccess(response));
  } catch (error) {
    yield put(addPatientsItemError(error));
  }
}

const removePatientsItemRequest = async id => {
  return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/patients/' + id)
    .remove()
    .then(response => {
      return getPatientsListRequest()
    }).catch(error => error);
};

function* removePatientsItem({ payload }) {
  try {
    const response = yield call(removePatientsItemRequest, payload);
    yield put(removePatientsItemSuccess(response));
  } catch (error) {
    yield put(removePatientsItemError(error));
  }
}

const dischargePatientsItemRequest = async id => {
  // find the correct patient
  return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/patients/' + id)
    .once('value')
    .then(response => {
      // get values
      let surveys = null;
      let assessmentLevel = null;
      let planner = null;
      if (response.val().surveys) {
        surveys = response.val().surveys;
      } 
      if (response.val().planner) {
        planner = response.val().planner;
      } 
      if (response.val().assessmentLevel) {
        assessmentLevel = response.val().assessmentLevel;
      } 
      // copy the patient into discharged
      return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/dischargedPatients/' + id)
        .set({
          name: response.val().name,
          createDate: response.val().createDate,
          assessmentLevel: assessmentLevel,
          surveys: surveys,
          planner: planner
        })
        .then(response => {
          // delete patient from active patients
          return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/patients/' + id)
            .remove()
            .then(response => {
              return getPatientsListRequest();
            })
            .catch(error => error);
        })
        .catch(error => error);
    })
    .catch(error => error);
}

function* dischargePatientsItem({ payload }) {
  try {
    const response = yield call(dischargePatientsItemRequest, payload);
    yield put(dischargePatientsItemSuccess(response));
  } catch (error) {
    yield put(dischargePatientsItemError(error));
  }
}

const removeDischargedPatientsItemRequest = async id => {
  return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/dischargedPatients/' + id)
    .remove()
    .then(response => {
      return getDischargedPatientsListRequest()
    }).catch(error => error);
};

function* removeDischargedPatientsItem({ payload }) {
  try {
    const response = yield call(removeDischargedPatientsItemRequest, payload);
    yield put(removeDischargedPatientsItemSuccess(response));
  } catch (error) {
    yield put(removeDischargedPatientsItemError(error));
  }
}

const getDischargedPatientsListRequest = async () => {
  return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/dischargedPatients')
    .once('value')
    .then(response => {
      response = response.val();
      const array = [];
      for (let k in response) {
        if (response.hasOwnProperty(k)) {
          let item = response[k];
          item.id = k;
          array.push(item)
        }
      }
      return array
    }).catch(error => error);
};

function* getDischargedPatientsListItems() {
  try {
    const response = yield call(getDischargedPatientsListRequest);
    yield put(getDischargedPatientsListSuccess(response));
  } catch (error) {
    yield put(getDischargedPatientsListError(error));
  }
}

const getAllPatientsListRequest = async () => {
  return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/patients')
    .once('value')
    .then(response => {
      response = response.val();
      const array = [];
      for (let k in response) {
        if (response.hasOwnProperty(k)) {
          let item = response[k];
          item.id = k;
          array.push(item)
        }
      }
      // get also discharged patients
      return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/dischargedPatients')
        .once('value')
        .then(response => {
          response = response.val();
          for (let k in response) {
            if (response.hasOwnProperty(k)) {
              let item = response[k];
              item.id = k;
              array.push(item)
            }
          }
          return array
      }).catch(error => error);
    }).catch(error => error);
};

function* getAllPatientsListItems() {
  try {
    const response = yield call(getAllPatientsListRequest);
    yield put(getAllPatientsListSuccess(response));
  } catch (error) {
    yield put(getAllPatientsListError(error));
  }
}

const admitPatientsItemRequest = async id => {
  // find the correct discharged patient
  return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/dischargedPatients/' + id)
    .once('value')
    .then(response => {
      // get values
      let surveys = null;
      let assessmentLevel = null;
      let planner = null;
      if (response.val().surveys) {
        surveys = response.val().surveys;
      } 
      if (response.val().planner) {
        planner = response.val().planner;
      } 
      if (response.val().assessmentLevel) {
        assessmentLevel = response.val().assessmentLevel;
      } 
      // copy the discharged patient into active patients list
      return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/patients/' + id)
        .set({
          name: response.val().name,
          createDate: response.val().createDate,
          assessmentLevel: assessmentLevel,
          surveys: surveys,
          planner: planner
        })
        .then(response => {
          // delete patient from discharged patients
          return database.ref('wards/' + localStorage.getItem('user_currentWard') + '/dischargedPatients/' + id)
            .remove()
            .then(response => {
              return getPatientsListRequest();
            })
            .catch(error => error);
        })
        .catch(error => error);
    })
    .catch(error => error);
}

function* admitPatientsItem({ payload }) {
  try {
    const response = yield call(admitPatientsItemRequest, payload);
    yield put(admitPatientsItemSuccess(response));
  } catch (error) {
    yield put(admitPatientsItemError(error));
  }
}

export function* watchGetList() {
  yield takeEvery(PATIENTS_GET_LIST, getPatientsListItems);
}

export function* watchAddItem() {
  yield takeEvery(PATIENTS_ADD_ITEM, addPatientsItem);
}

export function* watchRemoveItem() {
  yield takeEvery(PATIENTS_REMOVE_ITEM, removePatientsItem);
}

export function* watchDischargeItem() {
  yield takeEvery(PATIENTS_DISCHARGE_ITEM, dischargePatientsItem);
}

export function* watchRemoveDischargedItem() {
  yield takeEvery(PATIENTS_DISCHARGED_REMOVE_ITEM, removeDischargedPatientsItem);
}

export function* watchGetDischargedList() {
  yield takeEvery(PATIENTS_GET_LIST_DISCHARGED, getDischargedPatientsListItems);
}

export function* watchGetAllList() {
  yield takeEvery(PATIENTS_GET_LIST_ALL, getAllPatientsListItems);
}

export function* watchAdmitItem() {
  yield takeEvery(PATIENTS_ADMIT_ITEM, admitPatientsItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchRemoveItem),
    fork(watchDischargeItem),
    fork(watchGetDischargedList),
    fork(watchAdmitItem),
    fork(watchRemoveDischargedItem),
    fork(watchGetAllList)
  ]);
}
