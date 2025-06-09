"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdSearch } from "react-icons/md";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Link, NavLink, useOutletContext } from "react-router-dom";
import { SERVER_URL } from "../../router";

function ProductsScreen() {
	const [isLoading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [products, setProducts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchData();
	}, [currentPage, itemsPerPage, searchTerm]);

	async function fetchData() {
		try {
			const response = await axios.get(`${SERVER_URL}/api/v1/products`, {
				params: {
					page: currentPage,
					itemsperpage: itemsPerPage,
					search: searchTerm,
				},
			});
			setProducts(response.data.data);
			setTotalPages(response.data.pages_count);
			setLoading(false);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	}

	function handlePrevPage() {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	}

	function handleNextPage() {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	}

	return (
		<div className="min-h-full bg-slate-50">
			<div className="px-8 py-6">
				{/* Header Section */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-slate-800 mb-2">
						Products
					</h1>
					<p className="text-slate-600">
						Manage and track all your inventory items
					</p>
				</div>

				{/* Controls Section */}
				<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
					<div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
						<div className="flex flex-col sm:flex-row gap-4 flex-1">
							<div className="relative flex-1 max-w-md">
								<MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
								<input
									type="text"
									className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
									placeholder="Search products..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
								/>
							</div>
						</div>
						<NavLink
							to="new"
							className="inline-flex items-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
						>
							<svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4v16m8-8H4"
								/>
							</svg>
							Create Product
						</NavLink>
					</div>
				</div>

				{/* Table Section */}
				<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200">
							<thead className="bg-slate-50">
								<tr>
									<th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
										Product Details
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
										Serial Number
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
										Used By
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
										Type
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
										Purchase Date
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
										Warranty
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
										History
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-slate-100">
								{isLoading ? (
									<tr>
										<td
											colSpan="8"
											className="px-6 py-12 text-center"
										>
											<LoadingIndicator />
										</td>
									</tr>
								) : (
									products.map((product, idx) => (
										<ProductRow
											key={product._id}
											index={idx}
											product={product}
											itemsPerPage={itemsPerPage}
											currentPage={currentPage}
										/>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<label className="text-sm font-medium text-slate-700">
									Items per page:
								</label>
								<select
									value={itemsPerPage}
									onChange={(e) =>
										setItemsPerPage(e.target.value)
									}
									className="border border-slate-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
								>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
								</select>
							</div>
							<div className="flex items-center space-x-4">
								<button
									onClick={handlePrevPage}
									disabled={currentPage === 1}
									className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
								>
									<IoIosArrowBack className="mr-1" />
									Previous
								</button>
								<span className="text-sm text-slate-700">
									Page{" "}
									<span className="font-medium">
										{currentPage}
									</span>{" "}
									of{" "}
									<span className="font-medium">
										{totalPages}
									</span>
								</span>
								<button
									onClick={handleNextPage}
									disabled={currentPage === totalPages}
									className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
								>
									Next
									<IoIosArrowForward className="ml-1" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ProductRow({ product, index, currentPage, itemsPerPage }) {
	const [_, user] = useOutletContext();
	const canEdit = user._id === product.createdBy;

	return (
		<tr className="hover:bg-slate-50 transition-colors duration-150">
			<td className="px-6 py-4">
				<div className="flex items-center">
					<div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-4">
						<span className="text-sm font-medium text-teal-700">
							{index + 1 + (currentPage - 1) * itemsPerPage}
						</span>
					</div>
					<div>
						<div className="text-sm font-medium text-slate-900">
							{product.title}
						</div>
						<div className="text-sm text-slate-500">
							{product.manufacturer.name}
						</div>
					</div>
				</div>
			</td>
			<td className="px-6 py-4">
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 font-mono">
					{product.serialNo}
				</span>
			</td>
			<td className="px-6 py-4 text-sm text-slate-900 capitalize">
				{product.user}
			</td>
			<td className="px-6 py-4">
				<div className="flex space-x-1">
					{product.isPart ? (
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							Part
						</span>
					) : (
						<></>
					)}
					{product.rackMountable ? (
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
							Rack
						</span>
					) : (
						<></>
					)}
				</div>
			</td>
			<td className="px-6 py-4 text-sm text-slate-900">
				{product.dateOfPurchase.split("T")[0]}
			</td>
			<td className="px-6 py-4">
				<span className="text-sm text-slate-900">
					{product.warrantyMonths} months
				</span>
			</td>
			<td className="px-6 py-4">
				<Link
					to={`history/${product._id}`}
					className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200"
				>
					View History
				</Link>
			</td>
			<td className="px-6 py-4">
				{canEdit ? (
					<NavLink
						to={`edit/${product._id}`}
						className="inline-flex items-center px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-md transition-all duration-200"
					>
						Edit
					</NavLink>
				) : (
					<span className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-md cursor-not-allowed">
						No Access
					</span>
				)}
			</td>
		</tr>
	);
}

export default ProductsScreen;
