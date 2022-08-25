//Packages
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {useParams} from "react-router-dom";
import { useEffect } from 'react';

//Components
import CalendarTile from './calendar-tile.js';


/* Connection to axios. multiple url is just for testing purposes. 
  Switch Url to test local vs using heroku. */
var url = "http://localhost:5000";
const api = axios.create({
    baseURL: "https://schedule-solver.herokuapp.com",
    //baseURL: "http://localhost:5000",
  });
  

// Updates the times in the database
async function updateCustomTimes(target, value, customTimes, roomID){
    try{
        let id = localStorage.getItem("ID");
        
        //If the value is not available remove it from DB otherwise update
        if(value == 0){
           delete customTimes[target][id]; 
        }
        else{
            customTimes[target][id] = value;
        }

        
        api.put("/putRoomCustom/" + roomID, customTimes)

          
          
    }
    catch(err){
        console.log(err);
    }
}


/* Props
    numUsers = number of users 
    times = from DB the object that contains the custom time objects as fields
    userTable = from DB user lookup table
    roomID = room ID
*/
const CustomPanel = (props) => {
    /*A helper function that gets correct values from the custom
    html atributes on the elements then and passes them corrected to 
    updateCustomTimes */
    async function changeCustomTime(e){
        console.log(e.target.attributes);
        updateCustomTimes(e.target.attributes.target_custom.value, parseInt(e.target.value), props.times, props.roomID);
    }


    return <div id='customPanel'>                
        {Object.keys(props.times).map((choice, index) => 
            (<div className='customTimeSlot'><h4>{choice}</h4><CalendarTile className="calendarTile" key = {choice} 
            avail={Object.keys(props.times[choice]).length - 1 /* -1 to remove default */ }
            userTotal={props.numUsers}/>
                <div id="calendarTileNames" className='hidden'>
                        <div  className='hidden' id="preferenceInput">
                            {/* Creates a radio button with custom attributes for passing */}
                            <input type="radio" id={"great+" + choice}  name={"preference-" + choice} target_custom={choice} onChange={changeCustomTime} value="3" />
                            <label for={"great+" + choice}>Great</label><br />
                            <input type="radio" id={"good+" + choice}  name={"preference-" + choice} target_custom={choice} onChange={changeCustomTime} value="2" />
                            <label for={"good+" + choice}>Good</label><br />
                            <input type="radio" id={"poor+" + choice}  name={"preference-" + choice} target_custom={choice} onChange={changeCustomTime} value="1" />
                            <label for={"poor+" + choice}>Poor</label><br />
                            <input type="radio" id={"unavailable+" + choice}  name={"preference-" + choice} target_custom={choice} onChange={changeCustomTime} value="0" />
                            <label for={"unavailable+" + choice}>Unavailable</label>

                        </div>
                 </div>
            </div>))} 
        </div>

}

export default CustomPanel