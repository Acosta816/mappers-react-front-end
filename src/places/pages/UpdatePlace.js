import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams, withRouter } from 'react-router-dom';
import { useForm } from '../../shared/hooks/form-hook';

import Button from '../../shared/components/FormElements/Button.component';
import Input from '../../shared/components/FormElements/Input.component';
import { action } from '../../shared/util/validators';

import './PlaceForm.css';
import Card from '../../shared/components/uiElements/Card.component';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/uiElements/ErrorModal.component';
import LoadingSpinner from '../../shared/components/uiElements/LoadingSpinner.component';
import { AuthContext } from '../../shared/context/auth-context';



//temorarily using a hard copy of the places dummy data we made in UserPLaces.js
const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Crator Lake',
        description: 'Crater Lake is a crater lake in south-central Oregon in the western United States. It is the main feature of Crater Lake National Park and is famous for its deep blue color and water clarity.',
        imageUrl: 'https://i.ibb.co/23P1Tkm/crator-lake.jpg',
        address: 'Crator Lake, Oregon',
        location: {
            lat: 42.9391116,
            lng: -122.113795
        },
        creator: 'u1',
        placeIsValid: true
    },
    {
        id: 'p2',
        title: '1000 Steps Beach',
        description: 'Steep stairs lead to this public beach popular for surfing, sunbathing & volleyball.',
        imageUrl: 'https://i.ibb.co/3dPztNQ/thousand-step-beach.jpg',
        address: '31972 Coast Hwy, Laguna Beach, CA 92651',
        location: {
            lat: 33.4978069,
            lng: -117.7410592
        },
        creator: 'u2',
        placeIsValid: true
    }
]



const UpdatePlace = (props) => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext); //just tapping into context to get the currently logged-in userId to push to history.push(/userId)
    const [loadedPlaceState, setLoadedPlace] = useState();
    const placeId = useParams().placeId;
    const history = useHistory();


    //building an initial form state using the data from "thisPlace". We will pass this initial form state to useForm.
    const INITIAL_STATE = {
        inputs: {
            title: {
                value: "",
                isValid: true
            },
            address: {
                value: "",
                isValid: true
            },
            description: {
                value: "",
                isValid: true
            }
        },
        formIsValid: true
    };

    const [formState, onInputHandler, setFormData] = useForm(INITIAL_STATE);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
                console.log(responseData);
                setLoadedPlace(() => responseData);
                setFormData(
                    {
                        inputs: {
                            title: {
                                value: responseData.title,
                                isValid: true
                            },
                            address: {
                                value: responseData.address,
                                isValid: true
                            },
                            description: {
                                value: responseData.description,
                                isValid: true
                            }
                        },
                        formIsValid: true
                    }
                );//end of setFormData
            } catch (err) {
                //don't have to handle anything here.
            }
        };//end of fetchplace declaration

        fetchPlace();//now calling fetchPlace

    }, [sendRequest, setFormData, placeId])

    //NOTE: temporary. This will only load if the we haven't received our inputs.title.value
    if (isLoading) {
        return <div className="center"><LoadingSpinner /></div>
    }

    if (!loadedPlaceState && !error) {
        return <div className="center"><Card><h2>Could not find place</h2></Card></div>
    }

    const onUpdateSubmitHandler = async e => {
        e.preventDefault();
        console.log(formState.inputs);
        try {
            const body = JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value,
            });

            const headers = {
                'Content-Type': 'application/json ',
                Authorization: `Bearer ${auth.token}`
            }

            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 'PATCH', body, headers);

            //Redirect user to different page
            history.push(`/${auth.userId}/places`);
        } catch (err) {
        }
    };



    //Note: notice we are passing 2 extra props to <Input/> in the UpdatePlace.js.
    //This is because we have to pass the value and isValid prop values that it already had.
    return (
        <>
            {console.log(loadedPlaceState)}
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlaceState && (
                <form className='place-form' onSubmit={onUpdateSubmitHandler}>
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[action.REQUIRE()]}
                        errMsg="Please enter a valid Title"
                        onInput={onInputHandler}
                        initialValue={loadedPlaceState.title}
                        initialIsValid={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[action.REQUIRE(), action.MINLENGTH(5)]}
                        errMsg="Please enter a valid Description (at least 5 characters)."
                        onInput={onInputHandler}
                        initialValue={loadedPlaceState.description}
                        initialIsValid={true}
                    />
                    <Button type="submit" disabled={!formState.formIsValid}>UPDATE PLACE</Button>
                    <Button type="cancel" onClick={() => props.history.goBack()}>CANCEL</Button>
                </form>
            )
            }
        </>
    )
}

export default withRouter(UpdatePlace);
