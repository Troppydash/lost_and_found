import React , { useEffect } from 'react';
import {
    Switch ,
    Route ,
} from 'react-router-dom';

import Lost from './pages/Lost';
import Found from './pages/Found';
import Home from './pages/Home';
import { ListenerContext } from './util/contexts';
import { notify } from './util/helpers';
import { FOUND_ITEM , LOST_ITEM } from './util/cachingKeys';
import database from './firebase';
import axios from 'axios';

function DataLayer() {
    const [foundData , setFoundData] = React.useState({
        isLoading: false ,
        hasError: null ,
        items: []
    });

    const [lostData , setLostData] = React.useState({
        isLoading: false ,
        hasError: null ,
        items: []
    });

    let subsFound = null;
    let subsLost = null;

    const [isMounted , setIsMounted] = React.useState(true);

    useEffect(() => {
        // register both listeners

        setIsMounted(true);
        if (isMounted) {
            notify('app.js' , 'Mounting Both Listeners');

            // Found First
            fetchFound();
            fetchLost();
        }

        return () => {
            setIsMounted(false);
            if (subsFound) {
                subsFound();
            }
            if (subsLost) {
                subsLost();
            }
        };
    } , []);

    const fetchFound = () => {
        return new Promise((resolve => {
            if (localStorage.getItem(FOUND_ITEM)) {
                const items = JSON.parse(localStorage.getItem(FOUND_ITEM));
                setFoundData({
                    ...foundData ,
                    items
                });
            } else {
                setFoundData({
                    ...foundData ,
                    isLoading: true
                });
            }

            subsFound = database.collection('found').onSnapshot(() => {
                if (isMounted) {
                    notify('app.js' , 'Found Listener Activated');

                    axios.get('/found/getItems')
                        .then(res => {
                            notify('app.js' , 'Found Fetching Success');
                            localStorage.setItem(FOUND_ITEM , JSON.stringify(res.data));
                            if (isMounted) {
                                setFoundData({
                                    isLoading: false ,
                                    hasError: null ,
                                    items: res.data
                                });
                            }
                        })
                        .catch(err => {
                            notify('app.js' , 'Found Fetching Failed');
                            if (isMounted) {
                                setFoundData({
                                    ...foundData ,
                                    isLoading: false ,
                                    hasError: err ,
                                });
                            }
                        });

                }
                resolve();
            } , err => {
                notify('app.js' , 'Found Mounting Failed');
                resolve();
                console.error(err);
            });
        }));
    };

    const fetchLost = () => {
        return new Promise((resolve => {
            if (localStorage.getItem(LOST_ITEM)) {
                const items = JSON.parse(localStorage.getItem(LOST_ITEM));
                setLostData({
                    ...lostData ,
                    items
                });
            } else {
                setLostData({
                    ...lostData ,
                    isLoading: true
                });
            }

            subsLost = database.collection('lost').onSnapshot(() => {
                if (isMounted) {
                    notify('app.js' , 'Lost Listener Activated');

                    axios.get('/lost/getItems')
                        .then(res => {
                            notify('app.js' , 'Lost Fetching Success');
                            localStorage.setItem(LOST_ITEM , JSON.stringify(res.data));
                            if (isMounted) {
                                setLostData({
                                    isLoading: false ,
                                    hasError: null ,
                                    items: res.data
                                });
                            }
                        })
                        .catch(err => {
                            notify('app.js' , 'Lost Fetching Failed');
                            if (isMounted) {
                                setLostData({
                                    ...lostData ,
                                    isLoading: false ,
                                    hasError: err ,
                                });
                            }
                        });

                }
                resolve();
            } , err => {
                notify('app.js' , 'Lost Mounting Failed');
                resolve();
                console.error(err);
            });
        }));
    };

    return (
        <ListenerContext.Provider value={ { foundData , lostData } }>
            <Switch>
                <Route exact path='/lost'>
                    <Lost />
                </Route>
                <Route exact path='/found'>
                    <Found />
                </Route>
                <Route exact path='/'>
                    <Home />
                </Route>
            </Switch>
        </ListenerContext.Provider>
    );
}

export default DataLayer;
