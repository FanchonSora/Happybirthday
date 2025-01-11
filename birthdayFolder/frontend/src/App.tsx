import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BirthdayGreeting from './components/BirthdayGreeting';
import BirthdayCard from './components/BirthdayCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BirthdayCard />} />
        <Route path="/greeting" element={<BirthdayGreeting />} />
      </Routes>
    </Router>
  );
}

export default App;
