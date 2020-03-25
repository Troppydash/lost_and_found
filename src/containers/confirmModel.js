import React from 'react';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { notify } from '../util/helpers';

function ConfirmModel({item, clearDeletedItem}) {

    const handleDelete = () => {

        axios.post('/found/deleteItem', { itemId: item.itemId })
            .then(res => {
                notify('confirmModel.js', 'Delete Success');
            })
            .catch(err => {
                notify('confirmModel.js', 'Delete Failed');
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

