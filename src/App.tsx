import React from 'react';
import logo from './logo.svg';
import './App.css';
import Switcher from './components/Switcher.js';
import Sidebar  from './sidebar/sidebar';
import { Editor } from './editor/editor';

function App() {
  return (
    <div className="App">
      <div className='memorymap-wrapper'>
        <Switcher />
        <div className='sidebar'><Sidebar /></div>
        <div className='editor'><Editor /></div>
      </div>
    </div>
  );
}

export default App;
