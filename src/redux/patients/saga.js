import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { getDateWithFormat } from "Util/Utils";
import { database } from '../../firebase'
import {
  PATIENTS_GET_LIST,
  PATIENTS_ADD_ITEM,
  PATIENTS_REMOVE_ITEM
} from 'Constants/actionTypes'

import {
  getPatientsListSuccess,
  getPatientsListError,
  addPatientsItemSuccess,
  addPatientsItemError,
  removePatientsItemSuccess,
  removePatientsItemError
} from "./actions";


const getPatientsListRequest = async () => {
  return database.ref('patients')
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
  let items = {};
  item.createDate = getDateWithFormat();
  items.splice(0, 0, item);

  return database.ref('patients/' + item.id)
    .once('value')
    .then(response => {
      if (response.exists()) {
        return database.ref('patients/' + item.id).set({
          name: item.name
        }).then(response => {
          return getPatientsListRequest()
        }).catch(error => error);
      } else {
        return database.ref('patients/' + item.id).set({
          name: item.name,
          createDate: item.createDate,
          assessmentLevel: null,
          surveys: null
        }).then(response => {
          return getPatientsListRequest()
        }).catch(error => error);
      }
    }).catch(error => error);
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
  return database.ref('patients/' + id)
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

export function* watchGetList() {
  yield takeEvery(PATIENTS_GET_LIST, getPatientsListItems);
}

export function* watchAddItem() {
  yield takeEvery(PATIENTS_ADD_ITEM, addPatientsItem);
}

export function* watchRemoveItem() {
  yield takeEvery(PATIENTS_REMOVE_ITEM, removePatientsItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchRemoveItem)
  ]);
}
