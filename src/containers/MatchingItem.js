import React from 'react';
import { Card , CardActions } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { similarItemLabels } from '../util/labels';
import FoundItem from '../components/foundItem';
import LostItem from '../components/lostItem';
import './styles/MatchingItem.css';
import Button from '@material-ui/core/Button';

function MatchingItem( { item = { lost: {} , found: {} } , onClick, onMark } ) {
    const { lost , found } = item;
    return (
        <>
            <Card className="matching-item-container" elevation={ 3 }>
                <CardContent>
                    <div className="table-container matching-table-container">
                        <table className="content-table matching-item-table">
                            <thead>
                            <tr>
                                {
                                    similarItemLabels.map(( v , i ) => <th key={ i }>{ v }</th>)
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                lost && found ? (
                                    <>
                                        <tr className="matching-item-title">
                                            <td colSpan={ similarItemLabels.length }>Found</td>
                                        </tr>
                                        <FoundItem item={ found } handleDetail={ onClick } />
                                        <tr className="matching-item-title">
                                            <td colSpan={ similarItemLabels.length }>Lost</td>
                                        </tr>
                                        <LostItem item={ lost } />
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan={ similarItemLabels.length }>Something went wrong</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <CardActions disableSpacing>
                    <Button color="primary" style={{marginLeft: 'auto'}} onClick={() => onMark(found, lost)}>
                        Mark
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}

export default MatchingItem;
