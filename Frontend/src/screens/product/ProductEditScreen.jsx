"use client"

import { useEffect, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import axios from "axios"
import ShowSuccessMesasge from "../../components/ShowSuccessMesasge"
import LoadingIndicator from "../../components/LoadingIndicator"
import { SERVER_URL } from "../../router"

function ProductEditScreen() {
  const params = useParams()
  const [isLoading, setLoading] = useState(true)
  const [isSubmitting, setSubmitting] = useState(false)
  const [isError, setError] = useState(null)
  const [isSuccess, setSuccess] = useState(false)

  const [allLocations, setAllLocations] = useState([])
  const [manufacturer, setManufacturer] = useState([])

  const [data] = useOutletContext()
  const [formData, setFormData] = useState({
    createdBy: data.user._id,
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

  useEffect(() => {
    getProductInfo()
  }, [params.id])

  const getProductInfo = async () => {
    try {
      setLoading(true)
      const manufacturersRes = await axios.get(`${SERVER_URL}/api/v1/brands`)
      const locationsRes = await axios.get(`${SERVER_URL}/api/v1/location`)
      setAllLocations(locationsRes.data)
      setManufacturer(manufacturersRes.data)

      const { data: productData, status } = await axios.get(`${SERVER_URL}/api/v1/products/${params.id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (status === 200) {
        setFormData({
          ...productData,
          createdBy: data.user._id,
        })
      } else {
        throw new Error(productData.error)
      }
    } catch (error) {
      setError("Error while fetching product information")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: responseData, status } = await axios.put(
        `${SERVER_URL}/api/v1/products/${formData._id}`,
        formData,
        {
          withCredentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (status === 200) {
        setSuccess(true)
      } else {
        throw new Error(responseData.error)
      }
    } catch (e) {
      setError("Error while updating product")
      console.log(e)
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-full bg-slate-50">
        <div className="px-8 py-6">
          <LoadingIndicator />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Edit Product</h1>
          <p className="text-slate-600">Update product information and details</p>
        </div>

        {/* Alert Messages */}
        {isError && (
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
                <p className="text-sm text-red-800">{isError}</p>
              </div>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="mb-6">
            <ShowSuccessMesasge>
              <div className="text-teal-800 font-medium">Product updated successfully!</div>
            </ShowSuccessMesasge>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Product Information</h2>
            <p className="text-sm text-slate-600 mt-1">Update the product details below</p>
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
                  type="number"
                  id="warrantyMonths"
                  name="warrantyMonths"
                  value={formData.warrantyMonths}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
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
                  value={formData.dateOfPurchase.split("Z")[0]}
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
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
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
                    Updating Product...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Update Product
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

export default ProductEditScreen
