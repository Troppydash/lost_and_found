
import React from 'react';
import ReactDOM from 'react-dom';
import './css/grid.css';
import './css/font.css';
import './css/global.css';
import * as serviceWorker from './serviceWorker';

import { createMuiTheme } from '@material-ui/core/styles';

import axios from 'axios';
import { ThemeProvider } from '@material-ui/styles';
import SnackbarLayer from './SnackbarLayer';


//https://us-central1-lost-and-found-660fb.cloudfunctions.net/api
//http://localhost:5000/lost-and-found-660fb/us-central1/api
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#b82832' ,
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        } ,
        secondary: {
            light: '#6b6b6b' ,
            main: '#4b4b4b' ,
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#000000' ,
        } ,
    } ,
});

ReactDOM.render(
    <ThemeProvider theme={ theme }>
        <SnackbarLayer />
    </ThemeProvider> ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
