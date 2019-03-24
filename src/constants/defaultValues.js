export const defaultMenuType = 'menu-default'; // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const defaultStartPath = '/app/ward';
export const subHiddenBreakpoint=1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale='en';
export const localeOptions=[
    {id:'en',name:'English'}
];

export const firebaseConfig = {
  apiKey: "AIzaSyB92u2z3jFrUZMA-aWLRE5oQ6mY3MBkGNU",
  authDomain: "tract-53f6d.firebaseapp.com",
  databaseURL: "https://tract-53f6d.firebaseio.com",
  projectId: "tract-53f6d",
  storageBucket: "tract-53f6d.appspot.com",
  messagingSenderId: "204548408896"
};

export const assessmentLevelToColor = (assessmentLevel) => {
  switch (assessmentLevel.toLowerCase()) {
    case 'low':
      return 'primary';
    case 'medium':
      return 'secondary';
    case 'high':
      return 'info'
  }
};

export const searchPath = "/app/layouts/search";
