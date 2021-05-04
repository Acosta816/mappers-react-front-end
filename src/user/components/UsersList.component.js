import React from 'react';
import Card from '../../shared/components/uiElements/Card.component';
import UserItem from './UserItem.component';
import './UsersList.styles.css';

const UsersList = props => {
    if (props.users.length < 1) {
        return <div className="center"><Card><h2>NO USERS FOUND</h2></Card></div>
    }

    return (
        <ul className="users-list">
            {props.users.map(user => {
                return (
                    <UserItem
                        key={user.id}
                        id={user.id}
                        image={user.image}
                        name={user.fullName}
                        placesCount={user.places.length} />
                )
            })}
        </ul>
    );
}

export default UsersList;
