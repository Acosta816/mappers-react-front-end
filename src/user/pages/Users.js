import React, { useEffect, useState } from 'react'
import ErrorModal from '../../shared/components/uiElements/ErrorModal.component';
import LoadingSpinner from '../../shared/components/uiElements/LoadingSpinner.component';
import { useHttpClient } from '../../shared/hooks/http-hook';
import UsersList from '../components/UsersList.component';


const Users = props => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const getAllUsers = () => {

            sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`)
                .then(users => {
                    setLoadedUsers(() => users);
                })
                .catch(err => {
                });
        };
        getAllUsers();
    }, [sendRequest]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList users={loadedUsers} />}
        </>
    )
}

export default Users;
