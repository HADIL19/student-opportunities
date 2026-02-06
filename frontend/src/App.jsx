import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import About from './components/About.jsx';
import Description from './components/Description.jsx';
import Content from './components/Content.jsx';
import Contact from './components/Contact.jsx';
import Hackathons from './components/Hackathons.jsx';
import Internships from './components/Internships.jsx';
import Courses from './components/Courses.jsx';
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
