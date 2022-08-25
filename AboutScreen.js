//Packages
import React, { Component } from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';

//Components 
import Banner from './components/banner.js';
import logo from './logo.png';


function AboutScreen(){
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
        
        <div className="about"> 
        <Banner></Banner>
        <div id="aboutDiv">
        <h2>Thank you for using Schedule Bot</h2>
        <p>Please enjoy letting the bot help find the perfect time for everyone’s schedule.</p>
        <ul>
          <li>Sign in with google</li>
          <li>Create a room with all yours times</li>
          <li>Invite your friends using the URL</li>
          <li>Have everybody say what times are good</li>
          <li>Set priority if required</li>
          <li>Calculate Results</li>
          <li>Have a great hangout</li>
        </ul>
        <p>For questions and inquiries please contact me here: <a href="mailto:schedule.solver@gmail.com">&#128231;</a></p>
        
        </div>
        </div>
      );
}

export default AboutScreen;