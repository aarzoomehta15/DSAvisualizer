import React from 'react';
import './App.css'
import Visualizer from './components/Visualizer';

function App() {

  return (
    <div className='bg-visual-bg-dark text-text-light min-h-screen flex flex-col items-center justify-center p-4'>
      <Visualizer></Visualizer>
    </div>
  )
}

export default App