import React , { Component } from 'react';
import { ListenerContext } from '../util/contexts';
import MatchingItem from '../containers/MatchingItem';
import './styles/Table.css';
import ItemDetailModel from '../containers/ItemDetailModel';
import Typography from '@material-ui/core/Typography';

import './styles/Home.css';
import MarkItemModel from '../containers/MarkItemModel';

class Home extends Component {
    static contextType = ListenerContext;

    state = {
        detailItem: null ,
        markItem: null ,
        lostItem: null
    };

    handleDetail = item => {
        this.setState({
            detailItem: item
        });
    };

    handleMark = ( found , lost ) => {
        this.setState({
            markItem: found ,
            lostItem: lost
        });
    };


    render() {
        const { detailItem , markItem , lostItem } = this.state;
        return (
            <>
                {
                    detailItem ? <ItemDetailModel item={ detailItem }
                                                  clearDetailItem={ () => this.setState({ detailItem: null }) } /> : null
                }
                {
                    markItem ? <MarkItemModel item={ markItem } lostItem={ lostItem.itemId }
                                              clearMarkItem={ doesSubmit => {
                                                  this.setState({ markItem: null , lostItem: null });
                                                  if (doesSubmit) {
                                                      console.log(this.context);
                                                      this.context.fetchSimilarItems();
                                                  }
                                              } } /> : null
                }
                <div className="title">
                    <Typography variant="h3" color="primary">Similar Items</Typography>
                </div>
                <ListenerContext.Consumer>
                    { ( { similarItems } ) => {
                        const { items , isLoading , hasError } = similarItems;
                        return (
                            <>
                                { hasError && <h1 style={ { color: 'red' } }>Something went wrong</h1> }
                                {
                                    !isLoading ? (
                                        <div className="home-flex-box">
                                            {
                                                items && items.map(( item , index ) => (
                                                    <MatchingItem item={ item } key={ index }
                                                                  onClick={ this.handleDetail }
                                                                  onMark={ this.handleMark } />
                                                ))
                                            }
                                        </div>
                                    ) : <h1 style={ { color: 'red' } }>Loading...</h1>
                                }
                            </>
                        );
                    } }
                </ListenerContext.Consumer>
            </>
        );
    }

}

export default Home;
