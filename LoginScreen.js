//Packages
import React, { Component } from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';

//Components 
import Banner from './components/banner.js';
import logo from './logo.png';


function LoginScreen(){
    document.title = "Schedule Bot";

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
  
      return (
        
        <div className="App"> 
        <Banner></Banner>
        <p>Welcome to schedulebot. let us help you find the best possible time :)</p>
          {/*<h1 className="gridHeader">Welcome to Schedule Bot</h1>
          {/*The class names allow for specific grid placement by the row
            <div className='circleInstruct row2'>1</div><div className="textInstruct row2">Sign in</div><br />
            <div className='circleInstruct row3'>2</div><div className="textInstruct row3">Create or join a room</div><br />
            <div className='circleInstruct row4'>3</div><div className="textInstruct row4">Have guests fill out their availability</div><br />
            <div className='circleInstruct row5'>4</div><div className="textInstruct row5">The host sets guest priority</div><br />
            <div className='circleInstruct row6'>5</div><div className="textInstruct row6">Get recommended times for your event</div><br />
          */}
        </div>
      );
}

export default LoginScreen;