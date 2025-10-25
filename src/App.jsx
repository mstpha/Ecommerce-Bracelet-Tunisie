import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Footer from './Footer';
import Login from './app/Login';
import Register from './app/Register';

function App() {


  return (
    
      <div className="flex flex-col min-h-screen">
        <Toaster />
      
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register/>}/>
          </Routes>
        </main>
        <Footer />

      </div>
  );
}

export default App;