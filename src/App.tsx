import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NameForm from './components/NameForm';
import BirthdayCard from './components/BirthdayCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NameForm />} />
        <Route path="/card" element={<BirthdayCard />} />
      </Routes>
    </Router>
  );
}

export default App;
