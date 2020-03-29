import dayjs from 'dayjs';
import React from 'react';

function FoundItem( {
                        item ,
                        handleDetail = () => {
                        } ,
                        children
                    } ) {

    return (
        <tr key={ item.itemId }>
            <td onClick={ () => handleDetail(item) } className="itemType">{ item.itemType }</td>
            <td onClick={ () => handleDetail(item) } className="date">{ dayjs(item.foundAt).format('DD/MM/YYYY hh:mm') }</td>
            <td onClick={ () => handleDetail(item) } className="name">{ `${ item.firstName } ${ item.lastName }` }</td>
            <td style={ { maxWidth: '15vw' } } className="description"
                onClick={ () => handleDetail(item) }>
                <p style={ { wordWrap: 'break-word' } }>{ item.description.substring(0 , 50) }</p>
            </td>
            <td onClick={ () => handleDetail(item) } className="house">{ item.house }</td>
            <td onClick={ () => handleDetail(item) } className="status">{ item.status }</td>
            { children }
        </tr>
    );
}

export default FoundItem;
