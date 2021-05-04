//These are just self-named variables. Makes it easy to edit and call them where we need to.

const TYPE_REQUIRE = 'REQUIRE';
const TYPE_MINLENGTH = 'MINLENGTH';
const TYPE_MAXLENGTH = 'MAXLENGTH';
const TYPE_MIN = 'MIN';
const TYPE_MAX = 'MAX';
const TYPE_EMAIL = 'EMAIL';
const TYPE_FILE = 'FILE';

//these methids are really just action creators. They return/produce an action. Some of them require a value to be passed like for minlength you would call validatorMinLength(3)
//These action-creators are meant to be passed into the "validate()" function that checks them against the validators that match their action.type.
//so you would use them like this ... validate("i like cheese", [action.REQUIRE, action.MINLENGTH(3), action.MAXLENGTH(10)])
export const action = {
    REQUIRE: () => ({ type: TYPE_REQUIRE }),
    FILE: () => ({ type: TYPE_FILE }),
    MINLENGTH: val => ({
        type: TYPE_MINLENGTH,
        val: val
    }),
    MAXLENGTH: val => ({
        type: TYPE_MAXLENGTH,
        val: val
    }),
    MIN: val => ({ type: TYPE_MIN, val: val }),
    MAX: val => ({ type: TYPE_MAX, val: val }),
    EMAIL: () => ({ type: TYPE_EMAIL }),
}


//exporting a validate() function that accepts a value to test and an array of action creator functions.
//I gave validatorsArray an empty array default param just in case you don't provide a validators prop on the <Input /> it won't throw an error. It'll just return isValue as true.
export const validate = (myValue, validatorsArray = []) => {
    let isValid = true;
    for (const validator of validatorsArray) {
        if (validator.type === TYPE_REQUIRE) {
            isValid = isValid && myValue.trim().length > 0;
        }
        if (validator.type === TYPE_MINLENGTH) {
            isValid = isValid && myValue.trim().length >= validator.val;
        }
        if (validator.type === TYPE_MAXLENGTH) {
            isValid = isValid && myValue.trim().length <= validator.val;
        }
        if (validator.type === TYPE_MIN) {
            isValid = isValid && +myValue >= validator.val;
        }
        if (validator.type === TYPE_MAX) {
            isValid = isValid && +myValue <= validator.val;
        }
        if (validator.type === TYPE_EMAIL) {
            isValid = isValid && /^\S+@\S+\.\S+$/.test(myValue);
        }
    }
    return isValid;
};




//instructions:
//import validate function from this folder into the component that needs so setup validation like so... import { validate } from '../..someDirectory/util/validators/ 
//import actions object which contains action creator methods into the parent component that needs to provide validators prop to the child component that will use them.
// pass the validators prop to the child like so <Input validators={[action.MINLENGTH(3), action.REQUIRED]} />