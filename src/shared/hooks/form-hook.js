import { useCallback, useReducer } from 'react';


const FormReducer = (state, action) => {
    switch (action.type) {
        case "INPUT_CHANGE":
            let formIsValid = true;
            for (const input in state.inputs) {//example: action dispatched is {inputName: "description", value: "coolio", isValid=true}. Set formIsValid=true in the beginning no matter what. Now cycle through each input in state.inputs, 1st one is "title". If "title" === "description" oops, its not. So skip to else where we will set formIsValid = formIsValid(which is currently true) AND title.isValid which is let's say false. So Now we know that even if this action wasn't for "title", we still looked at it's "isValid" value to determine the overall formIsValid value. Continuing the for loop we reach the 2nd input in state.inputs called "description". So if "description" === "description", cool it does, then overall "formIsValid" = "formIsValid"(which is currently false) AND decription.isValid (which is true). This leaves us with "formIsValid" = false. 
                if (!state.inputs[input]) {
                    continue;
                }
                if (input === action.inputName) {
                    formIsValid = formIsValid && action.isValid   //overall formIsValid depends on the current formIsValid state and the current individual input in question's isValid state. That way even if the current input in question's isValid state is true, the overall form won't be unless the rest of the form is also valid and we would know that if the "formIsValid" were also already true when we were evaluating this single input.
                } else {
                    formIsValid = formIsValid && state.inputs[input].isValid
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputName]: { value: action.value, isValid: action.isValid }
                },
                formIsValid  //returning the result of "formIsValid" that we calculated from cycling above.
            }
        case 'SET_DATA':
            return {
                inputs: action.fillState.inputs,
                formIsValid: action.fillState.formIsValid
            }
        default:
            return state
    };//end of switch
};//end of FormReducer

//accepts starting state which has inputs and overall form validity.
export const useForm = (initialState) => {
    const [formState, dispatch] = useReducer(FormReducer, initialState);

    //adding a callback function that we'll pass to <Input/> which will return input's state to this parent component. Each individual <Input/> will get one.
    //warning: since we added onInput as a useEffect dependency inside <Input/>, if NewPlace rerenders due to changes, it will also reconstruct onInputHandler even though it has the same logic (just how JS works). This will cause useEffect to rerender <Input/> needlessly since it's technically getting a new onInput prop, leading to infinite loop.
    //To fix this infinite loop from the callback prop, we will use "useCallback"
    const onInputHandler = useCallback((id, value, isValid) => {
        const action = { type: "INPUT_CHANGE", inputName: id, value, isValid };
        dispatch(action)
    }, []);//passing in no arguments to useCallback makes it so it just never reconstructs this onInputHandler regardless of NewPlace rerendering. It uses a stored/memoized copy.


    const setFormData = useCallback((fillState) => {
        const action = {
            type: 'SET_DATA',
            fillState
        };
        dispatch(action);
    }, []);

    return [formState, onInputHandler, setFormData];

};


//This is max's version that takes the inputs and validity as 2 separate params. I don't see a point in doing that so i oppted for just passing it an initial state which gets passed to useReducer.
// export const useForm = (initialInputs, initialFormValidity) => {

//     const [formState, dispatch] = useReducer(FormReducer, {
//         inputs: initialInputs,
//         formIsValid: initialFormValidity
//     });

// };