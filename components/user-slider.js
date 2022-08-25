//Packages
import React , { useState, useEffect }  from 'react'
import ReactDOM from 'react-dom'




/*Props
    userID = user id
*/

//A slider that updates the priority of a user
const UserSlider = (props) => {
    const [want, updateWant] = useState(2);


    function setWant(e){
        updateWant(e);

    }

    /* This is a mini component that displays text depending on what props.x is
    props.x is just the state of the slider  input */
    function Preference(props){
        switch (parseInt(props.x)) {
            case 0:
                return(<span>Don't Consider</span>)
            case 1: 
                return(<span>Low Priority</span>)
            case 2:
                return(<span>Average Priority</span>) 
            case 3:
                return(<span>High Priority</span>)
            case 4:
                return(<span>Must Have</span>)
            default:
                return(<span>error</span>)
    
        }
    }

    return <div className="userDiv">  
        <h2 className='userList'>{props.name}</h2>
        <input type="range" min="0" max="4" defaultValue={want} className="slider slider-progress" id={props.userID} onChange={e => setWant(e.target.value)}/> 
        <label id={props.userID + "-slider-value"} style={{display:'block'}}>
        <Preference x={want} />
            </label>
        
        
        </div>
                
        
    }




export default UserSlider