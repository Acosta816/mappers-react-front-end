import React, { useContext, useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button.component';
import Card from '../../shared/components/uiElements/Card.component';
import ErrorModal from '../../shared/components/uiElements/ErrorModal.component';
import LoadingSpinner from '../../shared/components/uiElements/LoadingSpinner.component';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

import PlaceList from '../components/PlaceList.component';

// const DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: 'Crator Lake',
//         description: 'Crater Lake is a crater lake in south-central Oregon in the western United States. It is the main feature of Crater Lake National Park and is famous for its deep blue color and water clarity.',
//         imageUrl: 'https://i.ibb.co/23P1Tkm/crator-lake.jpg',
//         address: 'Crator Lake, Oregon',
//         location: {
//             lat: 42.9391116,
//             lng: -122.113795
//         },
//         creator: 'u1'
//     },
//     {
//         id: 'p2',
//         title: '1000 Steps Beach',
//         description: 'Steep stairs lead to this public beach popular for surfing, sunbathing & volleyball.',
//         imageUrl: 'https://i.ibb.co/3dPztNQ/thousand-step-beach.jpg',
//         address: '31972 Coast Hwy, Laguna Beach, CA 92651',
//         location: {
//             lat: 33.4978069,
//             lng: -117.7410592
//         },
//         creator: 'u2'
//     }
// ]

const UserPlaces = (props) => {
    const auth = useContext(AuthContext);

    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const userIdParam = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseDate = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userIdParam}`);
                console.log(responseDate);
                setLoadedPlaces(() => responseDate);
            } catch (err) {
                //don't have to handle error here. Already handled in hook.
            }
        };//end of fetchPlaces

        fetchPlaces();
    }, [sendRequest, userIdParam]);

    const onDeletePlaceHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevState => prevState.filter(places => places.id !== deletedPlaceId));
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className="center"><LoadingSpinner /></div>}
            {!isLoading && !loadedPlaces && (
                <div className="place-list center">
                    <Card>
                        <h2>No places found. Create one!</h2>
                        <Button to="/places/new">Share Place</Button>
                    </Card>
                </div>)}
            {!isLoading && loadedPlaces && (
                <PlaceList places={loadedPlaces} onDeletePlace={onDeletePlaceHandler} />
            )}

        </>
    )
}

export default UserPlaces;


/*
NOTE: withRouter vs useParams/useLocation/useMatch/useHistory:
withRouter is a HOC, whereas the "use" ones are hooks.
HOCs can wrap any React component, hooks can only be used in functional ones.
withRouter passes in ALL the router props, hooks let you access specific ones only.
They don't have objective advantages or disadvantages, they're 2 different things.

NOTE#2: another alternative to router hooks and withRouter is of course just passing in
the desired route props from the <Route/> that renders this component in App.js. You
would do this simply as
<Route exact path="/:userId/places" render={(routeProps) => <UserPlaces {...routeProps} />} />
*/