import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  addUser,
} from '../Services/userServices';

import { Toaster } from 'react-hot-toast';
const Register = () => {
  const [RegformData, setRegformData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: 0,
    address: '',
    orders: []
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
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
      toast.error('Full name should only contain letters and spaces');
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    var validation = validateFullName(RegformData.fullName) && validateEmail(RegformData.email) && validatePassword(RegformData.password);

    if (RegformData.password !== RegformData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    let newUser;
    if (validation === true) {
      newUser = await addUser(RegformData)
    }
    localStorage.setItem('ID', newUser.id);
    toast.success('Registration successful!');
    navigate("/welcome")
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 ">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl mb-4 shadow-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m0 0h7m-7 0H5m7-7a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-600">Join us and start your journey today</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={RegformData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={RegformData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={RegformData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 pr-12"
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors duration-300"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5s8.573 3.007 9.963 7.178c.07.207.07.431 0 .639C20.573 16.49 16.64 19.5 12 19.5S3.423 16.49 2.036 12.322z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={RegformData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 pr-12"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors duration-300"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5s8.573 3.007 9.963 7.178c.07.207.07.431 0 .639C20.573 16.49 16.64 19.5 12 19.5S3.423 16.49 2.036 12.322z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full py-3 px-4 text-base font-semibold text-teal-600 bg-teal-50 rounded-xl hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
};


export default Register;
