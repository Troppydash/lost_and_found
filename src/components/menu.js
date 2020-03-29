import React from 'react';
import { Link } from 'react-router-dom';
import './styles/menu.css';
import { useLocation } from 'react-router-dom';

function Menu() {
    let location = useLocation().pathname;
    return (
        <>
            <div className="menu">
                <div className="menu-flex-box">
                    <Link to="/" className={ location === '/' ? 'SelectedLink' : '' }>
                        <div>
                            Home
                        </div>
                    </Link>
                    <Link to="/found" className={ location === '/found' ? 'SelectedLink' : '' }>
                        <div>
                            Found
                        </div>
                    </Link>
                    <Link to="/lost" className={ location === '/lost' ? 'SelectedLink' : '' }>
                        <div>
                            Lost
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Menu;
