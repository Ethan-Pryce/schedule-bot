// Packages 
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';

// Components and styling 
import './index.css';
import App from './App';
import LoginScreen from './LoginScreen';
import LoginRedirect from './LoginRedirect';
import RoomScreen from './RoomScreen';
import AboutScreen from './AboutScreen';
/* Highest level of the program, sets up the roots and adds in the component
  depnding on the url. */ 


const directory = (
  /* Router with the roots for different outcomes. */ 
  <Router>
    <Routes>
      <Route exact={true} path="/" element={localStorage.getItem("ID") ? <RoomScreen/> : <LoginScreen />}/>
      <Route path="/select" element={<RoomScreen/>}/>
      <Route exact={true} path="/room/:roomID" element={<App/>}/>
      <Route exact={true} path="/loginRedirect/:roomID" element={<LoginRedirect />}/>
      <Route path="/about" element={<AboutScreen/>}/>
      <Route path="*" element={localStorage.getItem("ID") ? <RoomScreen/> : <LoginScreen />}/>
    </Routes>
  </Router>

);

ReactDOM.render(directory, document.getElementById('root'));


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
