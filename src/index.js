import React from 'react';
import ReactDOM from 'react-dom';

const rootEl = document.getElementById("root");

let color = 'light.purple';
if (localStorage.getItem('themeColor')) {
  color = localStorage.getItem('themeColor');
}

let render = () => {
  import('./assets/css/sass/themes/gogo.' + color + '.scss').then(x => {
    const MainApp = require('./App').default;
    ReactDOM.render(
      <MainApp />,
      rootEl
    );
  });
};

if (module.hot) {
  module.hot.accept('./App', () => {
    import('./assets/css/sass/themes/gogo.' + color + '.scss').then(x => {
      const NextApp = require('./App').default;
      render(
        <NextApp />,
        rootEl
      );
    });
  });
}

render();