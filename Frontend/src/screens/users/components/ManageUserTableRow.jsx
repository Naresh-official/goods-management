"use client"

import { useState } from "react"
import axios from "axios"
import { FaUser } from "react-icons/fa"
import { MdSwapHoriz } from "react-icons/md"
import { SERVER_URL } from "../../../router"

function ManageUserTableRow({ user, role }) {
  const [userRole, setUserRole] = useState(user.role)
  const [isLoading, setLoading] = useState(false)

  async function changeRoleAPicall() {
    try {
      setLoading(true)
      await axios.patch(
        `${SERVER_URL}/api/v1/users/chage-role`,
        {
          targetUserId: user._id,
          role: userRole === "user" ? "admin" : "user",
        },
        {
          withCredentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      setUserRole((s) => (s === "admin" ? "user" : "admin"))
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  async function changeRole() {
    await changeRoleAPicall()
  }

  return (
    <tr className="hover:bg-slate-50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-4">
            <FaUser className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{user.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-600">{user.email}</div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            userRole === "admin"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-teal-100 text-teal-800 border border-teal-200"
          } ${isLoading && "animate-pulse"}`}
        >
          {userRole}
        </span>
      </td>

      {role === "admin" && (
        <td className="px-6 py-4">
          <button
            onClick={changeRole}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-3 w-3 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <MdSwapHoriz className="w-3 h-3 mr-1" />
                Change to {userRole === "admin" ? "User" : "Admin"}
              </>
            )}
          </button>
        </td>
      )}
    </tr>
  )
}

export default ManageUserTableRow
