import { Dialog , DialogContent , DialogTitle , FormGroup } from '@material-ui/core';
import React , { useContext , useEffect } from 'react';
import Item from '../components/item';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import './markModel.css';
import axios from 'axios';
import { SnackbarContext } from '../util/SnackbarContext';
import LostItem from '../components/lostItem';
import Typography from '@material-ui/core/Typography';
import { foundItemLabels , lostItemLabels } from '../util/labels';
import { LOST_ITEM } from '../util/cachingKeys';
import TextField from '@material-ui/core/TextField';
import similarity from 'similarity';
import ItemCard from './itemCard';


function MarkModel( { item , clearMarkItem } ) {
    const handleClose = () => {
        clearMarkItem();
    };

    const { showSnackbar } = useContext(SnackbarContext);

    const [lostItems , setLostItems] = React.useState([]);
    const [error , setError] = React.useState(null);
    const [isLoading , setIsLoading] = React.useState(false);

    const [selectedItem , setSelectedItem] = React.useState('');
    const [query , setQuery] = React.useState('');

    useEffect(() => {

        if (localStorage.getItem(LOST_ITEM)) {
            setLostItems(JSON.parse(localStorage.getItem(LOST_ITEM)));
        } else {
            setIsLoading(true);
        }
        // Get all lost items
        axios.get('/lost/getItems')
            .then(res => {
                setIsLoading(false);
                setLostItems(res.data);
                localStorage.setItem(LOST_ITEM, JSON.stringify(res.data));
            })
            .catch(err => {
                setIsLoading(false);
                setError(err);
                showSnackbar('error' , 'There was an problem fetching the items');
            });

    } , []);

    const handleSubmit = () => {
        axios.post('/item/markItem', {
            foundItemId: item.itemId,
            lostItemId: selectedItem || ''
        })
            .then(res => {
                showSnackbar('success', res.data.message);
            })
            .catch(err => {
                showSnackbar('error', err.response.error);
            })
            .finally(() => {
                handleClose();
            })
    };

    return (
        <Dialog open={ true } onClose={ handleClose } maxWidth="lg" fullWidth>
            <DialogTitle>
                {""}
            </DialogTitle>
            <DialogContent>
                <div className="markmodel-flex-box">
                    <div className="selected-item-container">
                        <ItemCard item={item} />
                    </div>
                    <div className="lost-item-container">
                        <div className="header-text">
                            <Typography variant="h4" color="primary">Lost Items</Typography>
                        </div>
                        {
                            error && <p>An error occurred</p>
                        }
                        <div className='markmodel-query-flex-box'>
                            <Typography variant="h6" color="primary">Query</Typography>
                            <FormGroup>
                                <TextField size="small" style={ { background: '#f2f2f2' } } value={ query }
                                           onChange={ e => setQuery(e.target.value) } />
                            </FormGroup>
                        </div>
                        <div className="lost-item-table-container">
                            <table className="lost-item-table">
                                <thead>
                                <tr>
                                    {
                                        lostItemLabels.map(( v , i ) => (
                                            <th key={ i }>{ v }</th>
                                        ))
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    !isLoading ? (
                                        lostItems && lostItems.length !== 0 ? (
                                            lostItems.filter(v => {
                                                let fullName = `${ v.firstName } ${ v.lastName }`.toLowerCase();
                                                if (fullName.includes(query) || !query) {
                                                    return true;
                                                }
                                                return similarity(fullName , query) > 0.3;
                                            }).map(( item , index ) => (
                                                <LostItem item={ item } key={ index }
                                                          onClick={ () => {
                                                              setSelectedItem(selectedItem === item.itemId ? '' : item.itemId);
                                                          } }
                                                          selectedItem={ selectedItem } />
                                            ))

                                        ) : (
                                            <tr>
                                                <td colSpan={ lostItemLabels.length } style={ { textAlign: 'center' } }>
                                                    <Typography variant="h2" color="textSecondary">There are currently
                                                        no
                                                        Lost
                                                        Item</Typography>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan={ lostItemLabels.length } style={ { textAlign: 'center' } }>
                                                <Typography variant="h2" color="textSecondary">Loading...</Typography>
                                            </td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                        {
                            selectedItem && (
                                <div>
                                    <Typography variant='body1' color="secondary">Selected Item: {selectedItem}</Typography>
                                </div>
                            )
                        }
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={ handleSubmit } color="primary">
                    Mark
                </Button>
                <Button onClick={ handleClose } color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default MarkModel;
