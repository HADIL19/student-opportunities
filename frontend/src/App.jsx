import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Description from './components/description';
import Content from './components/Content';
import Contact from './components/Contact';
import Hackathons from './components/Hackathons';
import Internships from './components/Interships';
import Courses from './components/Courses';
const App = () => {
  return (
   <Router>
      <div className="min-h-screen w-full">
       
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <About />
              <Description />
              <Content />
              <Contact />
            </>
          } />
          
          <Route path="/hackathons" element={<Hackathons />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/courses" element={<Courses />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;