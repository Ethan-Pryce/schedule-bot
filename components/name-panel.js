//Packages
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {useState, componentDidUpdate} from 'react';
//Components


/* Props 
    user = a list of users
    userTable = user table lookup
*/

/*A simple component that displays the names of people in the room for 
users in the room who dont own the room*/
function NamePanel(props){
    var users = props.users;
    
    return <div id='namePanel'>
        {Array.isArray(users) ? 
        users.map((user, index) => (<h3 key={user + "_id"}>{user}</h3>))
        : null}
    </div>
}


export default NamePanel