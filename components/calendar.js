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
async function updateTimes(value, day, time, avail, roomID){
    //Day is passed after correction. 
    try{

        let id = localStorage.getItem("ID");
        
        //If the value is not available remove it from DB otherwise update
        if(value == 0){
           delete avail[day][time][id]; 
        }
        else{
            avail[day][time][id] = value;
        }

        api.put("/putRoom/" + roomID, avail)

          
          
    }
    catch(err){
        console.log(err);
    }
}

/* Props
    avail = from DB availabilty array
    user = from DB list of all users
    col = from DB days 
    row = from DB times
    userTable = from DB user lookup table
    roomID = from DB id of room
*/

/* Draws the calendar using informations */

const Calendar = (props) => {
    
    //Processes attribute data for updating
    async function changeTimes(e){
        updateTimes(parseInt(e.target.value), parseInt(e.target.attributes.day_input.value), parseInt(e.target.attributes.time_input.value), props.avail, props.roomID)
    }
    
    //Checks if props have loaded
    if(typeof(props) != "undefined"){
        let days = ["Times"].concat(props.col);
    }
    else{
        let days = ["Times"];
    }

        return <div id='calendar'>                
            <div id='days'>
                {["Times"].concat(props.col).map((day, dayIndex) => (<div className="calendarColumn" key={day}>
                <div className="dayNumber">{day}</div>
                <div className='times'>
                    {day == "Times" ? 
                    props.row.map((time, index) => (<div className="timeIndexParentDiv"><div key={time + "," + index} className="time" >{time}</div></div>)) :
                    props.row.map((time, timeIndex) => (props.avail[0] && props.userTable ? 
                        <div className='calendarTileParentDiv'>
                            <CalendarTile className="calendarTile" key = {dayIndex + "," + timeIndex} avail={Object.keys(props.avail[dayIndex-1][timeIndex]).length} userTotal={props.users.length} />
                            <div id="calendarTileNames" className='hidden'>
                                    <div  className='hidden' id="preferenceInput">
                                        {/* Creates a radio button with custom attributes for passing */}
                                        <input type="radio" id={"great" + parseInt(dayIndex-1) + "," + timeIndex}  day_input={dayIndex-1} time_input={timeIndex} name={"preference-" + String(dayIndex-1) + "," + timeIndex} onChange={changeTimes} value="3" />
                                        <label for={"great" + parseInt(dayIndex-1) + "," + timeIndex}>Great</label><br />
                                        <input type="radio" id={"good" + parseInt(dayIndex-1) + "," + timeIndex} day_input={dayIndex-1} time_input={timeIndex} name={"preference-" + String(dayIndex-1) + "," + timeIndex} onChange={changeTimes} value="2" />
                                        <label for={"good" + parseInt(dayIndex-1) + "," + timeIndex}>Good</label><br />
                                        <input type="radio" id={"poor" + parseInt(dayIndex-1) + "," + timeIndex} day_input={dayIndex-1} time_input={timeIndex} name={"preference-" + String(dayIndex-1) + "," + timeIndex} onChange={changeTimes} value="1" />
                                        <label for={"poor" + parseInt(dayIndex-1) + "," + timeIndex}>Poor</label><br />
                                        <input type="radio" id={"unavailable" + parseInt(dayIndex-1) + "," + timeIndex} day_input={dayIndex-1} time_input={timeIndex} name={"preference-" + String(dayIndex-1) + "," + timeIndex} onChange={changeTimes} value="0" />
                                        <label for={"unavailable" + parseInt(dayIndex-1) + "," + timeIndex}>Unavailable</label>

                                    </div>
                            </div>
                        </div>
                        :<CalendarTile key = {dayIndex + "," + timeIndex}  avail={0} userTotal={props.users.length}/>
                                        ))} 
                    
                    
                </div>
                </div>
                ))}
            </div>
            </div>
    }

//}


export default Calendar