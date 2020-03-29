import React from 'react';
import './styles/footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <div className="flex-box">
                <div className="image-container">
                    <img src={ process.env.PUBLIC_URL + '/img/logo/scots_logo_withtext.png' }
                         style={ { height: '170px' , width: 'auto' } } alt='scots-logo' />
                </div>
                <div className="image-container">
                    <img src="http://www.scotscollege.school.nz/wp-content/themes/blank/lib/images/new-ib.png"
                         style={ { height: '80px' , width: 'auto' } } alt='scots-logo' />
                </div>
                <div className="image-container">
                    <img src="http://www.scotscollege.school.nz/wp-content/themes/blank/lib/images/new-is.png"
                         style={ { height: '80px' , width: 'auto' } } alt='scots-logo' />
                </div>
                <div className="image-container">
                    <img src="http://www.scotscollege.school.nz/wp-content/themes/blank/lib/images/ibsc_member.png"
                         style={ { height: '80px' , width: 'auto' } } alt='scots-logo' />
                </div>
            </div>
        </div>
    );
};

export default Footer;
