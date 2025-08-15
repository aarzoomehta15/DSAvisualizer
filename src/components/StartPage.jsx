import React from 'react'
import {Link} from 'react-router-dom'

const StartPage = () => {
  return (
    <div>
      <h1 className = 'text-5xl font-extrabold text-custom-primary mb-12 text-center'
      >DSA Visualizer</h1>

      <p className = 'text-xl text-text-light mb-10 text-center max-w-2xl'>Explore and understand DSA through visualizations. Choose a section below to begin with!!</p>

      <div className="flex flex-col md:flex-row gap-8">
  
        <Link
          to="/sorting" 
          className="bg-custom-accent hover:bg-custom-secondary text-visual-bg-dark font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-2xl"
        >
          Sorting Algorithms
        </Link>

        <Link
          to="/searching" 
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-2xl"
        >
          Searching Algorithms
        </Link>
      </div>
    </div>
  )
}

export default StartPage
