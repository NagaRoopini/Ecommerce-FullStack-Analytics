import { useState } from 'react'
import axios from 'axios'

function Register({ setPage }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    // Name validation
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    // Email validation
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!emailPattern.test(email.trim())) {
      setError(
        'Please enter a valid email address, e.g. example@gmail.com'
      )
      return
    }

    // Password validation
    if (password.length < 6) {
      setError(
        'Password must contain at least 6 characters'
      )
      return
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      await axios.post(
        'http://127.0.0.1:8000/api/auth/register',
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        }
      )

      // Success message
      setSuccess(
        'Registration successful! Please login.'
      )

      // Clear form
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setShowPassword(false)
      setShowConfirmPassword(false)

    } catch (error) {
      console.error('Registration error:', error)

      setError(
        error.response?.data?.detail ||
        'Registration failed. Please try again.'
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
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Register for E-Commerce Analytics
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded-lg mb-5 text-sm">
            {success}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister}>

          {/* Name */}
          <label className="block mb-2 font-medium text-gray-700">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-lg p-3 mb-5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

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

          <div className="relative mb-5">

            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Create a password"
              className="w-full border border-gray-300 rounded-lg p-3 pr-20 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Show / Hide */}
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

          {/* Confirm Password */}
          <label className="block mb-2 font-medium text-gray-700">
            Confirm Password
          </label>

          <div className="relative mb-6">

            <input
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError('')
              }}
              placeholder="Confirm your password"
              className="w-full border border-gray-300 rounded-lg p-3 pr-20 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Show / Hide */}
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>

          </div>

          {/* Register Button */}
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
              ? 'Creating Account...'
              : 'Register'}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}

          <button
            type="button"
            onClick={() => {
              setError('')
              setSuccess('')
              setPage('login')
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>

      </div>

    </div>
  )
}

export default Register