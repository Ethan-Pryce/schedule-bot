//Packages
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {useState, componentDidUpdate} from 'react';

//Components
import UserSlider from './user-slider.js';


/*Props */

/* Shows the users and the slider to adjust priority to room owner */
function UserPanel(props){
    var users = props.users;
    useEffect(() => {
        for(const key in props.userTable){
            if(!localStorage.getItem(key))
                localStorage.setItem(key, 2);
        }
    }, [])

    return <div id='userPanel'>          
        {props.userTable ? Object.entries(props.userTable).map(([key, value]) => 
                (<UserSlider key={value + "_id"} name={props.userTable[key]} userID={key} />)
                )
                :null}


            </div>
    //}

}


export default UserPanel