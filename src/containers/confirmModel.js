import React , { useContext } from 'react';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { notify } from '../util/helpers';
import { SnackbarContext } from '../util/SnackbarContext';

function ConfirmModel({item, clearDeletedItem}) {
    const {showSnackbar} = useContext(SnackbarContext);

    const handleDelete = () => {

        axios.post('/found/deleteItem', { itemId: item.itemId })
            .then(res => {
                notify('confirmModel.js', 'Delete Success');
                showSnackbar('success', "Item successfully Deleted");
            })
            .catch(err => {
                notify('confirmModel.js', 'Delete Failed');
                showSnackbar('error', "There was a problem deleting your item");
                console.error(err);
            })
            .finally(() => {
                handleClose();
            })
    };

    const handleClose = () => {
        clearDeletedItem();
    };

    return (
        <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    {item.itemType} by {item.firstName ? `${item.firstName}${(' ' + item.lastName) || ''}` : "Unknown"}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary" autoFocus>
                    Cancel
                </Button>
                <Button onClick={handleDelete} color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmModel;

