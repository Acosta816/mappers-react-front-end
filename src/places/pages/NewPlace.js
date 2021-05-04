import React, { useContext } from 'react';
import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input.component';
import Button from '../../shared/components/FormElements/Button.component';
import { action } from '../../shared/util/validators';

import './PlaceForm.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/uiElements/ErrorModal.component';
import LoadingSpinner from '../../shared/components/uiElements/LoadingSpinner.component';
import { useHistory } from 'react-router';
import ImageUpload from '../../shared/components/FormElements/ImageUpload.component';

const INITIAL_STATE = {
    inputs: {
        title: {
            value: "",
            isValid: false
        },
        description: {
            value: "",
            isValid: false
        },
        address: {
            value: "",
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    },
    formIsValid: false
};


const NewPlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    //custom hook we created that takes the starting state of the overall form and internally passes it to useReducer along with it's own formReducer. It returns an array of [formState, onInputHandler].
    const [formState, onInputHandler] = useForm(INITIAL_STATE);

    const history = useHistory();


    //Now we will handle the total form submission
    const placeSubmitHandler = async event => {
        event.preventDefault();

        const { title, description, address, image } = formState.inputs;

        const formData = new FormData();
        formData.append("title", title.value);
        formData.append("description", description.value);
        formData.append("address", address.value);
        formData.append("image", image.value);
        formData.append("creator", auth.userId);

        try {
            //don't need this anymore since we are using native JS FormData() which adds the appropriate headers for us.
            // const body = JSON.stringify({
            //     title: title.value,
            //     description: description.value,
            //     address: address.value,
            //     creator: auth.userId
            // });

            const headers = {
                Authorization: `Bearer ${auth.token}`
            }

            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/`, 'POST', formData, headers);

            //Redirect user to different page
            history.push(`/${auth.userId}/places`);

        } catch (err) {
        }
    };

    return (
        <>

            <ErrorModal error={error} onClear={clearError} />

            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    element="input"
                    type="text"
                    label="Title"
                    id="title"
                    errMsg="please enter a valid title"
                    validators={[action.REQUIRE]}
                    onInput={onInputHandler}
                />
                <Input
                    element="input"
                    type="text"
                    label="Address"
                    id="address"
                    errMsg="please enter a valid address"
                    validators={[action.REQUIRE]}
                    onInput={onInputHandler}
                />
                <ImageUpload id="image" onInput={onInputHandler} initialState="https://i.ibb.co/cDvQyJ8/default-Place-Icon.jpg" errorText={"Please provide and image"} />
                <Input
                    element="textarea"
                    label="Description"
                    id="description"
                    errMsg="please enter a valid description (at least 5 characters)."
                    validators={[action.MINLENGTH(5)]}
                    onInput={onInputHandler}
                />
                <Button type="submit" disabled={!formState.formIsValid}>ADD PLACE</Button>
            </form>
        </>
    )
};

export default NewPlace;

/*Input <input /> props:
    element="input"
    type="text"
    label="First Name"
    required

*/

/*Input <textarea /> props:
    element="textarea"
    type="text"
    label="First Name"
    required
*/