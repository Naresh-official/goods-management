"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import ShowSuccessMesasge from "../../components/ShowSuccessMesasge"
import { SERVER_URL } from "../../router"

function AddNewProductScreen() {
  const [isError, setisError] = useState("")
  const [allLocations, setAllLocations] = useState([])
  const [manufacturer, setManufacturer] = useState([])
  const [formData, setFormData] = useState({
    locationId: "",
    status: "not in use",
    title: "",
    description: "",
    serialNo: "",
    rackMountable: false,
    isPart: false,
    manufacturer: "",
    model: "",
    warrantyMonths: "",
    user: "department",
    dateOfPurchase: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === "warrantyMonths") {
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value })
      }
      return
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  useEffect(() => {
    fetchNecessaryData()
  }, [])

  const fetchNecessaryData = async () => {
    try {
      const manufacturersRes = await axios.get(`${SERVER_URL}/api/v1/brands`)
      const locationsRes = await axios.get(`${SERVER_URL}/api/v1/location`)
      setAllLocations(locationsRes.data)
      setManufacturer(manufacturersRes.data)
      if (locationsRes.data.length > 0 && manufacturersRes.data.length > 0) {
        setFormData({
          ...formData,
          manufacturer: manufacturersRes.data[0]._id,
          locationId: locationsRes.data[0]._id,
        })
      }
    } catch (e) {
      setError(e)
      console.log(e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const response = await axios.post(`${SERVER_URL}/api/v1/products`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      setSuccessMessage("Product added successfully")
      setFormData({
        locationId: allLocations[0]?._id || "",
        status: "not in use",
        title: "",
        description: "",
        serialNo: "",
        rackMountable: false,
        isPart: false,
        manufacturer: manufacturer[0]?._id || "",
        model: "",
        warrantyMonths: "",
        user: "department",
        dateOfPurchase: "",
      })
    } catch (error) {
      setError("Failed to add product")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Add New Product</h1>
          <p className="text-slate-600">Create a new product entry in your inventory</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
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

        {successMessage && (
          <div className="mb-6">
            <ShowSuccessMesasge>
              <div className="text-teal-800 font-medium">{successMessage}</div>
            </ShowSuccessMesasge>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Product Information</h2>
            <p className="text-sm text-slate-600 mt-1">Fill in the details for the new product</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Title */}
              <div className="lg:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  placeholder="Enter product title"
                  required
                />
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  placeholder="Enter product description"
                  required
                />
              </div>

              {/* Serial Number */}
              <div>
                <label htmlFor="serialNo" className="block text-sm font-medium text-slate-700 mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  id="serialNo"
                  name="serialNo"
                  value={formData.serialNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 font-mono"
                  placeholder="Enter serial number"
                  required
                />
              </div>

              {/* Model */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-slate-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  placeholder="Enter model"
                  required
                />
              </div>

              {/* Manufacturer */}
              <div>
                <label htmlFor="manufacturer" className="block text-sm font-medium text-slate-700 mb-2">
                  Manufacturer *
                </label>
                <select
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                >
                  {manufacturer.map((man) => (
                    <option key={man._id} value={man._id}>
                      {man.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="locationId" className="block text-sm font-medium text-slate-700 mb-2">
                  Location / Sector *
                </label>
                <select
                  id="locationId"
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                >
                  {allLocations.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warranty Months */}
              <div>
                <label htmlFor="warrantyMonths" className="block text-sm font-medium text-slate-700 mb-2">
                  Warranty (Months) *
                </label>
                <input
                  type="text"
                  id="warrantyMonths"
                  name="warrantyMonths"
                  value={formData.warrantyMonths}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  placeholder="Enter warranty period"
                  required
                />
              </div>

              {/* Purchase Date */}
              <div>
                <label htmlFor="dateOfPurchase" className="block text-sm font-medium text-slate-700 mb-2">
                  Date of Purchase *
                </label>
                <input
                  type="datetime-local"
                  id="dateOfPurchase"
                  name="dateOfPurchase"
                  value={formData.dateOfPurchase}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                />
              </div>

              {/* User */}
              <div>
                <label htmlFor="user" className="block text-sm font-medium text-slate-700 mb-2">
                  Assigned User *
                </label>
                <select
                  id="user"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                >
                  <option value="department">Department</option>
                  <option value="admin">Admin</option>
                  <option value="normal user">Normal User</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                >
                  <option value="repair">Repair</option>
                  <option value="not in use">Not In Use</option>
                  <option value="in use">In Use</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="rackMountable"
                      name="rackMountable"
                      type="checkbox"
                      checked={formData.rackMountable}
                      onChange={handleChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                    />
                    <label htmlFor="rackMountable" className="ml-2 block text-sm text-slate-700">
                      Rack Mountable
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isPart"
                      name="isPart"
                      type="checkbox"
                      checked={formData.isPart}
                      onChange={handleChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                    />
                    <label htmlFor="isPart" className="ml-2 block text-sm text-slate-700">
                      Is Part/Component
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                    Adding Product...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddNewProductScreen
