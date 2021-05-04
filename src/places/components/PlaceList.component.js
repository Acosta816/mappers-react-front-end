import React from 'react';
import Button from '../../shared/components/FormElements/Button.component';
import Card from '../../shared/components/uiElements/Card.component';
import PlaceItem from './PlaceItem.component';
import './PlaceList.styles.css';

const PlaceList = props => {
    console.log(props.place);
    if (props.places.length === 0) {
        return (
            <div className="place-list center">
                <Card>
                    <h2>No places found. Create one!</h2>
                    <Button to="/places/new">Share Place</Button>
                </Card>
            </div>);
    }
    console.log(props)

    return <ul className="place-list">
        {props.places.map(place => (
            <PlaceItem
                key={place.id}
                id={place.id}
                image={place.image}
                title={place.title}
                description={place.description}
                address={place.address}
                creatorId={place.creatorId}
                coordinates={place.location}
                onDelete={props.onDeletePlace}
            />
        ))}
    </ul>

}

export default PlaceList;
