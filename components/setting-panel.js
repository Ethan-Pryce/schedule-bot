//Packages
import React , { useState }  from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';

/* Connection to axios. multiple url is just for testing purposes. 
  Switch Url to test local vs using heroku. */
var url = "http://localhost:5000";
const api = axios.create({
  baseURL: "https://schedule-solver.herokuapp.com",
  //baseURL: "http://localhost:5000",
});



/* Props
    avail = table of availability
    times = times
    days = days
    userTable = user lookup table
    custom = object with fields being objects representing custom times
    roomID = the id of the room
*/
/*Panel that actually calculates  results and lets user update the preference for each user*/
const SettingPanel = (props) => {
    const [hours, updateHours] = useState(4);
    const [results, updateResults] = useState(3);
    const [calculation, updateCalculation] = useState([]);
    const [showCalc, updateShowCalc ] = useState(false);

    function resizeCalc(calc){
        let updatedCalc = calc.slice(0, document.getElementById("results-slider").value);
        return updatedCalc;

    }

    async function startDelete(){
        let cont =  window.confirm("Are you sure you want to delete this room?");
        if (cont){
            let owner = localStorage.getItem("ID");
            //console.log(owner);
            let room = props.roomID
            for (const user in props.userTable){
                const userData = await api.get('getUser/' + user);
                //console.log(userData);
                //console.log(userData.data[0]._id);
                console.log(room);
                if(user == owner){
                    //console.log("true");
                    var updatedRooms = userData.data[0].owned_rooms;
                    updatedRooms = updatedRooms.filter((x) => {console.log("x: " + x);return x != room});
                    //console.log("user id is " + "/removeUser/ownsRoom/" + userData.data[0].googleID);
                    api.put('/removeUser/ownsRoom/' + userData.data[0].googleID, {target: room});
                }
                else{
                    var updatedRooms = userData.data[0].in_rooms;
                    updatedRooms = updatedRooms.filter((x) => {return x != room});
                    api.put('/removeUser/inRoom/' + userData.data[0].googleID, {target: room});
                }
            }
            
            api.delete("/deleteRoom/" + room);

            //.then doesnt work for some reason, so we wait a second instead
            setTimeout(function(){
                window.location.href = '/rooms';
            }, 1000);
            
            
        }
     }

    function calculateResults(){
        try {
            var masterList = [];
            var mustHaves = [];
            var customMasterList = [];
            
            // Add all of the must have people to the mustHave array
            Object.keys(props.userTable).forEach((k, index) => {
                if(document.getElementById(k).value == 4){
                    mustHaves.push(k);
                }
            });
            
            // Checks all of the availability times
            for(var x= 0; x < props.avail.length; x++){
                for(var y=0; y< props.avail[0].length; y++){
                    var hasRequired = true;
                    
                   //Check if all required values are included
                    if( Object.keys(props.avail[x][y]).length > 0){
                       if(mustHaves.length > 0){
                           mustHaves.forEach((item, index) => {
                               if(!props.avail[x][y][item] || props.avail[x][y].item == 0)
                               {
                                   hasRequired = false;
                               }
                           });
                       }
                   }
                   else{
                       hasRequired = false;
                }

                    if(hasRequired){
                        var entry = [x,y,props.avail[x][y],0];
                        masterList.push(entry)
                    }

                    }
                }

                // Checks all the custom times
                if(props.custom){
                    let customArr = Object.keys(props.custom);
                    console.log(customArr);
                    for(var i = 0; i < customArr.length; i++){
                        console.log(props.custom[customArr[i]]);
                        var hasRequired = true;

                        // Check if required values are included
                        if(Object.keys(props.custom[customArr[i]]).length > 1){
                            if(mustHaves.length > 0){
                                mustHaves.forEach((item, index) => {
                                    if(!props.custom[customArr[i]][item] || props.custom[customArr[i]][item] == 0)
                                    {
                                        //console.log(props.avail[x][y][item]);
                                        hasRequired = false;
                                    }
                                });
                            }
                        }
                        else{
                            hasRequired = false;
                     }


                     if(hasRequired){
                        var entry = [-1,customArr[i], props.custom[customArr[i]], 0];
                        masterList.push(entry)
                    }

                    }
                }


                // -1 causes the display to throw an lart instead
                if(masterList.length < 1){
                    updateCalculation([-1,])
                }
                else{
                    masterList.forEach((slot, index) => {
                        var total = 0;
                        var preferedPeople = 0;
                        for(var person in slot[2]){
                            
                            // Our formula:
                            // 1.1 for good time
                            // 1 for a normal
                            // 0.8 for a bad time
                            // 3 for a person you like
                            // 1 for a normal person
                            // 0.25 for a person you dont like 
                            // 1 * time preference * person preference 
                                
                            if(person != "default"){
                                var timePref;
                            
                                //get the person's time preference 
                                switch (parseInt(slot[2][person])){
                                    case 3:
                                        timePref = 1.1;
                                        break;
                                    case 2:
                                        timePref = 1;
                                        break;
                                    case 1:
                                        timePref = 0.8;
                                        break;
                                    default:
                                        console.log("error in time pref");
                                        console.log(parseInt(slot[2][person]));
                                }

                                // Get the preference for a person. 
                                var personPref;
                                switch (parseInt(document.getElementById(person).value)){
                                    case 4:
                                        personPref = 3;
                                        preferedPeople++;
                                        break;
                                    case 3:
                                        personPref = 3;
                                        preferedPeople++;
                                        break;
                                    case 2:
                                        personPref = 1;
                                        break;
                                    case 1:
                                        personPref = 0.25;
                                        break;
                                    case 0:
                                        personPref = 0;
                                        break;
                                    default:
                                        console.log("error in person pref");
                                }
                                total +=  1 * timePref * personPref;
                                masterList[index][3] = total;
                        }
                        }

                        // Decrease the value of times that dont have atleast 20% attendance
                        if((preferedPeople / Object.keys(slot[2]).length) < 0.20){
                            masterList[index][3] = masterList[index][3] * 0.6;
                        }
  
                        masterList.sort(function(a, b){return b[3] - a[3];});

                        updateCalculation(masterList)
                       
                    });
                    

        
                    }
                

                if(masterList.length > 0){
                    console.log(masterList)
                    updateShowCalc(true);
                }
                else{
                    alert("No vaild times");
                }
                
            }
            catch(err){
                console.log(err)
            }
        }

        return <div id='settingPanel'>
            <h2>Results</h2>
            <input type="range" min="1" max="9" value={results} className="slider slider-progress" id="results-slider" onChange={e => updateResults(e.target.value)}/>
            <label id="results-slider-value" style={{display:'block'}}>{results}</label>
            
            {showCalc ? <div id="calcButton" onClick={() => updateShowCalc(false)}>Close Results</div> : <div id="calcButton" onClick={calculateResults}>Get Results</div>}
            <div id="deleteButton" onClick={startDelete}>Delete Room</div>
            {showCalc ? 
                <div id="calcDiv">
                    <div className="headerGrid">
                    <h1>Recommended Times</h1>
                    <div id="closeCalcButton" onClick={() => updateShowCalc(false)}>Close Results</div>
                    </div>
                    <div id="resultsFlex">
                    <div id="rotatedLabels">
                    <h3 className='rotatedLabel'>Available</h3>
                    <h3 className='rotatedLabel'>Unavailable</h3>
                    </div>
                    {resizeCalc(calculation).map((answer, index) => (
                        <div className="answer">
                            { answer[0] >= 0 ? 
                            <h4>{ props.days[answer[0]]} - {props.times[answer[1]]}</h4> :
                            <h4>{answer[1]}</h4>
                            }       
                            <div className="coming">{Object.keys(answer[2]).map((answerUser, auIndex) => (answerUser == "default" ? null : <p>{props.userTable[answerUser]}</p>))}</div>
                            <div className="notComing">{Object.keys(props.userTable).map((person) => (!answer[2][person] ? <p>{props.userTable[person]}</p> : null))}</div>
                        </div>

                    ))
                    
                    }
                </div>
                </div>
             : null}
            
            </div>
    

}


export default SettingPanel