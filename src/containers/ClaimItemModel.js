import React , { useContext } from 'react';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import axios from 'axios';
import { LoadingbarContext , SnackbarContext } from '../util/contexts';

function ClaimItemModel( { item , clearClaimItem } ) {
    const { showSnackbar } = useContext(SnackbarContext);
    const { startLoadingBar , stopLoadingBar } = useContext(LoadingbarContext);

    const handleClaim = () => {
        startLoadingBar();
        axios.post('item/claimItem' , {
            itemId: item.itemId
        })
            .then(res => {
                showSnackbar('success' , res.data.message);
            })
            .catch(err => {
                console.log(err);
                showSnackbar('error' , err.response.error);
            })
            .finally(() => {
                handleClose();
                stopLoadingBar();
            });
    };

    const handleClose = () => {
        clearClaimItem();
    };

    return (
        <Dialog open={ true } onClose={ handleClose } maxWidth="sm" fullWidth>
            <DialogTitle>Claim this item?</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    { item.itemType } by { item.firstName ? `${ item.firstName }${ (' ' + item.lastName) || '' }` : 'Unknown' }
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={ handleClaim } color="primary">
                    Claim
                </Button>
                <Button onClick={ handleClose } color="secondary" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ClaimItemModel;
