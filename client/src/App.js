import React, { useState } from 'react';
import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import './App.scss';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Message from './components/Message/Message';
import Room from './components/Room/Room';

function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);

  return (
    <div className="App">

      <canvas id="canvas">

      </canvas>

      <Router>
        
        <Route exact path='/register'>
          <Register />
        </Route>

        <Route exact path='/login'>
          <Login setCurrentUser={setCurrentUser} />
        </Route>

        {!currentUser ? <Redirect to="/login"/>:
        <>
          <Route exact path='/rooms'>
          <Room setCurrentRoom={setCurrentRoom} />
          </Route>

          <Route exact path='/rooms/:id'>
            <Message currentUser={currentUser} currentRoom={currentRoom} />
          </Route>
        </>}

      </Router>
    </div>
  );
}

export default App;