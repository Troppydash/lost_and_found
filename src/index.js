import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './font.css';
import './global.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createMuiTheme } from '@material-ui/core/styles';

import axios from 'axios';
import { ThemeProvider } from '@material-ui/styles';

axios.defaults.baseURL = 'https://us-central1-lost-and-found-660fb.cloudfunctions.net/api';

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#b82832',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#6b6b6b',
            main: '#4b4b4b',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#000000',
        },
    },
});

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider> ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
