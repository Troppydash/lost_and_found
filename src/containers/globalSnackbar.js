import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

function Alert( props ) {
    return <MuiAlert elevation={ 6 } variant="filled" { ...props } />;
}

const GlobalSnackbar = ( { isShowing , type , message , clearSnackBar } ) => {
    return (
        <>
            <Snackbar open={ isShowing } autoHideDuration={ 3000 } onClose={ clearSnackBar }
                      anchorOrigin={ { vertical: 'bottom' , horizontal: 'right' } }>
                <Alert severity={ type }>{ message }</Alert>
            </Snackbar>
        </>
    );
};

export default GlobalSnackbar;
