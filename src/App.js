import React from 'react';
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

function App() {
    return (
        <div className="grid-container">
            <Header/>
            <Router>
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
            </Router>
            <Footer/>
        </div>
    );
}

export default App;
