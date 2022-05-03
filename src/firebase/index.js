import firebase from 'firebase/compat/app';
import {firebaseConfig} from 'Constants/defaultValues'
import 'firebase/compat/auth'; //v9
import 'firebase/compat/database'; //v9
import 'firebase/compat/analytics'; //v9
import { getAnalytics } from 'firebase/analytics';


const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = firebase.auth();
const database = firebase.database();

export {
    auth,
    database
};
