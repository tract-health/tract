export const defaultMenuType = 'menu-default'; // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const defaultStartPath = '/app/ward';
export const subHiddenBreakpoint=1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale='en';
export const localeOptions=[
    {id:'en',name:'English'}
];

// export const firebaseConfig = {
//   apiKey: "AIzaSyB92u2z3jFrUZMA-aWLRE5oQ6mY3MBkGNU",
//   authDomain: "tract-53f6d.firebaseapp.com",
//   databaseURL: "https://tract-53f6d.firebaseio.com",
//   projectId: "tract-53f6d",
//   storageBucket: "tract-53f6d.appspot.com",
//   messagingSenderId: "204548408896"
// };

export const firebaseConfig = {
  apiKey: "AIzaSyDShgA4kYe1Rrrc8x0F7Iv8IFylWb3nl54",
  authDomain: "tract-cu.firebaseapp.com",
  databaseURL: "https://tract-cu-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tract-cu",
  storageBucket: "tract-cu.appspot.com",
  messagingSenderId: "967370072560",
  appId: "1:967370072560:web:9eefe4c9be87708203bd35",
  measurementId: "G-C85MYW34CW"
};

export const assessmentLevelToColor = (assessmentLevel) => {
  switch (assessmentLevel.toLowerCase()) {
    case 'na':
      return 'na';
    case 'verylow':
      return 'verylow';
    case 'low':
      return 'low';
    case 'medium':
      return 'medium';
    case 'high':
      return 'high';
    case 'veryhigh':
      return 'veryhigh';
    default:
      return 'na';
  }
};

export const searchPath = "/app/layouts/search";
