import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { firestore } from "firebase";
import LogIn from "./logIn/logIn";
import SignUp from "./signUp/signUp";
import Dashboard from "./Dashboard/Dashboard";

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyDfJ-eylyERITklPZYwCvkmWGTXwldCuRc",
  authDomain: "chat-app-7a3ee.firebaseapp.com",
  databaseURL: "https://chat-app-7a3ee.firebaseio.com",
  projectId: "chat-app-7a3ee",
  storageBucket: "chat-app-7a3ee.appspot.com",
  messagingSenderId: "99779396457",
  appId: "1:99779396457:web:e9720e0726d127d8",
});

const routing = (
  <Router>
    <div id='routing-container'>
      <Route exact path='/' component={LogIn}></Route>
      <Route path='/login' component={LogIn}></Route>
      <Route path='/signup' component={SignUp}></Route>
      <Route path='/Dashboard' component={Dashboard}></Route>
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
