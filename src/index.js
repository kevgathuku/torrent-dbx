import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bulma/css/bulma.css';

import App from './App';
import { store } from './reducer';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

store.subscribe(() => {
  let state = store.getState();
  for (const prop in state.torrents) {
    if (state.torrents.hasOwnProperty(prop)) {
      console.log(`store.${prop} = ${state.torrents[prop]}`);
    }
  }
});
