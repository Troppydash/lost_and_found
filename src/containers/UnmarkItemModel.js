import React , { useContext } from 'react';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { LoadingbarContext , SnackbarContext } from '../util/contexts';

function UnmarkItemModel( { item , clearUnmarkItem } ) {
    const { showSnackbar } = useContext(SnackbarContext);
    const { startLoadingBar , stopLoadingBar } = useContext(LoadingbarContext);

    const handleUnmark = () => {
        startLoadingBar();
        axios.post('/item/unmarkItem' , { foundItemId: item.itemId })
            .then(res => {
                showSnackbar('success' , 'Item successfully Unmarked');
            })
            .catch(err => {
                showSnackbar('error' , 'There was a problem unmarking your item');
                console.error(err);
            })
            .finally(() => {
                handleClose();
                stopLoadingBar();
            });
    };

    const handleClose = () => {
        clearUnmarkItem();
    };

    return (
        <Dialog open={ true } onClose={ handleClose } maxWidth="sm" fullWidth>
            <DialogTitle>Unmark this item?</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    { item.itemType } by { item.firstName ? `${ item.firstName }${ (' ' + item.lastName) || '' }` : 'Unknown' }
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={ handleUnmark } color="primary">
                    Unmark
                </Button>
                <Button onClick={ handleClose } color="secondary" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UnmarkItemModel;

