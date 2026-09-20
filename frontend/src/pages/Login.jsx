import { useState } from 'react'
import axios from 'axios'

function Login({ setPage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    // Email validation
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    // Password validation
    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/login',
        {
          email: email.trim().toLowerCase(),
          password: password,
        }
      )

      // Store JWT token
      localStorage.setItem(
        'access_token',
        response.data.access_token
      )

      // Store user information
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      )

      // Start from Dashboard after login
      localStorage.setItem(
        'activePage',
        'dashboard'
      )

      // Navigate to Dashboard
      setPage('dashboard')

    } catch (error) {
      console.error('Login error:', error)

      setError(
        error.response?.data?.detail ||
        'Login failed. Please check your email and password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-2">
          E-Commerce Analytics
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Login to your account
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <label className="block mb-2 font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg p-3 mb-5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Password */}
          <label className="block mb-2 font-medium text-gray-700">
            Password
          </label>

          <div className="relative mb-6">

            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg p-3 pr-20 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Show / Hide Button */}
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold text-white transition ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading
              ? 'Logging in...'
              : 'Login'}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}

          <button
            type="button"
            onClick={() => {
              setError('')
              setPage('register')
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </button>
        </p>

      </div>

    </div>
  )
}

export default Login