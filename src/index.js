import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "bulma/css/bulma.css";

import App from "./App";
import { store } from "./reducer";

window.Raven.config(
  "https://f5427ee402e8415bbe7475afc3551eb8@sentry.io/146783"
).install();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

store.subscribe(() => {
  let state = store.getState();
  for (const prop in state.torrents) {
    if (state.torrents.hasOwnProperty(prop)) {
      console.log(`store.${prop} = ${state.torrents[prop]}`);
    }
  }
});
