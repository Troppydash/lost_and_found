import Header from './components/header';
import Menu from './components/menu';
import Footer from './components/footer';
import React from 'react';
import DataLayer from './DataLayer';

function App(props) {
    return (
        <div className="grid-container">
            {
                props.children
            }
            <Header />
            <Menu />

            <div className="content">
                <DataLayer />
            </div>

            <Footer />
        </div>
    )
}

export default App;

