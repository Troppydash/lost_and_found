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
import Menu from './components/menu';

function App() {
    return (
        <Router>
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
        </Router>
    );
}

export default App;
