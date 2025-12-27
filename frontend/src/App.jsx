import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Description from './components/description';
import Content from './components/Content';
import Contact from './components/Contact';
import Hackathons from './components/Hackathons';


const App = () => {
  return (
   <Router>
      <div className="min-h-screen w-full">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <About />
              <Description />
              <Content />
              <Contact />
            </>
          } />
          <Route path="/hackathons" element={<Hackathons />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;