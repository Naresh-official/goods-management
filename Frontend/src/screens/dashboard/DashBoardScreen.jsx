import AnalyticsComponent from "./components/AnalyticsComponent";
import WarrantyExpiringProductsTablesComponent from "../../components/WarrantyExpiringProductsTableComponent";

function DashBoardScreen() {
	return (
		<div className="min-h-full bg-slate-50">
			<div className="px-8 py-6">
				{/* Header Section */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-slate-800 mb-2">
						Dashboard
					</h1>
					<p className="text-slate-600">
						Welcome back! Here's what's happening with your
						inventory.
					</p>
				</div>

				{/* Analytics Section */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold text-slate-800 mb-4">
						Analytics Overview
					</h2>
					<AnalyticsComponent />
				</div>

				{/* Warranty Expiring Products Section */}
				<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
						<h2 className="text-xl font-semibold text-slate-800">
							Warranty Expiring Soon
						</h2>
						<p className="text-sm text-slate-600 mt-1">
							Products that require attention
						</p>
					</div>
					<WarrantyExpiringProductsTablesComponent />
				</div>
			</div>
		</div>
	);
}

export default DashBoardScreen;
