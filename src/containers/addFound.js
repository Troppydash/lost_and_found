import React , { Component , useContext } from 'react';
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
import { SnackbarContext } from '../util/SnackbarContext';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: '20px 0'
    }
}));

function AddFound({ isLost = false }) {
    const { showSnackbar } = useContext(SnackbarContext);

    const initialState = {
        name: '' ,
        itemType: '' ,
        house: '' ,
        description: '' ,
        time: new Date().toISOString() ,
        image: false
    };
    const classes = useStyles();
    const [open , setOpen] = React.useState(false);
    const [formData , setFormData] = React.useState(initialState);
    const [formError , setFormError] = React.useState({});

    const [haveOthers , setHaveOthers] = React.useState(false);
    const [others , setOthers] = React.useState('');
    const [itemType , setItemType] = React.useState('');

    const handleClickOpen = () => {
        setFormData(initialState);
        setHaveOthers(false);
        setOthers('');
        setItemType('');
        setFormError({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (haveOthers && !others) {
            setFormError({
                ...formError ,
                others: 'Others must not be empty',
                itemType: '',
            });
            return 0;
        }

        let itemToSubmit = {
            name: formData.name ,
            itemType: haveOthers ? others : itemType ,
            house: formData.house ,
            description: formData.description ,
            [isLost ? "lostAt" : "foundAt"]: formData.time
        };

        axios.post(isLost ? '/lost/addItem' : '/found/addItem' , itemToSubmit)
            .then(res => {
                notify('addFound.js' , 'Item added successfully');
                showSnackbar("success", "Item added successfully");

                if (isLost || !formData.image) {
                    return 0;
                }
                submitImage(res.data.itemId)
                    .then(res => {
                        notify('addFound.js' , 'Image added to item successfully');
                        return 0;
                    })
                    .catch(err => {
                        notify('addFound.js' , 'Image failed to add');
                        showSnackbar('error' , 'There was an problem adding your image');
                        console.error(err);
                        return 0;
                    });
            })
            .then(() => {
                handleClose();
            })
            .catch(err => {
                showSnackbar('error' , 'There was an problem adding your item');
                setFormError(err.response.data);
                notify('addFound.js' , 'Item failed to add');
            });
    };

    const handleItemType = ( value , isOther ) => {
        if (isOther) {
            setOthers(value);
        } else {
            setItemType(value);
        }

        if (!isOther && value === 'Others' && !haveOthers) {
            setHaveOthers(true);
        } else if (!isOther && value !== 'Others' && haveOthers) {
            setHaveOthers(false);
        }
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
            time: e
        });
    };

    const submitImage = itemId => {
        let formData = new FormData();
        formData.append('image' , document.getElementById('imageInput').files[0]);
        return axios.post(`/found/addItemImage/${ itemId }` , formData);
    };

    const handleImage = e => {
        document.getElementById('imageInput').click();
    };

    const handleImageChange = e => {
        setFormData({
            ...formData ,
            image: true
        });
    };

    return (
        <div className="tiny-flex-box">
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
                            <FormControl error={formError.itemType}>
                                <InputLabel id="itemType">Item Type</InputLabel>
                                <Select
                                    labelId="itemType"
                                    className={ classes.formControl }
                                    id="itemType"
                                    name="itemType"
                                    value={ itemType }
                                    onChange={ e => handleItemType(e.target.value , false) }>
                                    <MenuItem value="Blazer">Blazer</MenuItem>
                                    <MenuItem value="Shirt">Shirt</MenuItem>
                                    <MenuItem value="PE Gear">PE Gear</MenuItem>
                                    <MenuItem value="Phone">Phone</MenuItem>
                                    <MenuItem value="Computer">Computer</MenuItem>
                                    <MenuItem value="Trousers">Trousers</MenuItem>
                                    <MenuItem value="Others">Others</MenuItem>
                                </Select>

                                {formError.itemType && <FormHelperText>{formError.itemType}</FormHelperText>}

                                {
                                    haveOthers && (
                                        <TextField
                                            error={ formError.others }
                                            className={ classes.formControl }
                                            id="others"
                                            name="others"
                                            label="Others"
                                            type="text"
                                            fullWidth
                                            margin='dense'
                                            variant='filled'
                                            onChange={ e => handleItemType(e.target.value , true) }
                                            value={ others }
                                            helperText={ formError.others || '' } />
                                    )
                                }

                            </FormControl>
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
                                    id="time"
                                    label={isLost ? "Lost At": "Found At"}
                                    name="time"
                                    value={ formData.time }
                                    onChange={ handleDateChange }
                                />
                            </MuiPickersUtilsProvider>
                        </FormGroup>

                        {
                            !isLost && (
                                <FormGroup>
                                    <input type="file" id="imageInput" hidden onChange={ handleImageChange } />
                                    <Button onClick={ handleImage }>{ formData.image ? 'Change' : 'Add' } Image</Button>
                                </FormGroup>
                            )
                        }
                    </form>

                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleSubmit } color="primary">
                        Submit
                    </Button>
                    <Button onClick={ handleClose } autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddFound;
