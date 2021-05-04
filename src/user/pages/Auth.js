import React, { useState, useContext } from 'react';
import Button from '../../shared/components/FormElements/Button.component';
import ImageUpload from '../../shared/components/FormElements/ImageUpload.component';
import Input from '../../shared/components/FormElements/Input.component';
import Card from '../../shared/components/uiElements/Card.component';
import ErrorModal from '../../shared/components/uiElements/ErrorModal.component';
import LoadingSpinner from '../../shared/components/uiElements/LoadingSpinner.component';
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { action } from '../../shared/util/validators';
import './Auth.styles.css';


const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginModeState, setisLoginMode] = useState(() => true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    const INITIAL_STATE = {
        inputs: {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            },
        },
        formIsValid: false
    }

    const [formState, inputHandler, setFormData] = useForm(INITIAL_STATE);

    const authSubmitHandler = async event => {
        event.preventDefault();

        console.log(formState.inputs);

        if (isLoginModeState) {
            try {
                const headers = {
                    'Content-Type': 'application/json'
                }

                const body = JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                });

                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/login`, 'POST', body, headers);
                console.log(responseData);
                auth.login(responseData.user.id, responseData.token);

            } catch (err) {
                //don't need to handle error here. it's being handled in the hook anyway.
            }


        } else {

            try {
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('firstName', formState.inputs.firstName.value);
                formData.append('lastName', formState.inputs.lastName.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);

                console.log(formData);

                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, 'POST', formData);
                console.log(responseData);
                auth.login(responseData.user.id, responseData.token);
            } catch (err) {

            };//end of catch

        };//end of else


    };//end of authSubmitHandler


    const switchModeHandler = () => {
        if (isLoginModeState === false) {
            setFormData({
                inputs: {
                    ...formState.inputs,
                    firstName: undefined,
                    lastName: undefined,
                    image: undefined
                },
                formIsValid: formState.inputs.email.isValid && formState.inputs.password.isValid
            });
        } else {
            setFormData({
                inputs: {
                    ...formState.inputs,
                    firstName: {
                        value: '',
                        isValid: false
                    },
                    lastName: {
                        value: '',
                        isValid: false
                    },
                    image: {
                        value: null,
                        isValid: false
                    }
                },
                formIsValid: false
            });
        };

        setisLoginMode(prevState => !prevState);

    };//end of switchModeHandler

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverLay />}
                <h2>{isLoginModeState ? 'Login required' : 'Signup'}</h2>
                <hr />
                <form onSubmit={(e) => authSubmitHandler(e)}>
                    {!isLoginModeState && <Input element="input" id="firstName" type="text" label="First Name" validators={[action.REQUIRE]} errMsg="Please enter a valid name." onInput={inputHandler} />}
                    {!isLoginModeState && <Input element="input" id="lastName" type="text" label="Last Name" validators={[action.REQUIRE]} errMsg="Please enter a valid name." onInput={inputHandler} />}
                    {!isLoginModeState && <ImageUpload center id="image" onInput={inputHandler} initialState="https://i.ibb.co/2dtXpf2/blank-avatar.webp" />}
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-Mail"
                        validators={[action.EMAIL]}
                        errMsg="Please enter a valid email address."
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[action.MINLENGTH(6)]}
                        errMsg="Please enter a valid password, at least 5 characters."
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.formIsValid}>{isLoginModeState ? "LOGIN" : "SIGNUP"}</Button>
                    <Button type="button" inverse onClick={switchModeHandler}>SWITCH TO {isLoginModeState ? "SIGNUP" : "LOGIN"}</Button>
                </form>
            </Card>
        </>
    )
}

export default Auth;
