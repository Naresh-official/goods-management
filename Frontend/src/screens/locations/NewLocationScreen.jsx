"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import ShowSuccessMesasge from "../../components/ShowSuccessMesasge";
import axios from "axios";
import { SERVER_URL } from "../../router";

function NewLocationScreen() {
	const [success, setSuccess] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [data, setData] = useState({});
	const [isError, setError] = useState("");

	function onchangeHandler(e) {
		e.preventDefault();
		const name = e.target.name;
		const value = e.target.value;

		setData({ ...data, [name]: value });
	}

	async function handleUpdate(e) {
		e.preventDefault();
		try {
			setError("");
			setUploading(true);

			await axios.post(`${SERVER_URL}/api/v1/location/`, data, {
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
				},
			});
			setSuccess(true);
			setData({ name: "", description: "" });
		} catch (e) {
			setError("Failed to create location");
			console.log(e);
		} finally {
			setUploading(false);
		}
	}

	return (
		<div className="min-h-full bg-slate-50">
			<div className="px-8 py-6">
				{/* Header Section */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-slate-800 mb-2">
						Add New Location
					</h1>
					<p className="text-slate-600">
						Create a new location or sector for your inventory
					</p>
				</div>

				{/* Alert Messages */}
				{isError && (
					<div className="mb-6">
						<ShowErrorMessage>
							<span className="font-medium">{isError}</span>
						</ShowErrorMessage>
					</div>
				)}

				{success && (
					<div className="mb-6">
						<ShowSuccessMesasge>
							<div className="text-center">
								<p className="font-medium mb-2">
									Location created successfully!
								</p>
								<Link
									className="text-teal-700 hover:text-teal-800 underline"
									to="/locations"
								>
									View all locations
								</Link>
							</div>
						</ShowSuccessMesasge>
					</div>
				)}

				{/* Form Section */}
				<div className="max-w-2xl mx-auto">
					<div className="bg-white rounded-xl shadow-sm border border-slate-200">
						<div className="px-6 py-4 border-b border-slate-200">
							<h2 className="text-lg font-semibold text-slate-800">
								Location Details
							</h2>
							<p className="text-sm text-slate-600 mt-1">
								Enter the information for the new location
							</p>
						</div>

						<form
							onChange={onchangeHandler}
							onSubmit={handleUpdate}
							className="p-6"
						>
							<div className="space-y-6">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-slate-700 mb-2"
									>
										Location Name *
									</label>
									<input
										type="text"
										name="name"
										id="name"
										value={data.name || ""}
										required
										className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
										placeholder="Enter location name"
									/>
								</div>

								<div>
									<label
										htmlFor="desc"
										className="block text-sm font-medium text-slate-700 mb-2"
									>
										Description *
									</label>
									<textarea
										name="description"
										id="desc"
										rows={4}
										value={data.description || ""}
										required
										className="w-full px-3 resize-none py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
										placeholder="Enter location description"
									/>
								</div>
							</div>

							<div className="mt-8 flex justify-end space-x-3">
								<Link
									to="/locations"
									className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200"
								>
									Cancel
								</Link>
								<button
									disabled={uploading}
									type="submit"
									className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
								>
									{uploading ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
											Creating...
										</>
									) : (
										"Create Location"
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NewLocationScreen;
