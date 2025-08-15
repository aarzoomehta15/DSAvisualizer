import React from 'react';
import { useState } from 'react';
import StartPage from './components/StartPage.jsx';
import SortingVisualizer from './components/SortingVisualizer.jsx';
import SearchingVisualizer from './components/SearchingVisualizer.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
  return(
    <div className='bg-visual-bg-dark text-text-light min-h-screen flex flex-col items-center justify-center p-4'>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/sorting" element={<SortingVisualizer />} />
        <Route path="/searching" element={<SearchingVisualizer />} />
      </Routes>
    </div>
  )
}

export default App