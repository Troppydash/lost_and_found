import React , { Component } from 'react';
import axios from 'axios';
import { notify } from '../util/helpers';
import './content.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import database from '../firebase';
import AddFound from './addFound';

dayjs.extend(relativeTime);

class Content extends Component {
    state = {
        isLoading: false ,
        hasError: null ,
        items: [],

        observer: null,
    };

    componentDidMount() {
        notify('content.js' , 'Mounting Listener');

        this.setState({
            observer: database.collection('found')
        }, () => {
            notify('content.js' , 'Mounted Success');
            this.state.observer.onSnapshot(() => {
                notify('content.js' , 'Listener Activated');
                this.fetchFromServerAndUpdateState();
            }, err => {
                notify('content.js', 'Mounting Failed');
                console.error(err);
            })
        });
    }

    componentWillUnmount() {
        if (this.state.observer) {
            notify('content.js', 'Unmounting Listener');
            this.state.observer();
        }
    }

    fetchFromServerAndUpdateState = () => {
        notify('content.js' , 'Fetching Items');

        this.setState({
            isLoading: true ,
        });
        axios.get('/found/getItems')
            .then(res => {
                notify('content.js' , 'Fetching Success');
                this.setState({
                    isLoading: false ,
                    hasError: null ,
                    items: res.data,
                    observer: database.collection('found')
                });
            })
            .catch(err => {
                notify('content.js' , 'Fetching Failed');
                this.setState({
                    isLoading: false ,
                    hasError: err ,
                });
            });
    };

    render() {
        const labels = ['item type' , 'found at' , 'name' , 'description' , 'house' , 'is claimed' , 'image'];
        const { isLoading , hasError , items } = this.state;
        return (
            <>
                <AddFound />
                {
                    !isLoading ? (
                        <>
                            {hasError && <h1 style={{color: 'red'}}>Something went wrong</h1>}
                            <div className='table-container'>
                                <table>
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
                                        items && (
                                            items.map((item, i) => (
                                                <tr key={item.itemId}>
                                                    <td>{item.itemType}</td>
                                                    <td>{dayjs(item.foundAt).fromNow() }</td>
                                                    <td>{`${item.firstName} ${item.lastName}`}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.house}</td>
                                                    <td>{item.isClaimed ? 'Claimed' : 'Pending'}</td>
                                                    <td><img src={item.imageSrc}/></td>
                                                </tr>
                                            ))
                                        )
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : <p>Loading...</p>
                }
            </>
        );
    }
}

export default Content;
