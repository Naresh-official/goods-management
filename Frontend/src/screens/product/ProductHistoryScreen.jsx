"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import LoadingIndicator from "../../components/LoadingIndicator"
import ShowErrorMessage from "../../components/ShowErrorMessage"
import { useParams } from "react-router-dom"
import { SERVER_URL } from "../../router"

function ProductHistoryScreen() {
  const params = useParams()
  const [isLoading, setLoading] = useState(true)
  const [productData, setData] = useState(null)
  const [isError, setError] = useState("")

  useEffect(() => {
    getDataFromApi()
  }, [])

  async function getDataFromApi() {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/v1/products/${params.id}/history`)
      setData(data)
    } catch (e) {
      console.log(e)
      setError(e)
    } finally {
      setLoading(false)
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

  if (isError) {
    return (
      <div className="min-h-full bg-slate-50">
        <div className="px-8 py-6">
          <ShowErrorMessage>
            <span className="underline cursor-pointer" onClick={getDataFromApi}>
              Click to reload
            </span>
          </ShowErrorMessage>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Product History</h1>
          <p className="text-slate-600">Complete timeline and details for this product</p>
        </div>

        {/* Product Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Product Information</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Used By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Warranty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Manufacturer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{productData.title}</div>
                      <div className="text-sm text-slate-500 line-clamp-1">{productData.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 font-mono">
                      {productData.serialNo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 capitalize">{productData.user}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-1">
                      {productData.isPart && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Part
                        </span>
                      )}
                      {productData.rackMountable && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Rack
                        </span>
                      )}
                      {!productData.isPart && !productData.rackMountable && (
                        <span className="text-sm text-slate-500">Standard</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{productData.dateOfPurchase.split("T")[0]}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{productData.model}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{productData.warrantyMonths} months</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{productData.manufacturer.name}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* History Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Product History Timeline</h2>
            <p className="text-sm text-slate-600 mt-1">Track all changes and movements</p>
          </div>
          <HistoryTable historyInformation={productData?.history} />
        </div>
      </div>
    </div>
  )
}

const HistoryTable = ({ historyInformation }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {historyInformation.map((history, index) => (
            <tr key={history._id} className="hover:bg-slate-50 transition-colors duration-150">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-900">{history.location.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-slate-600">{history.location.description}</div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {history.status.map((status, statusIndex) => (
                    <span
                      key={statusIndex}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                    >
                      {status.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {history.status.map((status, statusIndex) => (
                    <div key={statusIndex} className="text-sm text-slate-600">
                      {new Date(status.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductHistoryScreen
