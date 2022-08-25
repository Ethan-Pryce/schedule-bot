//Packages
import React from 'react'
import ReactDOM from 'react-dom'
import {GoogleLogin, GoogleLogout} from 'react-google-login';

 // Handles a successfull login from the google account service
 const loginSuccess = (res) => {
    //console.log('login success from:' , res.profileObj)

    //Update local storage to have google id and google name
    var profile = res.profileObj;
    localStorage.setItem('Name', profile.name);
    localStorage.setItem('ID', res.googleId);

    //Reload the page to move to the next page if 
    //the login actually worked. Could also forcefully redirect 
    window.location.reload(false);
   }

   // Handles a failed login from the google account service by console logging 
  const loginFailure = (res) => {
    console.log('login failure:' , res)
  }

  // Delete local storage to logout
function onLogout(){
    window.localStorage.clear()
    window.location.reload(false);
  }

//Links dont allow the underline to be removed for visited, so these helper functions move you pages
function toAbout(){
  window.location.href = '/about';
}

function toRooms(){
  window.location.href = '/rooms';
}



/* Props 
    None
    Used for the top banner */
class Banner extends React.Component {
    render() {
        return <div id='banner'>
            <div className="banner-title"><h1 className='banner-text'>Schedule Bot</h1></div>
            <span className="banner-filler"></span>
            <span className="banner-filler"></span>
            {localStorage.getItem("ID") ? <h1 className='banner-text'><p onClick={toRooms}>Rooms</p></h1> : <span></span>} 
            <h1 className='banner-text'><p onClick={toAbout}>About</p></h1> 
            {localStorage.getItem("ID") ? <GoogleLogout
              clientId="859719169606-udri29lad40cjrnhrabuups4fujaivto.apps.googleusercontent.com"
              buttonText="Log Out with Google"
              onLogoutSuccess={onLogout}
              className = "logOutButton"
            /> : <GoogleLogin
              clientId="859719169606-udri29lad40cjrnhrabuups4fujaivto.apps.googleusercontent.com"
              buttonText="Log in with Google"
              onSuccess={loginSuccess}
              onFailure={loginFailure}
              cookiePolicy={'single_host_origin'}
              className = "logInButton"
            />  }
            </div>


    }

}

export default Banner


