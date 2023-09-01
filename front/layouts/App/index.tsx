import Workspace from '@layouts/Workspace';
import LogIn from '@pages/Login';
import SignUp from '@pages/SignUp';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/workspace/*" element={<Workspace />} />
    </Routes>
  );
};

export default App;
