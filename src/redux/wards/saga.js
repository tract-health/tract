import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { getDateWithFormat } from "Util/Utils";
import { database } from '../../firebase'
import {
  WARDS_GET_LIST
} from 'Constants/actionTypes'

import {
  getWardsListSuccess,
  getWardsListError
} from "./actions";

const getWardsListRequest = async () => {
  return database.ref('wards/')
    .once('value')
    .then(response => {
      response = response.val();
      const array = [];
      // get wards that user can access
      const userWards = JSON.parse(localStorage.getItem('user_wards'));
      for (let k in response) {
        // if user can access this ward we get data
        if (userWards.includes(k) || userWards.length === 0 || userWards[0] === 'all') {
          if (response.hasOwnProperty(k)) {
            let item = response[k];
            item.name = k;
            array.push(item)
          }
        }
      }
      return array;
    })
    .catch(error => error);
};

function* getWardsListItems() {
  try {
    const response = yield call(getWardsListRequest);
    yield put(getWardsListSuccess(response));
  } catch (error) {
    yield put(getWardsListError(error));
  }
}

export function* watchGetList() {
  yield takeEvery(WARDS_GET_LIST, getWardsListItems);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList)
  ]);
}
