import React , { Component } from 'react';
import axios from 'axios';
import { notify } from '../util/helpers';
import './content.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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
import GlobalSnackbar from './globalSnackbar';

dayjs.extend(relativeTime);

class Content extends Component {
    state = {
        isLoading: false ,
        hasError: null ,
        items: [] ,

        query: '' ,

        deleteItem: null ,
        detailItem: null ,
    };

    unSub = null;
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        notify('content.js' , 'Mounting Listener');

        if (this._isMounted) {
            this.setState({
                isLoading: true,
            });
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
                if (this._isMounted) {
                    this.setState({
                        isLoading: false ,
                        hasError: null ,
                        items: res.data ,
                        observer: database.collection('found'),
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

    handleDetail = item => {
        this.setState({
            detailItem: item
        });
    };

    render() {
        const labels = ['item type' , 'found at' , 'name' , 'description' , 'house' , 'is claimed' , ''];
        const { isLoading , hasError , items , query , deleteItem , detailItem } = this.state;
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

                <div className='action-flex-box'>
                    <Typography variant="h6" color="primary">Query</Typography>
                    <FormGroup>
                        <TextField size="small" style={ { background: '#f2f2f2' } } value={ query }
                                   onChange={ e => this.setState({ query: e.target.value.toLowerCase() }) } />
                    </FormGroup>
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
                                        labels.map(( item , key ) => (
                                            <th key={ key }>{ item }</th>
                                        ))
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    items.length > 0 ? (
                                        items.filter(v => {
                                            let fullName = `${ v.firstName } ${ v.lastName }`.toLowerCase();
                                            if (fullName.includes(query) || !query) {
                                                return true;
                                            }
                                            return similarity(fullName , query) > 0.3;

                                        }).map(( item , i ) => (
                                            <tr key={ item.itemId }>
                                                <td onClick={ () => this.handleDetail(item) }>{ item.itemType }</td>
                                                <td onClick={ () => this.handleDetail(item) }>{ dayjs(item.foundAt).fromNow() }</td>
                                                <td onClick={ () => this.handleDetail(item) }>{ `${ item.firstName } ${ item.lastName }` }</td>
                                                <td style={ { maxWidth: '20vw' } }
                                                    onClick={ () => this.handleDetail(item) }>
                                                    <p style={ { wordWrap: 'break-word' } }>{ item.description.substring(0 , 50) }</p>
                                                </td>
                                                <td onClick={ () => this.handleDetail(item) }>{ item.house }</td>
                                                <td onClick={ () => this.handleDetail(item) }>{ item.isClaimed ? 'Claimed' : 'Pending' }</td>
                                                <td>
                                                    <div className="flex-box" style={ { minHeight: 'initial' } }>
                                                        <Button color="primary" variant="contained"
                                                                onClick={ () => this.handleDelete(item) }>Delete</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (isLoading && (
                                        <tr>
                                            <td colSpan={ labels.length } style={ { textAlign: 'center' } }>
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

export default Content;
