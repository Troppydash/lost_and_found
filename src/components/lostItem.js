import React from 'react';
import dayjs from 'dayjs';

const LostItem = ( {
                       item ,
                       onClick = () => {
                       } ,
                       selectedItem = -1 ,
                       children
                   } ) => {
    return (
        <tr onClick={ onClick } className={ selectedItem === item.itemId ? 'selected-row' : '' }>
            <td className='itemType'>{ item.itemType }</td>
            <td className='date'>{ dayjs(item.lostAt).format('DD/MM/YYYY') }</td>
            <td className='name'>{ `${ item.firstName } ${ item.lastName }` }</td>
            <td style={ { maxWidth: '20vw' } } className='description'>
                <p style={ { wordWrap: 'break-word' } }>{ item.description.substring(0 , 50) }</p>
            </td>
            <td className='house'>{ item.house }</td>
            {
                children
            }
        </tr>
    );
};

export default LostItem;
