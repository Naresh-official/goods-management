import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminLogo from "../assets/admin-logo.svg";
import userLogo from "../assets/user-logo.svg";

function HeaderBar({ user }) {
	const [showMenu, setShowMenu] = useState(false);
	const navigator = useNavigate();

	const handleMenuClick = () => {
		setShowMenu(!showMenu);
	};

	const [isLoading, setLoading] = useState(false);

	return (
		<>
			{isLoading && (
				<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white rounded-xl p-8 shadow-2xl flex items-center space-x-4">
						<div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
						<h2 className="text-slate-700 font-medium">
							Loading please wait...
						</h2>
					</div>
				</div>
			)}
			{!isLoading && (
				<header className="bg-white min-h-[105px] border-b border-slate-200 shadow-sm">
					<div className="px-6 py-4 bg-white shadow-sm flex justify-between items-center">
						<div>
							<h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
								Goods Management
							</h1>
						</div>
						<div className="flex items-center justify-end">
							<div className="flex items-center bg-slate-50 rounded-xl p-3 border border-slate-200 hover:shadow-md transition-all duration-200">
								<div className="relative">
									<img
										src={
											user.role === "user"
												? userLogo
												: adminLogo ||
												  "/placeholder.svg"
										}
										alt="User Avatar"
										className="h-10 w-10 rounded-full border-2 border-teal-500 bg-teal-50 p-1.5 shadow-sm"
									/>
									<div
										className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
											user.role === "admin"
												? "bg-red-500"
												: "bg-teal-500"
										}`}
									></div>
								</div>
								<div className="ml-3 hidden sm:block">
									<h3 className="text-sm font-semibold text-slate-800 capitalize">
										{user.name}
									</h3>
									<span className="text-xs text-slate-500 ">
										{user.role} • {user.email}
									</span>
								</div>
							</div>
							<button
								className="ml-3 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
								onClick={handleMenuClick}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16m-7 6h7"
									/>
								</svg>
							</button>
						</div>
					</div>
				</header>
			)}
		</>
	);
}

export default HeaderBar;
