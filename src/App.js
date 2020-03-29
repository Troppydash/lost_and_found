import React , { Provider , useEffect } from 'react';
import {
    BrowserRouter as Router ,
    Switch ,
    Route ,
} from 'react-router-dom';
import { useLocation } from 'react-router-dom';


import Header from './components/header';
import Footer from './components/footer';
import Lost from './pages/Lost';
import Found from './pages/Found';
import Home from './pages/Home';
import Menu from './components/menu';
import GlobalSnackbar from './containers/globalSnackbar';
import { SnackbarContext } from './util/SnackbarContext';
import { ListenerContext } from './util/ListenerContext';
import { notify } from './util/helpers';
import { FOUND_ITEM , LOST_ITEM } from './util/cachingKeys';
import database from './firebase';
import axios from 'axios';

const initialValue = {
    isShowing: false ,
    type: '' ,
    message: ''
};

function App() {
    const [snackbar , setSnackbar] = React.useState(initialValue);

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

    const currentLocation = useLocation().pathname;
    const [isMounted , setIsMounted] = React.useState(false);

    useEffect(() => {
        // register both listeners
        notify('app.js' , 'Mounting Listener');

        setIsMounted(true);
        if (isMounted) {
            // Found First
            Promise.all([
                    fetchFound() ,
                    fetchLost()
            ]);
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
                    ...foundData,
                    items
                });
            } else {
                setFoundData({
                    ...foundData,
                    isLoading: true
                })
            }

            subsFound = database.collection('found').onSnapshot(() => {
                if (this._isMounted) {
                    notify('content.js' , 'Listener Activated');

                    axios.get('/found/getItems')
                        .then(res => {
                            notify('content.js' , 'Fetching Success');
                            localStorage.setItem(FOUND_ITEM , JSON.stringify(res.data));
                            if (isMounted) {
                                setFoundData({
                                    isLoading: false,
                                    hasError: null,
                                    items: res.data
                                })
                            }
                        })
                        .catch(err => {
                            notify('content.js' , 'Fetching Failed');
                            if (isMounted) {
                                setFoundData({
                                    ...foundData,
                                    isLoading: false ,
                                    hasError: err ,
                                });
                            }
                        });

                }
                resolve();
            } , err => {
                notify('content.js' , 'Mounting Failed');
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
                    ...lostData,
                    items
                });
            } else {
                setLostData({
                    ...lostData,
                    isLoading: true
                })
            }

            subsLost = database.collection('lost').onSnapshot(() => {
                if (this._isMounted) {
                    notify('content.js' , 'Listener Activated');

                    axios.get('/lost/getItems')
                        .then(res => {
                            notify('content.js' , 'Fetching Success');
                            localStorage.setItem(LOST_ITEM , JSON.stringify(res.data));
                            if (isMounted) {
                                setLostData({
                                    isLoading: false,
                                    hasError: null,
                                    items: res.data
                                })
                            }
                        })
                        .catch(err => {
                            notify('content.js' , 'Fetching Failed');
                            if (isMounted) {
                                setLostData({
                                    ...lostData,
                                    isLoading: false ,
                                    hasError: err ,
                                });
                            }
                        });

                }
                resolve();
            } , err => {
                notify('content.js' , 'Mounting Failed');
                resolve();
                console.error(err);
            });
        }));
    };

    return (
        <Router>
            <GlobalSnackbar { ...snackbar } clearSnackBar={ () => setSnackbar({
                isShowing: false ,
            }) } />
            <SnackbarContext.Provider value={ {
                showSnackbar: ( type , message ) => {
                    setSnackbar({
                        isShowing: true ,
                        type ,
                        message
                    });
                }
            } }>
                <ListenerContext.Provider value={ { foundData, lostData } }>
                    <div className="grid-container">
                        <Header />
                        <Menu />

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

                        <Footer />
                    </div>
                </ListenerContext.Provider>
            </SnackbarContext.Provider>
        </Router>
    );
}

export default App;
