import React, { useContext, useState } from 'react';
import Card from '../../shared/components/uiElements/Card.component';
import Button from '../../shared/components/FormElements/Button.component';

import './PlaceItem.styles.css';
import Modal from '../../shared/components/uiElements/Modal.component';
import Map from '../../shared/components/uiElements/Map.component';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useHistory } from 'react-router';
import ErrorModal from '../../shared/components/uiElements/ErrorModal.component';
import LoadingSpinner from '../../shared/components/uiElements/LoadingSpinner.component';

const PlaceItem = props => {
    const auth = useContext(AuthContext);

    const [showMap, setShowMap] = useState(() => false);

    //this state is for the "ARE YOU SURE?" Delete Modal
    const [showDeleteModalState, setShowDeleteModal] = useState(() => false);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const history = useHistory();

    const openMapHandler = () => {
        setShowMap(prevState => true);
    };

    const closeMapHandler = () => {
        setShowMap(prevState => false);
    };

    const showDeleteModalHandler = () => {
        setShowDeleteModal(() => true);
    };

    const cancelDeleteHandler = () => {
        setShowDeleteModal(() => false);
    };

    const confirmDeleteHandler = async () => {
        setShowDeleteModal(() => false);
        console.log('DELETING...');
        try {

            const headers = {
                Authorization: `Bearer ${auth.token}`
            }

            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`, 'DELETE', null, headers);
            props.onDelete(props.id);
        } catch (err) {

        };

    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>

            <Modal
                show={showDeleteModalState}
                onCancel={cancelDeleteHandler}
                header="Delete Place?"
                footerClass="place-item__modal-actions"
                footer={
                    <>
                        <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </>}
            >
                {<p>Are you sure you want to DELETE this place? (can not be undone)</p>}
            </Modal>

            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_ASSET_URL}${props.image}`} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}> VIEW ON MAP</Button>
                        {console.log(auth.isLoggedIn)}
                        {auth.isLoggedIn && (auth.userId === props.creatorId._id) && <Button to={`/places/${props.id}`}>EDIT</Button>}
                        {auth.isLoggedIn && (auth.userId === props.creatorId._id) && <Button danger onClick={showDeleteModalHandler}>DELETE</Button>}
                    </div>
                </Card>
            </li>
        </>
    )
}

export default PlaceItem;
