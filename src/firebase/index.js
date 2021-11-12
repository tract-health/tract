import firebase from 'firebase/compat/app';
import {firebaseConfig} from 'Constants/defaultValues'
import 'firebase/compat/auth'; //v9
import 'firebase/compat/database'; //v9


firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

export {
    auth,
    database
};
