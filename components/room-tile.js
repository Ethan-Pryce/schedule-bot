//Packages
import React , { useState, useEffect }  from 'react'
import axios from 'axios';

/* Connection to axios. multiple url is just for testing purposes. 
  Switch Url to test local vs using heroku. */

var url = "http://localhost:5000";
const api = axios.create({
  baseURL: "https://schedule-solver.herokuapp.com",
  //baseURL: "http://localhost:5000",
});


// Gets the room name with the roomID 
async function getRoomName(roomId) {

    try {
      const members = await api.get('getRoom/' + roomId);
      return members.data[0].name;
    }
    catch (err){
      console.log(err);
    }
  }



/*Props
   id = id of ownened room
*/
const RoomTile = (props) => {
    const [name, setName] = useState();
    const [users, setUsers] = useState();

    // Sets the hooks with the DB info. 
    useEffect(() => {
       async function setRoomValues(){
        try {   
        const members = await api.get('getRoom/' + props.id);
        setName(members.data[0].name);
        setUsers(members.data[0].users);
        }
        catch(err){
            console.log(err);
        }
       } 

       setRoomValues()
    },
    []);

    // Change window to the room with the ID
    function redirectToRoom(){
        window.location = "/room/" + props.id;
    }

    //Animation that isnt getting used i guess 
    /*
    function transitionToRoom(e){
      let chosenOne = e.target.id;
      setTimeout(redirectToRoom,1000); 
      const tiles = document.getElementsByClassName("roomTile");
      for (let i in tiles){
        if (tiles[i].id == chosenOne){
          tiles[i].classList.add("theChosenOne");
        }
        else{
          tiles[i].classList.add("fadeOut");
        }
      }
      
    }
*/

    return <div id={props.id} className="roomTile" onClick={redirectToRoom} style={{cursor:"pointer"}}>
        <h3>{typeof name != "object" ? name : console.log("wtf man")}</h3>
        <div className="roomUserNames">
          {users ? 
          users.map((userName) => (<span>{userName}</span>))
          : null}
        </div>
    </div>
        
    }




export default RoomTile