import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

function Alert( props ) {
    return <MuiAlert elevation={ 6 } variant="filled" { ...props } />;
}

const GlobalSnackbar = ( { isShowing , type = 'info' , message , clearSnackBar } ) => {
    return (
        <>
            {
                isShowing && (
                    <Snackbar open={ isShowing } autoHideDuration={ 3000 } onClose={ clearSnackBar }
                              anchorOrigin={ { vertical: 'bottom' , horizontal: 'right' } }>
                        <Alert severity={ type || 'info' }>{ message }</Alert>
                    </Snackbar>
                )
            }
        </>
    );
};

export default GlobalSnackbar;
