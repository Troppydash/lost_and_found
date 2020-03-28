import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/styles';
import { DialogTitle } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';

const useStyles = makeStyles(theme => ({
    media: {
        height: 0 ,
        paddingTop: '70%' ,
    },
    avatar: {
        backgroundColor: red[300],
    },
}));

function ItemCard( { item } ) {
    const classes = useStyles();
    return (
        <Card>
            <CardHeader
                avatar={
                    item.lastName && (
                        <Avatar className={classes.avatar}>
                            {item.lastName[0]}
                        </Avatar>
                    )
                }
                title={ `${ item.firstName || 'Unknown' }'s ${ item.itemType }` }
                subheader={item.house || ''}/>
            {
                item.imageSrc && (
                    <CardMedia className={ classes.media } image={ item.imageSrc } title="Picture" />
                )
            }
            <CardContent>
                <Typography variant='body2' color="textSecondary" component="p" style={{ textAlign: 'center',wordWrap: "break-word", maxWidth: "400px"}}>
                    { item.description || 'This item have no description' }
                </Typography>
            </CardContent>
        </Card>
    );
}

export default ItemCard;
