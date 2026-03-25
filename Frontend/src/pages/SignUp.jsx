import React, { useState } from 'react';
import api from '../api/axios.js';

function SignUp() {

  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [message, setMessage] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/register", form);
      setMessage(response.data.message || "Sign up successful! Please log in.")

    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred during sign up. Please try again.")
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">

        {/* ✅ Fix 1: "Crete" → "Create", added styling */}
        <h2 className="text-center text-2xl font-bold mb-6">Create Account</h2>

        {message && (
          <div className="mb-4 text-center text-sm text-red-700 font-medium">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none"
          />

          {/* ✅ Fix 2: type="" → type="email" */}
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
