// Packages
import React, {useEffect, useState, useCallback} from 'react';
import {useParams} from "react-router-dom";
import axios from 'axios';

// Components
import './App.css';
import Banner from './components/banner.js';
import Calendar from './components/calendar.js';
import UserPanel from './components/user-panel.js';
import NamePanel from './components/name-panel.js';
import CustomPanel from './components/custom-panel.js';
import SettingPanel from './components/setting-panel.js';

//Google Acounts Script
<script src="https://accounts.google.com/gsi/client" async defer></script>

/* Connection to axios. multiple url is just for testing purposes. 
  Switch Url to test local vs using heroku. */

var url = "http://localhost:5000";
const api = axios.create({
  baseURL: "https://schedule-solver.herokuapp.com",
  //baseURL: "http://localhost:5000",
});

// Deprecated functions left in incase its removal does any damage and 
// they need to restore 
/*
async function getRoomMembers(roomId) {
  try {
    //console.log(roomID);
    const members = await api.get('getRoom/' + roomId);
    //console.log("Am i the error?");
    console.log(members.data[0].users);
    
  }
  catch (err){
    console.log(err);
  }
}

async function getRooms() {
  try {
    const rooms = await api.get('getRooms');
    console.log(rooms);
    
  }
  catch (err){
    console.log(err);
  }
}
*/


// Copies the url of the page to clipboard
function urlToClipboard() {
  navigator.clipboard.writeText(window.location.href)
  var popup = document.getElementById("copyPopup");
  popup.classList.toggle("show");
}

function App(){
  // A series of hooks that hold all the database data that is called in getInfo
  const [names, setNames] = useState();
  const [times, setTimes] = useState();
  const [days, setDays] = useState();
  const [custom, setCustom] = useState();
  const [availability, setAvailability] = useState();
  const [userIDLookup, setUserIDLookup] = useState([""]);
  const [roomName, setRoomName] = useState();
  // Used to validate the user in the room
  const [isOwner, setIsOwner] = useState();
  const [notAddedUser, setNotAddedUser] = useState(true);
  // Reads the url to get the roomID 
  const { roomID } = useParams();

  /*If the user is not signed in but joins a specfic room it sends them to 
    another page to sign in. This is so they canot do any damage. It passes
    the room id  to redirect back to the right room after the user logs in. */

  if(!localStorage.getItem("ID")) {window.location = "/loginRedirect/" + roomID;}
  
  /* A function for checking then adding a user to a room they arent in. 
    All checks are required to be accurate. Checks Inorder
    1) Check if userIDLookup exists and a result has come back for it
    2) User is in the table for the room
    3) This function hasn't already run. (Otherwise the database updates 
      multiple times before responding)  */

  if (userIDLookup[0] != "" && !userIDLookup[localStorage.getItem("ID")] && notAddedUser) {
    try{
      // Stops the function from running twice, do not remove
      setNotAddedUser(false);

      //First we update the user
      //Gets the rooms a user is in, or an empty array if in no rooms
      api.get('getUser/' + localStorage.getItem("ID") ).then(res => {
        if(res.data[0]){
          var roomArr = res.data[0].in_rooms;
        }
        else{
          var roomArr = [];
        }
      //Adds the room to the temporary array of rooms the user is in  
      roomArr.push(roomID);
      //Sends the temporary array of rooms to the database to override
      api.put('/putUser/inRoom/' + localStorage.getItem("ID"), roomArr)
      
      //Second we update the room
      // Grabs the users and userTable from the database
      api.get('getRoom/' + roomID).then(results => {
        // Get the user lookup table data and add the user to it
        var newTable = results.data[0].user_lookup_table;
        newTable[res.data[0].googleID] = res.data[0].name;
        // Get the user list data and add the user to it
        var newUsers = results.data[0].users;
        newUsers.push(res.data[0].name)

        // Prevents it from deleting anything by adding empty data
        if(results.data[0].users){
          //Creates data to override with from the original data
          const addedUser = {
            users: newUsers,
            user_lookup_table: newTable
  
        }
        //Overrides existing data with the 
        api.put('/putUserInRoom/' + roomID, addedUser)

      }

      })
      })
      
  }
    catch (err){
      console.log(err);
    }
    
}


// Likley doing nothing. Preserved for rollback
/*
  const handleForceUpdate = () => {
    this.forceUpdate();
  };
*/ 
 

/* Probably the most important function. Every 3 seconds (3000 ms) the 
useCallBack will update all the hooks with new information. 3 seconds is 
arbitrary and can be changed. 
*/
  const getInfo = useCallback(async () => {
    try {
      //Gets all the room info
      const room = await api.get('getRoom/' + roomID);
      //Sets all the room information
      
      //console.log(room.data[0]);
      setNames(room.data[0].users);
      setRoomName(room.data[0].name);
      document.title = room.data[0].name;
      setTimes(room.data[0].times);
      setDays(room.data[0].days);
      setCustom(room.data[0].custom_times);
      setAvailability(room.data[0].availability);
      setIsOwner(room.data[0].owner_id == localStorage.getItem("ID"));
      setUserIDLookup(room.data[0].user_lookup_table);
    }
    catch (err){
      console.log(err);
    }
  }, []);

  useEffect(() => {
    // Runs the call on the first render
    getInfo();
    
    const interval = setInterval(() => {
      //Runs the call every 3 seconds
      getInfo();
      
    }, 3000);
    return () => clearInterval(interval);
  }, [getInfo]); 

  //Redirects to the room screen
  function backToRoomScreen(){
    window.location = "/";
  }

  //Redirects to loginRedirect component
  function loginDirect(){
    window.location = "/loginRedirect/" + roomID;
  }
  
    return (
      <div className="App">
        <Banner></Banner>
        <div id='header'>
                
            </div>
        {/* The conditionals are required for preventing crashes while the DB loads*/}
      
        
        <div className='boxHighlight'>
        {roomName ? <h2 id="roomName">{roomName}</h2> : null}
        <div id="urlLink" onClick={urlToClipboard}> &#x1F4CB;  Share this room
        <span className='popup' id="copyPopup">URL copied</span>
        </div>

        {names && days && times && availability && userIDLookup ? <Calendar  avail={availability} users={names} col={days} row={times} userTable={userIDLookup} roomID={roomID}></Calendar> : <h1>Calendar is loading</h1>}
        {custom && names && userIDLookup ? <CustomPanel numUsers={names.length} times={custom} userTable={userIDLookup} roomID={roomID}/> : null }
          <div>
        {names && isOwner && userIDLookup ? <h3 className='userpanel-title'>Set guest priority</h3> : <h3 className='namepanel-title'>Guestlist</h3>} 
        {names && isOwner && userIDLookup ? <UserPanel users={names} userTable={userIDLookup}></UserPanel> : names ? <NamePanel users={names}></NamePanel> : null} 
          </div>
        {isOwner ? <SettingPanel avail={availability} times={times} days={days} userTable={userIDLookup} custom={custom} roomID={roomID}></SettingPanel> : null}
      </div>
      </div>
    );//}
}

export default App;
