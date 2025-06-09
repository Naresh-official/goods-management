"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import { FaUser } from "react-icons/fa";
import { MdLocationOn, MdEdit } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { SERVER_URL } from "../../router";

function LocationsScreen() {
	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState(null);
	const [isError, setError] = useState("");

	useEffect(() => {
		getDataFromApi();
	}, []);

	async function getDataFromApi() {
		try {
			const { data } = await axios.get(`${SERVER_URL}/api/v1/location`);
			setData(data);
		} catch (e) {
			setError(e);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-full bg-slate-50">
			<div className="px-8 py-6">
				{/* Header Section */}
				<div className="mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-3xl font-bold text-slate-800 mb-2">
								Locations
							</h1>
							<p className="text-slate-600">
								Manage all your facility locations and sectors
							</p>
						</div>
						<div className="mt-4 sm:mt-0">
							<Link
								to="new"
								className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
							>
								<MdLocationOn className="w-4 h-4 mr-2" />
								Add New Location
							</Link>
						</div>
					</div>
				</div>

				{/* Content */}
				{isLoading && (
					<div className="flex justify-center py-12">
						<LoadingIndicator />
					</div>
				)}

				{isError && (
					<ShowErrorMessage>
						<span
							className="underline cursor-pointer"
							onClick={getDataFromApi}
						>
							Click to reload
						</span>
					</ShowErrorMessage>
				)}

				{data && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{data.map((location) => (
							<LocationCard key={location._id} data={location} />
						))}
					</div>
				)}

				{data && data.length === 0 && (
					<div className="text-center py-12">
						<MdLocationOn className="w-16 h-16 text-slate-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-slate-700 mb-2">
							No locations found
						</h3>
						<p className="text-slate-500 mb-6">
							Get started by creating your first location
						</p>
						<Link
							to="new"
							className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all duration-200"
						>
							<MdLocationOn className="w-4 h-4 mr-2" />
							Add First Location
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}

function LocationCard({ data }) {
	return (
		<div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden group">
			<div className="p-6">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center">
						<div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
							<MdLocationOn className="w-5 h-5 text-teal-600" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-slate-800 group-hover:text-teal-700 transition-colors duration-200">
								{data.name}
							</h3>
						</div>
					</div>
					<NavLink
						to={`edit/${data._id}`}
						className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-slate-100 rounded-lg"
					>
						<MdEdit className="w-4 h-4 text-slate-500 hover:text-teal-600" />
					</NavLink>
				</div>

				{/* Description */}
				<p className="text-slate-600 text-sm mb-6 line-clamp-2">
					{data.description}
				</p>

				{/* Footer */}
				{(data.editedBy || data.createdBy) && (
					<div className="border-t border-slate-100 pt-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-3">
									<FaUser className="w-3 h-3 text-slate-500" />
								</div>
								<div>
									<p className="text-xs font-medium text-slate-700 line-clamp-1">
										{data.editedBy
											? data.editedBy.name
											: data.createdBy?.name}
									</p>
									<p className="text-xs text-slate-500 line-clamp-1">
										{data.editedBy
											? data.editedBy.email
											: data.createdBy?.email}
									</p>
								</div>
							</div>
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
								{data.editedBy ? "Edited" : "Created"}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default LocationsScreen;
