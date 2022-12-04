
import './App.css';

import React from 'react';
import {BrowserRouter as Router, Route, Link, Routes, NavLink} from 'react-router-dom';

import Home from './pages/Home';
import Chat from './pages/Chat';
import User from './pages/User';
import SideBar from './components/SideBar';

function App() {
  return (
    <>
      <Router>
        <div >
          <header className='App-header'>
            <div className='App'>
              <h1 className='App-title'>
                Welcome to Project Titan
              </h1>
            </div>
              <SideBar />
          </header>
          <br />
          <br />
          <div className='App-body'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/user/:id' element={<User />} />
              <Route path='/chat/:id' element={<Chat />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
