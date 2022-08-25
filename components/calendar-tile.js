//Packages
import React , { useState, useEffect }  from 'react'

/* Props
    avail = the total number of users avaialable at this time slot
    userTotal = total users in the room
*/

/*A simple component that does nothing but display color based on percentage
of people available for a time */ 

// As such we need to pass it way less stuff, fix in refactor
const CalendarTile = (props) => {
    const [availUsers, setAvailUser] = useState(props.avail);
    
    useEffect(() => {setAvailUser(props.avail)}, [props.avail]);

    return <div className="calendarTile slot"> 
        {/*First option calculates the transparency, second options  just sets it to transparent*/}
        {availUsers ? <div className="userMarker"  title="See available guests" style={{backgroundColor: 'rgba(0, 153,77,' + (availUsers/props.userTotal) + ')' }}>&nbsp;</div>
        : <div className="userMarker" style={{backgroundColor: 'rgba(0, 0, 0, 0)'}}>&nbsp;</div> }
        
        </div> 
        
    }




export default CalendarTile