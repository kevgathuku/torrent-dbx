import React from 'react';
import ReactDOM from 'react-dom';
import {useStrict} from 'mobx';
import 'skeleton-css/css/normalize.css';
import 'skeleton-css/css/skeleton.css';

import App from './App';
import appStore from './store';

useStrict(true);

ReactDOM.render(
    <App store={appStore}/>,
    document.getElementById('root')
);
