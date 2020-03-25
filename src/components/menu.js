import React from 'react';
import { Link , BrowserRouter as Router , } from 'react-router-dom';
import './menu.css'

function Menu( props ) {
    return (
        <>
            <div className="menu">
                <div className="menu-flex-box">
                    <div className="LinkContainer">
                        <Link to="/">Home</Link>
                    </div>
                    <div className="LinkContainer">
                        <Link to="/found">Found</Link>
                    </div>
                    <div className="LinkContainer">
                        <Link to="/lost">Lost</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Menu;
