// Packages
import axios from 'axios';
import React, {useEffect, useState, useCallback} from 'react';
import { GoogleLogout} from 'react-google-login';

// Components
import Banner from './components/banner.js';
import RoomTile from './components/room-tile.js';

/* Connection to axios. multiple url is just for testing purposes. 
  Switch Url to test local vs using heroku. */
  var url = "http://localhost:5000";
  const api = axios.create({
    baseURL: "https://schedule-solver.herokuapp.com",
    //baseURL: "http://localhost:5000",
  });
  

// Delete local storage to logout
function onLogout(){
  window.localStorage.clear()
  window.location.reload(false);
}

/* Returns true if the member exists , otherwise adds the profile
and returns false */
async function checkProfile(googleID) {
  try {
    let user = await api.get('getUser/' + googleID);
    if(typeof user.data[0] != "undefined"){
      return true;
    }
    else{
      addAccount(localStorage.getItem("ID"), localStorage.getItem("Name"))
      return false; 
    }
  }
  catch (err){
    console.log(err);
  }
 }

// Adds a user account
function addAccount(id, name) {
  // Try to create a new user with the data we have and then post it 
  try {
    const data = {
        googleID: id,
        name: name,
        owned_rooms: [],
        in_rooms: []
    }
    api.post('/addUser', data);
  }
  catch (err){
    console.log(err);
  }
 }


// Makes an api call to get the room name
async function getRoomName(roomId) {
  try {
    const members = await api.get('getRoom/' + roomId);
    return members.data[0].name;
    
  }
  catch (err){
    console.log(err);
  }
}

// Deprecated, kept for rollback purposes
/*
async function updateUserRooms(user, roomID, owned){
  try {
    //console.log(roomID);
    if(owned){
      let updatedRooms = user.owned_rooms.push(roomID);
      await api.put('putUser/ownsRoom', updatedRooms);
    }
    else{
      let updatedRooms = user.in_rooms.push(roomID);
       api.put('putUser/inRoom', updatedRooms);
    }
    //console.log("Am i the error?");
  }
  catch (err){
    console.log(err);
  }

}
*/

 
function RoomScreen(){
  // A series of hooks that holds room screen info
  var userExists =  checkProfile(localStorage.getItem("ID"));
  const [ownedRooms, setOwnedRooms] = useState([]);
  const [inRooms, setInRooms] = useState([]);
  const [currentUser, setUser] = useState();
  const [roomName, setRoomName] = useState();
  const [col, setCol] = useState([0]);
  const [row, setRow] = useState([0]);
  //Whether or not you display the form
  const [toggleForm, setToggleForm] = useState(false);
  const [customCount, setCustom] = useState([]);

  //Api get call for user
  const getUser = useCallback(async () => {
    let user = await api.get('getUser/' + localStorage.getItem("ID"));
    setUser(user.data[0])

  }, []) 

  //Gets both owned and in rooms and adds them to the respective hooks
  const getRoomNames = useCallback(async () => {
    //Creates empty arrays then fills them with the user data, then updates hooks
    var ownedArr = [];
    var inArr = [];
    let user = await api.get('getUser/' + localStorage.getItem("ID"));
    var roomHolder = user.data[0];
    roomHolder.owned_rooms.forEach(room => ownedArr.push(getRoomName(room)));
    roomHolder.in_rooms.forEach(room => inArr.push(getRoomName(room)));
    setOwnedRooms(ownedArr);
    setInRooms(inArr);
  }, []) 
  
  useEffect(() => {
    // runs the call on the first render
    getUser();
    getRoomNames();
    document.title = "Schedule Bot";
    //console.log(" we ran use effect")
    // runs the call every 5 seconds
    const interval = setInterval(() => {
      getUser();
      getRoomNames();
      //handleForceUpdate();
      //console.log(" we ran set interval")
    }, 20000);
    return () => clearInterval(interval);
  }, [getUser]);


  // Changes the room name
  function updateName(e){
    setRoomName(e.target.value);
  }

  // Called by the row/time count to update the rows/times.
  function updateRow(e){
    //This stops a crash related to e not existing? 
    var rows = e.target.value;
    //limited to 24 for the hours in the day.  
    if (rows > 24){
      rows = 24;
    }
    /*Create and empty array and then populates it with garbage 
    to use .map on later */
    let arr = []
    for(let i = 0; i < rows; i++){
      arr.push(i);
    }
    setRow(arr)
  }

  // Called by the column/day count to update the column/days 
  function updateCol(e){
    //This stops a crash related to e not existing? 
    var cols = e.target.value;
    // limited to 14 for sake of calendar sizing / arbitrary
    if (cols > 14){
      cols = 14;
    }
    /*Create and empty array and then populates it with garbage 
    to use .map on later */
    let arr = []
    for(let i = 0; i < cols; i++){
      arr.push(i);
    }
    setCol(arr)
  }

  // Called by the custom count to update the custom stuff
  function updateCustom(e){
    //This stops a crash related to e not existing? 
    var count = e.target.value;
    //Limited to 10 for no good reason
    if (count > 10){
      count = 10;
    }
    /*Create and empty array and then populates it with garbage 
    to use .map on later */
    let arr = []
    for(let i = 0; i < count; i++){
      arr.push(i);
    }
    setCustom(arr)
  }
  
  /* Handles form submission, data is encoded in custom html attributes
    in the target */
  function handleSubmit(e){
    // Prevents page reload 
    e.preventDefault();
    // Shows or hides the form
    setToggleForm(!toggleForm)
    //target[1] is the days and target[2] is the times
    let numDays = parseInt(e.target[1].value);
    let numTimes = parseInt(e.target[2].value);
    
    //Sanatize numbers 
    if (numDays > 14){
      numDays = 14;
    }
    if (numTimes > 24){
      numTimes = 24;
    }

    // There are 3 values before the relevant custom html attributes
    let numberOfValues = 3 + numDays + numTimes;

    let numCustom = parseInt(e.target[numberOfValues].value);

    let dayArr = [];
    let timeArr = [];
    let custom = {};

    // Start at the relevant day data and go for all day values
    for(let j = 3; j < 3 + numDays; j++ ){
        dayArr.push(e.target[j].value)
    }

    // Start at the relevant time data and go for all time values
    for(let t = 3 + numDays; t < numberOfValues; t++ ){
      timeArr.push(e.target[t].value)
    }

    // Start at the relevant cusom data and go for all custom values
    for(let k = numberOfValues + 1 ; k < numberOfValues + numCustom + 1 ; k++ ){
      let title = e.target[k].value;
    /* you need to fill the empty object for mongoDB to accept it. Why? no clue
      this issue is solved by later ignoring default. This probably means that a 
      user with the name "default" would be ignored, this is fixable by changing 
      default to a different more complex string. For ease of demoing this code it
      will be left as "default"*/
      custom[title] = {default: "0"};
    }

  // Putting these values in variables prevents a couple bugs and improves readability
  let lookUpKey = currentUser.googleID;
  let lookUpValue = currentUser.name;
  var userTable = {};
  //Especially this one, it stops a bug related to not reading the object
  userTable[lookUpKey] = lookUpValue;
    try {
      // Creates the data from what the form has and sends it off to the DB
      const data = {
         name: e.target[0].value,
         users: [currentUser.name],
         days: dayArr,
         times: timeArr,
         owner_id: currentUser.googleID,
         availability: new Array(numDays).fill(new Array(numTimes).fill({})),
         //Reminder: you must have a value in an object for mongoDB to work
         custom_times: custom, 
         user_lookup_table: userTable
      }

      //Post the data to the room
      api.post('/addRoom', data).then(res => {
          let gid = currentUser.googleID;
          let roomArr = currentUser.owned_rooms;
          roomArr.push(res.data);
          
         /*Add the user as the owner of the room, important that it is inside the 
         .then as it allows us to get the roomID mongoDB creates*/ 
          api.put('/putUser/ownsRoom/' + gid, roomArr)
      });
    }
    catch (err){
      console.log(err);
    }
  }

      return (
        <div className="App">
          <Banner></Banner>
            <h2 className='greeting'>Welcome {localStorage.getItem("Name")}</h2>

          {/*Creates the form button, the whole conditional just changes the text*/}
          {toggleForm ? <button className='formButton' onClick={() => setToggleForm(!toggleForm)}>Close</button>
          :<button className='formButton' onClick={() => setToggleForm(!toggleForm)}>Make a room</button>}
          
          {toggleForm ? 
          <div className="formDiv">
          <h3>Make a room</h3>
          <form id="roomForm" onSubmit={handleSubmit}>
              <div id="roomFormHeader">
              <label id="eventNameLabel">Event Name: </label>
              <input id="eventName" type="text"  name="roomNameInput" value={roomName} onChange={updateName} required/>
              <label id="numDays">Number of Days:</label>
              <input id="colNumber" type="number" name="colNumber"  min="1" max="14" onChange={updateCol} required/>
              <label id="numTimes">Number of Times:</label>
              <input id="rowNumber" type="number" name="rowNumber"  min="1" max="24" onChange={updateRow} required/>
              </div>
              
              {/*The logic for the days, tims and custom is almost identical with it 
              consisting of some div containers, a header, and a map from n array
              of incrementing numbers*/}
              <div id="formColumnFlex">

                <div className="formColumn">
                <h1 >Days</h1>
                <div className="generatedFlex">
                {/*Maps of the created arrays of simple incrementing numbers. 
                the conditional index+1 < 10 is just for aligning the html*/}  
                {col.map((value, index) => (
                  <div className="option"><span>Option {index +1}:{index+1<10 ? <span>&nbsp;&nbsp;</span> : <span></span>}</span>
                  <input type="text" name={"day+" + value } required/></div>
                ))}
                </div>
                </div>
                
                <div className="formColumn">
                <h1>Times</h1>
                <div className="generatedFlex">
                {row.map((value,index) => (
                  <div className="option">
                    <span>Option {index +1}:{index+1<10 ? <span>&nbsp;&nbsp;</span> : <span></span>} </span>
                    <input type="text" name={"time+" + value } required/></div>
                ))}
                </div>
                </div>

              </div> 
              
              <label id="customTimesLabel" > Custom Times</label>
              <input id="colNumber" type="number" name="colNumber"  min="0" max="10" onChange={updateCustom}/>

              <div className="formCustom">   
              <h1>Custom Times</h1>
              <div className="generatedFlex">
              {customCount.map((value,index) => (
                <div className="option"><span>Option {index +1}:{index+1<10 ? <span>&nbsp;&nbsp;</span> : <span></span>} </span>
                <input type="text" name={"custom+" + index } required/></div>
              ))}
              </div>
              </div>
              <input type="submit" value="Create the room"/>
          </form>
          
          </div>
          : null // The form is in a conditional and this is the other option        
        }
          
          {/*Shows the rooms as a flex holding two mapped out lists of rooms. We check
          values twice because it leads to less issues as one of the values .owned_rooms
          or .in_rooms being empty can do annoying things */}
          <div className='roomFlex'>

          {currentUser && currentUser.owned_rooms? 
          currentUser.owned_rooms.map(
            (oRoom, index) => <RoomTile className="owned_room" key={oRoom} id={oRoom}  /> )
          : null
          }

          {currentUser && currentUser.in_rooms? 
           currentUser.in_rooms.map(
            (iRoom , index) => <RoomTile className="in_room" key={iRoom} id={iRoom} /> )
          : null
          }

          </div>
            <footer>For questions and inquiries please contact me here: <a href="mailto:schedule.solver@gmail.com">&#128231;</a> </footer>
            </div>
      );
  }
  
  export default RoomScreen;