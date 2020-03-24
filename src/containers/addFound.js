import React , { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import MenuItem from '@material-ui/core/MenuItem';

import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import {
    MuiPickersUtilsProvider ,
    KeyboardDatePicker ,
} from '@material-ui/pickers';

import axios from 'axios';
import { notify } from '../util/helpers';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: '20px 0'
    }
}));

function AddFound() {
    const initialState = {
        name: '' ,
        itemType: '' ,
        house: '' ,
        description: '' ,
        foundAt: new Date().toISOString()
    };
    const classes = useStyles();
    const [open , setOpen] = React.useState(false);
    const [formData , setFormData] = React.useState(initialState);
    const [formError , setFormError] = React.useState({});

    const handleClickOpen = () => {
        setFormData(initialState);
        setFormError({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = e => {
        e.preventDefault();

        axios.post('/found/addItem' , formData)
            .then(res => {
                notify('addFound.js' , 'Item added successfully');
                handleClose();
            })
            .catch(err => {
                setFormError(err.response.data);
                notify('addFound.js' , 'Item was failed to add');
            });
    };

    const handleChange = e => {
        setFormData({
            ...formData ,
            [e.target.name]: e.target.value
        });
    };

    const handleDateChange = e => {
        setFormData({
            ...formData ,
            foundAt: e
        });
    };

    return (
        <div>
            <Button variant='outlined' color='primary' onClick={ handleClickOpen }>Insert New</Button>
            <Dialog open={ open } onClose={ handleClose } aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
                <DialogTitle id='form-dialog-title'>Insert New</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add a new item to the found table
                    </DialogContentText>

                    {/*forms*/ }
                    <form onSubmit={ handleSubmit }>
                        <FormGroup>
                            <TextField
                                className={ classes.formControl }
                                autoFocus
                                id="name"
                                name="name"
                                label="Full Name"
                                type="text"
                                fullWidth
                                margin='dense'
                                variant='filled'
                                onChange={ handleChange }
                                value={ formData.name } />
                        </FormGroup>

                        <FormGroup>
                            <TextField
                                error={ !!formError.itemType }
                                className={ classes.formControl }
                                autoFocus
                                id="itemType"
                                name="itemType"
                                label="Item Type"
                                type="text"
                                fullWidth
                                margin='dense'
                                variant='filled'
                                onChange={ handleChange }
                                value={ formData.itemType }
                                helperText={ formError.itemType || '' } />
                        </FormGroup>

                        <FormGroup>
                            <FormControl>
                                <InputLabel id="house">House</InputLabel>
                                <Select
                                    labelId="house"
                                    className={ classes.formControl }
                                    id="house"
                                    name="house"
                                    value={ formData.house }
                                    onChange={ handleChange }>
                                    <MenuItem value="">unknown</MenuItem>
                                    <MenuItem value="Aitken">Aitken</MenuItem>
                                    <MenuItem value="Fergusson">Fergusson</MenuItem>
                                    <MenuItem value="Glasgow">Glasgow</MenuItem>
                                    <MenuItem value="MacKenzie">MacKenzie</MenuItem>
                                    <MenuItem value="Mawson">Mawson</MenuItem>
                                    <MenuItem value="Plimmer">Plimmer</MenuItem>
                                    <MenuItem value="Smith">Smith</MenuItem>
                                    <MenuItem value="Uttley">Uttley</MenuItem>
                                </Select>
                            </FormControl>
                        </FormGroup>

                        <FormGroup>
                            <TextField
                                autoFocus
                                id="description"
                                name="description"
                                label="Description"
                                type="text"
                                fullWidth
                                margin='dense'
                                variant='filled'
                                multiline
                                rows="3"
                                value={ formData.description }
                                onChange={ handleChange } />
                        </FormGroup>

                        <FormGroup>
                            <MuiPickersUtilsProvider utils={ DateFnsUtils }>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="foundAt"
                                    label="Found At"
                                    name="foundAt"
                                    value={ formData.foundAt }
                                    onChange={ handleDateChange }
                                />
                            </MuiPickersUtilsProvider>
                        </FormGroup>
                    </form>

                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleClose }>
                        Cancel
                    </Button>
                    <Button onClick={ handleSubmit } color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddFound;
