
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth, database } from '../../firebase';
import {
    LOGIN_USER,
    LOGOUT_USER
} from 'Constants/actionTypes';

import { loginUserSuccess } from './actions';

const loginWithEmailPasswordAsync = async (email, password) =>
    await auth.signInWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);

function* loginWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload;
    try {
        const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        if (!loginUser.message) {
            localStorage.setItem('user_id', loginUser.user.uid);
            localStorage.setItem('user_email', loginUser.user.email);

            // get user wards access from userSettings
            const wards = yield call(getUserWardsRequest, loginUser.user.uid);
            // store full list of wards
            localStorage.setItem('user_wards', JSON.stringify(wards));
            // store first ward as the current ward
            localStorage.setItem('user_currentWard', wards[0])

            // if wards access is set to all then get all wards from the database
            if (wards[0] === 'all' || wards.length === 0) {
                const allWards = yield call(getAllWardsListRequest);
                // store all wards into a list
                localStorage.setItem('wards_all', JSON.stringify(allWards));
                // store first ward from all wards into current ward
                localStorage.setItem('user_currentWard', allWards[0])
            }
            
            yield put(loginUserSuccess(loginUser));
            history.push('/');
        } else {
            // catch throw
            console.log('login failed :', loginUser.message);
        }
    } catch (error) {
        // catch throw
        console.log('login error : ', error);
    }
}

// function to get user wards from userSettings table
const getUserWardsRequest = async (userId) => {
    return database.ref('userSettings/' + userId + '/wards')
        .once('value')
        .then(response => {
            response = response.val();
            let wardArray = []
            if(response != null) {
                wardArray = response.split(',');
                wardArray = wardArray.map(el => el.trim());
            }
            return wardArray;
        })
        .catch(error => error);
};

const getAllWardsListRequest = async () => {
    return database.ref('wards/')
      .once('value')
      .then(response => {
        response = response.val();
        const array = [];
        for (let k in response) {
          array.push(k);
        }
        return array;
      })
      .catch(error => error);
};

const logoutAsync = async (history) => {
    await auth.signOut().then(authUser => authUser).catch(error => error);
    history.push('/')
};

function* logout({payload}) {
    const { history } = payload;
    try {
        yield call(logoutAsync,history);
        // remove user data from localstorage
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_wards');
        localStorage.removeItem('user_currentWard');
        localStorage.removeItem('wards_all');
    } catch (error) {
    }
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}


export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser)
    ]);
}