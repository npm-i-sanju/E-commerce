import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'


function Login() {

    const navigate = useNavigate()
    const [msg, setMsg] = useState()
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const handleChange = async (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post("/login", form)
            // save token to localStorage
            localStorage.setItem("token", response.data.token)
            setMsg(response.data.msg || "Login successful!")
        } catch (error) {
            setMsg(error.response?.data?.msg || "An error occurred during login. Please try again.")
        }

    }

    return (
       <div className="flex items-center justify-center min-h-screen bg-slate-100">
      {/* ✅ Card wraps BOTH the heading AND the form */}
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-sm">
 
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>
 
        {/* Error message */}
        {msg && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {msg}
          </div>
        )}
 
        {/* ✅ Form is INSIDE the card */}
        <form onSubmit={handleSubmit} className="space-y-4">
 
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800
                         placeholder:text-slate-400 bg-slate-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition duration-150"
            />
          </div>
 
          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800
                         placeholder:text-slate-400 bg-slate-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition duration-150"
            />
          </div>
 
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                       text-white font-semibold py-2.5 rounded-lg text-sm
                       transition duration-150 mt-2 shadow-sm shadow-blue-200"
          >
            Log In
          </button>
        </form>
 
        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Sign up</a>
        </p>
 
      </div>
    </div>
    )
}

export default Login
