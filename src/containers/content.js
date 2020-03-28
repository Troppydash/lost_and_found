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
import { foundItemLabels } from '../util/labels';
import { FOUND_ITEM } from '../util/cachingKeys';
import ClaimModel from './claimModel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = theme => ({
    actionButton: {
        margin: '3px 10px'
    } ,
    actionButtonContainer: {
        minWidth: '200px'
    }
});

class Content extends Component {
    state = {
        isLoading: false ,
        hasError: null ,
        items: [] ,

        query: '' ,
        by: 'foundAt' ,
        order: 'desc' ,

        deleteItem: null ,
        detailItem: null ,
        markItem: null ,
        claimItem: null
    };

    unSub = null;
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        notify('content.js' , 'Mounting Listener');

        // Get from cache
        if (this._isMounted) {
            if (localStorage.getItem(FOUND_ITEM)) {
                const items = JSON.parse(localStorage.getItem(FOUND_ITEM));
                this.setState({
                    items
                });
            } else {
                this.setState({
                    isLoading: true ,
                });
            }
        }

        this.unSub = database.collection('found').onSnapshot(() => {
            if (this._isMounted) {
                notify('content.js' , 'Listener Activated');
                this.fetchFromServerAndUpdateState();
            }
        } , err => {
            notify('content.js' , 'Mounting Failed');
            console.error(err);
        });
    }

    componentWillUnmount() {
        if (this.unSub) {
            notify('content.js' , 'Unmounting Listener');
            this.unSub();
        }
        this._isMounted = false;
        this.unSub = null;
    }

    fetchFromServerAndUpdateState = () => {
        notify('content.js' , 'Fetching Items');

        if (this._isMounted) {
            this.setState({
                isLoading: true ,
            });
        }
        axios.get('/found/getItems')
            .then(res => {
                notify('content.js' , 'Fetching Success');
                localStorage.setItem(FOUND_ITEM , JSON.stringify(res.data));
                if (this._isMounted) {
                    this.setState({
                        isLoading: false ,
                        hasError: null ,
                        items: res.data ,
                        observer: database.collection('found') ,
                    });
                }
            })
            .catch(err => {
                notify('content.js' , 'Fetching Failed');
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

    handleMark = item => {
        this.setState({
            markItem: item
        });
    };

    handleDetail = item => {
        this.setState({
            detailItem: item
        });
    };

    handleClaim = item => {
        this.setState({
            claimItem: item
        });
    };

    render() {
        const { classes } = this.props;

        const { isLoading , hasError , items , query , deleteItem , detailItem , markItem , claimItem , by , order } = this.state;
        return (
            <>
                {
                    deleteItem ? <ConfirmModel item={ deleteItem }
                                               clearDeletedItem={ () => this.setState({ deleteItem: null }) } /> : null
                }

                {
                    detailItem ? <DetailModel item={ detailItem }
                                              clearDetailItem={ () => this.setState({ detailItem: null }) } /> : null
                }

                {
                    markItem ? <MarkModel item={ markItem }
                                          clearMarkItem={ () => this.setState({ markItem: null }) } /> : null
                }

                {
                    claimItem && <ClaimModel item={ claimItem }
                                             clearClaimItem={ () => this.setState({ claimItem: null }) } />
                }

                <div className='action-flex-box'>
                    {
                        (by !== 'status' || by !== 'foundAt') && (
                            <div className="tiny-flex-box">
                                <Typography variant="h6" color="primary">Query</Typography>
                                <FormGroup>
                                    <TextField size="small" style={ { background: '#f2f2f2' } } value={ query }
                                               onChange={ e => this.setState({ query: e.target.value.toLowerCase() }) } />
                                </FormGroup>
                            </div>
                        )
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
                                <MenuItem value="status">Status</MenuItem>
                                <MenuItem value="foundAt">Date</MenuItem>
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
                    <AddFound />
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
                                        foundItemLabels.map(( item , key ) => (
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
                                            .filter(v => v.status !== 'claimed' || by === 'status')
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
                                                <Item item={ item } handleDetail={ this.handleDetail } key={ i }>
                                                    <td className={ classes.actionButtonContainer }>
                                                        <div className="flex-box" style={ { minHeight: 'initial' } }>
                                                            {
                                                                item.status === 'pending' ? (
                                                                    <Button color="secondary" variant="contained"
                                                                            className={ classes.actionButton }
                                                                            onClick={ () => this.handleMark(item) }
                                                                            style={ { color: 'white' } }>Mark</Button>
                                                                ) : null
                                                            }
                                                            {
                                                                item.status === 'marked' ? (
                                                                    <Button color="secondary" variant="contained"
                                                                            className={ classes.actionButton }
                                                                            onClick={ () => this.handleClaim(item) }
                                                                            style={ { color: 'white' } }>Claim</Button>
                                                                ) : null
                                                            }
                                                            <Button color="primary" variant="contained"
                                                                    className={ classes.actionButton }
                                                                    onClick={ () => this.handleDelete(item) }>Delete</Button>
                                                        </div>
                                                    </td>
                                                </Item>
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

export default withStyles(useStyles)(Content);
