import React, { useEffect, useRef, useState } from 'react';
import Button from './Button.component';
import './imageUpload.styles.css';

const ImageUpload = (props) => {
    const initialState = props.initialState;
    const [imageState, setImageState] = useState();
    const [previewUrl, setPreviewUrl] = useState(() => initialState);
    const [isValidState, setIsValidState] = useState(() => false);


    const filePickerRef = useRef();

    useEffect(() => {
        if (!imageState) {
            return;
        };
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };

        fileReader.readAsDataURL(imageState);
    }, [imageState]);




    //selected image handler
    const onChangeImageHandler = event => {
        const filesArray = event.target.files;
        let imageFile;
        let fileIsValid = isValidState;
        if (filesArray && filesArray.length === 1) {
            imageFile = filesArray[0];
            console.log(imageFile);
            setImageState(() => imageFile);
            setIsValidState(() => true);
            fileIsValid = true;
        } else {
            setIsValidState(() => false);
            fileIsValid = false;
        };
        console.log(fileIsValid);
        props.onInput(props.id, imageFile, fileIsValid);
    };


    //open the built-in file picker by traversing the dom using the ref linked to filePicker input element and forcing a click event to happen.
    const pickImageHandler = () => {
        filePickerRef.current.click();
    };



    return (
        <div className="form-control">

            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg, .png, .jpeg"
                onChange={(e) => onChangeImageHandler(e)}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="preview" />}
                    {!previewUrl && <p>please pick an image</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValidState && <p>{props.errorText}</p>}
        </div>
    )
}

export default ImageUpload;
