import React from 'react';
import dayjs from 'dayjs';

const LostItem = ( { item, onClick = () => {}, selectedItem = -1 } ) => {
    return (
        <tr onClick={onClick} className={selectedItem === item.itemId ? "selected-row": ""}>
            <td>{item.itemType}</td>
            <td>{ dayjs(item.lostAt).format('DD/MM/YYYY') }</td>
            <td>{ `${ item.firstName } ${ item.lastName }` }</td>
            <td style={ { maxWidth: '20vw' } }>
                <p style={ { wordWrap: 'break-word' } }>{ item.description.substring(0 , 50) }</p>
            </td>
            <td>{ item.house }</td>
        </tr>
    )
};

export default LostItem
