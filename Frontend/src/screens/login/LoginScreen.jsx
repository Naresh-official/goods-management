"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { SERVER_URL } from "../../router"

function LoginScreen() {
  const [formData, setData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const history = useNavigate()

  function handInputChange(e) {
    setData({ ...formData, [e.target.id]: e.target.value })
    if (error) setError("")
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, status } = await axios.post(`${SERVER_URL}/api/v1/users/login`, formData, {
        withCredentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (status === 201) {
        history("/")
      } else {
        setError("Invalid credentials. Please check your email and password.")
      }
    } catch (error) {
      console.error("Something went wrong:", error)
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Panel - Branding */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-8 md:p-12 text-white flex flex-col justify-center">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Goods Management</h1>
                <p className="text-teal-100 text-lg leading-relaxed">
                  Streamline your inventory management with our powerful and intuitive platform. Track, manage, and
                  optimize your goods with ease.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-teal-300 rounded-full mr-3"></div>
                  <span className="text-teal-100">Real-time inventory tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-teal-300 rounded-full mr-3"></div>
                  <span className="text-teal-100">Advanced analytics and reporting</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-teal-300 rounded-full mr-3"></div>
                  <span className="text-teal-100">Multi-user collaboration</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-teal-500">
                <p className="text-center text-teal-100">
                  Don't have an account?{" "}
                  <Link to="signup" className="text-white font-semibold hover:underline">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="p-8 md:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                  <p className="text-slate-600">Sign in to your account to continue</p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      onChange={handInputChange}
                      type="email"
                      id="email"
                      autoFocus
                      required
                      className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      onChange={handInputChange}
                      id="password"
                      required
                      className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-slate-700">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                  By signing in, you agree to our{" "}
                  <a href="#" className="text-teal-600 hover:text-teal-500">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-teal-600 hover:text-teal-500">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
