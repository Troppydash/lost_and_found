import React from 'react';
import GlobalSnackbar from './components/globalSnackbar';
import { SnackbarContext } from './util/contexts';
import {BrowserRouter as Router } from 'react-router-dom';
import LoadingBarLayer from './LoadingBarLayer';

const initialValue = {
    isShowing: false ,
    type: '' ,
    message: ''
};

function SnackbarLayer() {
    const [snackbar , setSnackbar] = React.useState(initialValue);

    return (
        <Router>
            <GlobalSnackbar { ...snackbar } clearSnackBar={ () => setSnackbar({
                isShowing: false ,
            }) } />
            <SnackbarContext.Provider value={ {
                showSnackbar: ( type , message ) => {
                    setSnackbar({
                        isShowing: true ,
                        type ,
                        message
                    });
                }
            } }>
                <LoadingBarLayer/>
            </SnackbarContext.Provider>
        </Router>
    );
}

export default SnackbarLayer;
