import React , { Component } from 'react';
import axios from 'axios';
import { notify } from '../util/helpers';
import './content.css';
import database from '../firebase';
import AddFound from './addFound';
import Divider from '@material-ui/core/Divider';
import { FormGroup } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import similarity from 'similarity';
import ConfirmModel from './confirmModel';
import Button from '@material-ui/core/Button';
import DetailModel from './detailModel';
import { withStyles } from '@material-ui/core/styles';
import Item from '../components/item';
import MarkModel from './markModel';
import { foundItemLabels , lostItemLabels } from '../util/labels';
import { FOUND_ITEM , LOST_ITEM } from '../util/cachingKeys';
import ClaimModel from './claimModel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import LostItem from '../components/lostItem';

const useStyles = theme => ({});

class LostPageContent extends Component {
    state = {
        isLoading: false ,
        hasError: null ,
        items: [] ,

        query: '' ,
        by: 'lostAt' ,
        order: 'desc' ,

        deleteItem: null ,
    };

    unSub = null;
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        notify('lostPageContent.js' , 'Mounting Listener');

        // Get from cache
        if (this._isMounted) {
            if (localStorage.getItem(LOST_ITEM)) {
                const items = JSON.parse(localStorage.getItem(LOST_ITEM));
                this.setState({
                    items
                });
            } else {
                this.setState({
                    isLoading: true ,
                });
            }
        }

        this.unSub = database.collection('lost').onSnapshot(() => {
            if (this._isMounted) {
                notify('lostPageContent.js' , 'Listener Activated');
                this.fetchFromServerAndUpdateState();
            }
        } , err => {
            notify('lostPageContent.js' , 'Mounting Failed');
            console.error(err);
        });
    }

    componentWillUnmount() {
        if (this.unSub) {
            notify('lostPageContent.js' , 'Unmounting Listener');
            this.unSub();
        }
        this._isMounted = false;
        this.unSub = null;
    }

    fetchFromServerAndUpdateState = () => {
        notify('lostPageContent.js' , 'Fetching Items');

        if (this._isMounted) {
            this.setState({
                isLoading: true ,
            });
        }
        axios.get('/lost/getItems')
            .then(res => {
                notify('lostPageContent.js' , 'Fetching Success');
                localStorage.setItem(LOST_ITEM , JSON.stringify(res.data));
                if (this._isMounted) {
                    this.setState({
                        isLoading: false ,
                        hasError: null ,
                        items: res.data ,
                    });
                }
            })
            .catch(err => {
                notify('lostPageContent.js' , 'Fetching Failed');
                if (this._isMounted) {
                    this.setState({
                        isLoading: false ,
                        hasError: err ,
                    });
                }
            });
    };

    handleDelete = item => {
        this.setState({
            deleteItem: item
        });
    };

    render() {
        const { classes } = this.props;

        const { isLoading , hasError , items , query , deleteItem , by , order } = this.state;
        return (
            <>
                {
                    deleteItem ? <ConfirmModel item={ deleteItem }
                                               clearDeletedItem={ () => this.setState({ deleteItem: null }) } /> : null
                }
                <div className='action-flex-box'>
                    {
                        <div className="tiny-flex-box">
                            <Typography variant="h6" color="primary">Query</Typography>
                            <FormGroup>
                                <TextField size="small" style={ { background: '#f2f2f2' } } value={ query }
                                           onChange={ e => this.setState({ query: e.target.value.toLowerCase() }) } />
                            </FormGroup>
                        </div>

                    }
                    <div className="tiny-flex-box">
                        <Typography variant="h6" color="primary">By</Typography>
                        <FormGroup>
                            <TextField size="small" style={ { background: '#f2f2f2' } } value={ by }
                                       select
                                       onChange={ e => this.setState({ by: e.target.value }) }>
                                <MenuItem value="itemType">Item Type</MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="firstName">First Name</MenuItem>
                                <MenuItem value="lastName">Last Name</MenuItem>
                                <MenuItem value="house">House</MenuItem>
                                <MenuItem value="description">Description</MenuItem>
                                <MenuItem value="lostAt">Date</MenuItem>
                            </TextField>
                        </FormGroup>
                    </div>
                    <div className="tiny-flex-box">
                        <Typography variant="h6" color="primary">Order</Typography>
                        <FormGroup>
                            <TextField size="small" style={ { background: '#f2f2f2' } } value={ order }
                                       select
                                       onChange={ e => this.setState({ order: e.target.value }) }>
                                <MenuItem value="asce">Ascendingly</MenuItem>
                                <MenuItem value="desc">Descendingly</MenuItem>
                            </TextField>
                        </FormGroup>
                    </div>
                    <AddFound isLost={true}/>
                </div>

                <Divider />

                {
                    <>
                        { hasError && <h1 style={ { color: 'red' } }>Something went wrong</h1> }
                        <div className='table-container'>
                            <table className="content-table">
                                <thead>
                                <tr>
                                    {
                                        lostItemLabels.map(( item , key ) => (
                                            <th key={ key }>{ item }</th>
                                        ))
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    items.length > 0 ? (
                                        items
                                            .filter(v => {
                                                if (by === 'name') {
                                                    let fullName = `${ v.firstName } ${ v.lastName }`.toLowerCase();
                                                    if (fullName.includes(query) || !query) {
                                                        return true;
                                                    }
                                                    return similarity(fullName , query) > 0.3;
                                                }
                                                let value = v[by].toLowerCase();
                                                if (value.includes(query) || !query) {
                                                    return true;
                                                }
                                                return similarity(value , query) > 0.3;

                                            })
                                            .sort(( a , b ) => {
                                                let value1 = a[by];
                                                let value2 = b[by];

                                                if (by === 'name') {
                                                    value1 = a.firstName + ' ' + a.lastName;
                                                    value2 = b.firstName + ' ' + b.lastName;
                                                }
                                                if (order === 'desc') {
                                                    if (value1 > value2) {
                                                        return -1;
                                                    }
                                                    if (value1 < value2) {
                                                        return 1;
                                                    }
                                                    return 0;
                                                }
                                                if (value2 > value1) {
                                                    return -1;
                                                }
                                                if (value2 < value1) {
                                                    return 1;
                                                }
                                                return 0;
                                            })
                                            .map(( item , i ) => (
                                                <LostItem item={ item } key={i} />
                                            ))
                                    ) : (isLoading && (
                                        <tr>
                                            <td colSpan={ foundItemLabels.length } style={ { textAlign: 'center' } }>
                                                <Typography variant="h2" color="textSecondary">Loading...</Typography>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            </>
        );
    }
}

export default withStyles(useStyles)(LostPageContent);
