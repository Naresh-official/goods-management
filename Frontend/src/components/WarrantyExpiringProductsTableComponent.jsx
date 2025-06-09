import { useEffect, useState } from "react";
import EmptyData from "../assets/undraw_empty_re.svg";
import axios from "axios";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../router";

function WarrantyExpiringProductsTablesComponent({ uid }) {
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(null);
	const [inventoryData, setInventoryData] = useState([]);

	useEffect(() => {
		fetchInventory();
	}, []);

	const fetchInventory = async () => {
		try {
			const { data } = await axios.get(
				`${SERVER_URL}/api/v1/analytics/expiring`,
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			setInventoryData(data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching inventory data:", error);
			setError("Error fetching inventory data");
			setLoading(false);
		}
	};

	const calculateMonthsDifference = (date1, date2) => {
		const diffInMs = new Date(date2) - new Date(date1);
		return Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
	};

	return (
		<div className="p-6">
			{isLoading ? (
				<div className="flex justify-center py-12">
					<div className="text-center">
						<div className="w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3"></div>
						<p className="text-slate-500 text-sm">
							Loading warranty data...
						</p>
					</div>
				</div>
			) : isError ? (
				<div className="text-center py-12">
					<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-6 h-6 text-red-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01"
							/>
						</svg>
					</div>
					<p className="text-red-600 font-medium">Error: {isError}</p>
				</div>
			) : inventoryData.length === 0 ? (
				<div className="text-center py-12">
					<img
						src={EmptyData || "/placeholder.svg"}
						alt="No data"
						className="w-48 h-48 mx-auto mb-6 opacity-50"
					/>
					<h3 className="text-lg font-semibold text-slate-700 mb-2">
						No warranty expiring products
					</h3>
					<p className="text-slate-500">
						All products have valid warranties
					</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full">
						<thead>
							<tr className="border-b border-slate-200">
								<th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Product
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Serial Number
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Warranty / Purchase Date
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Status
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{inventoryData.map((item, index) => (
								<tr
									key={index}
									className="hover:bg-slate-50 transition-colors duration-150"
								>
									<td className="px-4 py-4">
										<div className="font-medium text-slate-800">
											{item.title}
										</div>
									</td>
									<td className="px-4 py-4">
										<span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
											{item.serialNo}
										</span>
									</td>
									<td className="px-4 py-4">
										<div className="text-sm">
											<div className="font-medium text-slate-800">
												{item.warrantyMonths} months
											</div>
											<div className="text-slate-500">
												{
													item.dateOfPurchase.split(
														"T"
													)[0]
												}
											</div>
										</div>
									</td>
									<td className="px-4 py-4">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
											{item.history[0].status[0].name}
										</span>
									</td>
									<td className="px-4 py-4">
										<Link
											to={`/products/history/${item._id}`}
											className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 transition-colors duration-150"
										>
											View Details
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default WarrantyExpiringProductsTablesComponent;
