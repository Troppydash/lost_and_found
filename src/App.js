import React, {Provider} from 'react';
import {
    BrowserRouter as Router ,
    Switch ,
    Route ,
} from 'react-router-dom';


import Header from './components/header';
import Footer from './components/footer';
import Lost from './pages/Lost';
import Found from './pages/Found';
import Home from './pages/Home';
import Menu from './components/menu';
import GlobalSnackbar from './containers/globalSnackbar';
import { SnackbarContext } from './util/SnackbarContext';

const initialValue = {
    isShowing: false,
    type: '',
    message: ''
};

function App() {
    const [snackbar, setSnackbar] = React.useState(initialValue);

    return (
        <Router>
            <GlobalSnackbar {...snackbar} clearSnackBar={ () => setSnackbar(initialValue) }/>
            <SnackbarContext.Provider value={{showSnackbar: (type, message) => {
                    setSnackbar({
                        isShowing: true,
                        type,
                        message
                    })
                }}}>
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
            </SnackbarContext.Provider>
        </Router>
    );
}

export default App;
