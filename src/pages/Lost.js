import React , { Component } from 'react';
import './styles/Search.css';
import './styles/Table.css';
import AddItem from '../containers/AddItem';
import Divider from '@material-ui/core/Divider';
import { FormGroup } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import similarity from 'similarity';
import ConfirmItemModel from '../containers/ConfirmItemModel';
import { withStyles } from '@material-ui/core/styles';
import { foundItemLabels , lostItemLabels } from '../util/labels';
import MenuItem from '@material-ui/core/MenuItem';
import LostItem from '../components/lostItem';
import { ListenerContext } from '../util/contexts';
import Button from '@material-ui/core/Button';
import FoundItem from '../components/foundItem';

const useStyles = theme => ({
    actionButton: {
        margin: '3px 10px'
    } ,
    actionButtonContainer: {
        minWidth: '200px'
    }
});

class Lost extends Component {
    state = {
        query: '' ,
        by: 'lostAt' ,
        order: 'desc' ,

        deleteItem: null ,
    };

    handleDelete = item => {
        this.setState({
            deleteItem: item
        });
    };

    render() {
        const { classes } = this.props;

        const { query , deleteItem , by , order } = this.state;
        return (
            <>
                {
                    deleteItem ? <ConfirmItemModel item={ deleteItem } isLost={ true }
                                                   clearDeletedItem={ () => this.setState({ deleteItem: null }) } /> : null
                }
                <div className='action-flex-box'>
                    <div className="tiny-flex-box">
                        <Typography variant="h6" color="primary">Query</Typography>
                        <FormGroup>
                            <TextField size="small" style={ { background: '#f2f2f2' } } value={ query }
                                       onChange={ e => this.setState({ query: e.target.value.toLowerCase() }) } />
                        </FormGroup>
                    </div>
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
                    <AddItem isLost={ true } />
                </div>

                <Divider />

                <ListenerContext.Consumer>
                    { ( { lostData } ) => {
                        const { items , isLoading , hasError } = lostData;
                        return (
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
                                                        <LostItem item={ item } key={ i }>
                                                            <td className={ classes.actionButtonContainer + " actions" }>
                                                                <div className="flex-box"
                                                                     style={ { minHeight: 'initial' } }>
                                                                    <Button color="primary" variant="contained"
                                                                            className={ classes.actionButton }
                                                                            onClick={ () => this.handleDelete(item) }>Delete</Button>
                                                                </div>
                                                            </td>
                                                        </LostItem>
                                                    ))
                                            ) : (isLoading && (
                                                <tr>
                                                    <td colSpan={ foundItemLabels.length }
                                                        style={ { textAlign: 'center' } }>
                                                        <Typography variant="h2"
                                                                    color="textSecondary">Loading...</Typography>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        );
                    } }
                </ListenerContext.Consumer>
            </>
        );
    }
}

export default withStyles(useStyles)(Lost);
