import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
const Register = () => {
  const [RegformData, setRegformData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone:0,
    address:'',
    orders:[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate=useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegformData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFullName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      toast.error('Full name must be at least 2 characters long');
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      toast.error('Full name should only contain letters and spaces') ;
      return false;

    }
    return true;
  };


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };


  const validatePassword = (password) => {
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!/[a-zA-Z]/.test(password)) {
      toast.error('Password must contain at least one letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error('Password must contain at least one number');
      return false;
    }
    return true;
  };



const handleSubmit = (e) => {
  e.preventDefault();
  var validation = validateFullName(RegformData.fullName) && validateEmail(RegformData.email) && validatePassword(RegformData.password);
  
  if (RegformData.password !== RegformData.confirmPassword) {
    toast.error('Passwords do not match.');
    return;
  }
  
  if (validation === true) {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    const newId = existingUsers.length + 1;
    
    const newUser = {
      id: newId,
      ...RegformData
    };
    
    existingUsers.push(newUser);
    
    localStorage.setItem('users', JSON.stringify(existingUsers));
    localStorage.setItem('currentUser',newId);
    toast.success('Registration successful!');
    navigate("/welcome")
  }
};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-[#4A3C31] mb-6">Create Account</h2>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#4A3C31] mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={RegformData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none 
                           focus:ring-2 focus:ring-[#1A9D8F] focus:border-transparent transition-colors duration-300"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4A3C31] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={RegformData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none 
                           focus:ring-2 focus:ring-[#1A9D8F] focus:border-transparent transition-colors duration-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#4A3C31] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={RegformData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none 
                             focus:ring-2 focus:ring-[#1A9D8F] focus:border-transparent transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1A9D8F] transition-colors duration-300"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#4A3C31] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={RegformData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none 
                             focus:ring-2 focus:ring-[#1A9D8F] focus:border-transparent transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1A9D8F] transition-colors duration-300"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium border border-[#1A9D8F] rounded-md 
                text-white bg-[#1A9D8F] 
                hover:bg-white hover:text-[#1A9D8F] 
                focus:outline-none focus:ring-2 focus:ring-[#1A9D8F] 
                focus:bg-white focus:text-[#1A9D8F]
                transition-colors duration-300"
            >
              Register
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-[#4A3C31]">
              Already have an account?{' '}
              <div onClick={()=>{Navigate("/")}} className="text-[#1A9D8F] hover:underline font-medium transition-colors duration-300">
                Login
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
