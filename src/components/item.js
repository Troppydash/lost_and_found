import dayjs from 'dayjs';
import Button from '@material-ui/core/Button';
import React from 'react';

function Item( {
                   item ,
                   handleDetail = () => {
                   } ,
                   children
               } ) {

    return (
        <tr key={ item.itemId }>
            <td onClick={ () => handleDetail(item) }>{ item.itemType }</td>
            <td onClick={ () => handleDetail(item) }>{ dayjs(item.foundAt).format('DD/MM/YYYY mm:hh') }</td>
            <td onClick={ () => handleDetail(item) }>{ `${ item.firstName } ${ item.lastName }` }</td>
            <td style={ { maxWidth: '15vw' } }
                onClick={ () => handleDetail(item) }>
                <p style={ { wordWrap: 'break-word' } }>{ item.description.substring(0 , 50) }</p>
            </td>
            <td onClick={ () => handleDetail(item) }>{ item.house }</td>
            <td onClick={ () => handleDetail(item) }>{ item.status }</td>
            { children }
        </tr>
    );
}

export default Item;
