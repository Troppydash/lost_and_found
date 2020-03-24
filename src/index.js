import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './font.css';
import './global.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import axios from 'axios';

axios.defaults.baseURL = 'https://us-central1-lost-and-found-660fb.cloudfunctions.net/api';

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
