import React from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar  from './sidebar/sidebar';
import { Editor } from './editor/editor';

function App() {
  return (
    <div className="App">
      <div className='memorymap-wrapper'>
        <div className='sidebar'><Sidebar /></div>
        <div className='editor'><Editor /></div>
      </div>
    </div>
  );
}

export default App;
