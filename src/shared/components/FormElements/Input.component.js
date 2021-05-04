import React, { useReducer, useEffect } from 'react';
import { validate } from '../../util/validators';

import './Input.styles.css';



//just like a regular reducer, accepts current state and action.
//Reducers are not special. they are normal functions. it's only when we pass/return the resulting state back to the useReducer() that makes the component update/rerender.
const inputReducer = (state, action) => {
    switch (action.type) {
        case 'VALUE_CHANGE':
            return { //we don't always have to return an object, but in our case we are returning multiple state peices, not just one so we have to return an object representing the entire state.
                ...state, //copy all old state's key/value pairs then below overwrite any existing properties. The spread operator works like Object.assign kinda
                value: action.payload.val,
                isValid: validate(action.payload.val, action.payload.validators) //using the validate() function that accepts the value in question and an array of validators that must be passed in via action.validators. The action gets it's validators however from props.validators, an array of validators which you must pass in.
            }
        case 'TOUCHED':
            return {
                ...state,
                touched: true
            }
        default:
            return state;
    }
};//end of inputReducer

const Input = props => {

    const INITIAL_STATE = {
        value: props.initialValue || '',
        touched: false,
        isValid: props.initialIsValid || false
    };

    //accepts a reducer and a a starting state. Then it gives us back inputState which we can reference in our code (same as we would with this.state) and a dispatch function which we can also use in our code which we pass an action that will determine how the state is updated. (The dispatch will send the action to "inputReducer".)
    const [inputState, dispatch] = useReducer(inputReducer, INITIAL_STATE);


    //now using the useEffect hook to "watch" for these values [props.id,props.onInput, inputState.value,inputState.isValid] that we pass as a second argument, for any changes so then we can notify our parent component that's hosting <Input/> via a callback function called onInput() which we pass the values up as well.
    const { id, onInput } = props;
    const { value, isValid } = inputState;
    useEffect(() => {
        props.onInput(id, value, isValid)
    }, [id, onInput, value, isValid]);

    //this is the function that will call the update function to 2-way bind the input's state value
    const onChangeHandler = value => {
        // ******maybe write the validation logic in here before passing it to the reducer? instead of validators:props.validators, you could just pass the result of... validate(value, props.validators) And then in the reducer, set isValid to the result.******
        const action = { type: 'VALUE_CHANGE', payload: { val: value, validators: props.validators } };
        dispatch(action);
    }

    const onBlurHandler = () => {
        const action = { type: 'TOUCHED', payload: { touched: true } };
        dispatch(action);
    }

    let element;
    switch (props.element) {
        case 'input':
            element = (
                <input
                    value={inputState.value}
                    onBlur={() => onBlurHandler()}
                    onChange={(e) => onChangeHandler(e.target.value)}
                    id={props.id}
                    type={props.type}
                    placeholder={props.placeholder}
                    required={props.required}
                />
            );
            break;
        case 'textarea':
            element = (
                <textarea
                    value={inputState.value}
                    onBlur={() => onBlurHandler()}
                    onChange={(e) => onChangeHandler(e.target.value)}
                    id={props.id}
                    type={props.type}
                    rows={props.rows || 3}
                    required={props.required}
                />
            );
            break;
        default:
            return element;
    };
    //end of element switch case


    return (
        <div className={`form-control ${!inputState.isValid && inputState.touched && 'form-control--invalid'}`}>
            <label htmlFor={props.id} >{props.label}</label>
            {element}
            {!inputState.isValid && inputState.touched && <p>{props.errMsg || "Can't leave it like that, sorry"}</p>}
        </div>
    )
}

export default Input;
