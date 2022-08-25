// Packages 
import React, { Component } from 'react';
import {useParams} from "react-router-dom";
import {GoogleLogin, GoogleLogout} from 'react-google-login';

// Components 
import Banner from './components/banner.js';


function LoginScreen(){
    // Reads the url to get the roomID 
    const { roomID } = useParams();

    // Handles a successfull login from the google account service
     const loginSuccess = (res) => {
      //console.log('login success from:' , res.profileObj)
      
      //Update local storage to have google id and google name
      var profile = res.profileObj;
      localStorage.setItem('Name', profile.name);
      localStorage.setItem('ID', res.googleId);

      //Redirect to room after having logged in 
      window.location = "/room/" + roomID;
     }
  
    // Handles a failed login from the google account service by console logging 
    const loginFailure = (res) => {
      console.log('login failure:' , res)
     }

      return (
        
        <div className="LoginRedirect">
          <Banner></Banner>
            <h1>Login Before going to room</h1> 
        
            <GoogleLogin
              clientId=ClientID
              buttonText="Log in with Google"
              onSuccess={loginSuccess}
              onFailure={loginFailure}
              cookiePolicy={'single_host_origin'}
            />  

        </div>

      );
}

export default LoginScreen;