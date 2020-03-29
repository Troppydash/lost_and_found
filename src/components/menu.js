import React from 'react';
import { Link , BrowserRouter as Router , } from 'react-router-dom';
import './menu.css'
import { useLocation } from 'react-router-dom';

function Menu( props ) {
    let location = useLocation();
    return (
        <>
            <div className="menu">
                <div className="menu-flex-box">
                    <div className={`LinkContainer ${location.pathname === "/" ? "SelectedLink" : ""}`}>
                        <Link to="/">Home</Link>
                    </div>
                    <div className={`LinkContainer ${location.pathname === "/found" ? "SelectedLink" : ""}`}>
                        <Link to="/found">Found</Link>
                    </div>
                    <div className={`LinkContainer ${location.pathname === "/lost" ? "SelectedLink" : ""}`}>
                        <Link to="/lost">Lost</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Menu;
