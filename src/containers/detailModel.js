import React from 'react';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { notify } from '../util/helpers';
import './detailModel.css';

function DetailModel( { item , clearDetailItem } ) {
    const handleClose = () => {
        clearDetailItem();
    };

    return (
        <Dialog open={ true } onClose={ handleClose } maxWidth="lg">
            <DialogTitle>
                { item.itemType } by { item.firstName ? `${ item.firstName }${ (' ' + item.lastName) || '' }` : 'Unknown' }
            </DialogTitle>
            <DialogContent>
                <div className="model-image-container">
                    {
                        item.imageSrc
                            ? <img src={ item.imageSrc } alt="this is an image" />
                            : <Typography variant="body1">There are no image for this item</Typography>
                    }

                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={ handleClose } color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}


export default DetailModel;
