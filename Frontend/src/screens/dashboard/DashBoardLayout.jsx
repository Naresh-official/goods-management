"use client";

import { useEffect, useState } from "react";
import HeaderBar from "../../components/HeaderBar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import loginLogo from "../../assets/authenticate.svg";
import SideNavbar from "../../components/SideNavbar";
import { SERVER_URL } from "../../router";

function DashBoardLayout() {
	const navigator = useNavigate();
	const [data, setData] = useState(null);
	const [user, setUser] = useState(null);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		fetchUserInfo();
	}, []);
	const fetchUserInfo = async () => {
		try {
			const { data, status } = await axios.get(
				`${SERVER_URL}/api/v1/users/me`,

				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			console.log(data);
			if (status === 400) {
				// navigator("/auth");
			}
			if (status === 200) {
				setData(data);
				setUser(data.user);
				setLoading(false);
			}
		} catch (e) {
			// navigator("/auth");
			console.log(e);
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			{!data && (
				<div className="container mx-auto max-w-2xl mt-8 px-4">
					<div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center shadow-sm">
						<div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-6 h-6 text-amber-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-amber-800 mb-2">
							Authentication Required
						</h3>
						<p className="text-amber-700">
							You are not authenticated. Please login to continue.
						</p>
					</div>
				</div>
			)}

			{/* loading spinner animation */}
			{isLoading && (
				<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
					<div className="text-center">
						<div className="relative mb-6">
							<div className="w-16 h-16 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
							<div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-teal-400 rounded-full animate-spin animation-delay-150 mx-auto"></div>
						</div>
						<h1 className="text-xl font-semibold text-slate-700 animate-pulse">
							Loading your workspace...
						</h1>
						<p className="text-slate-500 mt-2">
							Please wait a moment
						</p>
					</div>
				</div>
			)}

			{/* showing the data from database */}
			{data && <HeaderBar user={data.user} />}
			{data && (
				<div className="flex h-[calc(100vh-105px)] w-full overflow-hidden bg-slate-50">
					<SideNavbar />

					<div className="flex-1 h-full bg-white overflow-hidden">
						<div className="h-full overflow-y-auto p-4">
							<Outlet context={[data, user]} />
						</div>
					</div>
				</div>
			)}

			{/* home screen logout component */}
			{!data && (
				<div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 flex items-center justify-center p-4">
					<div className="relative max-w-4xl w-full">
						<div className="absolute inset-0 bg-white rounded-3xl shadow-2xl transform rotate-1"></div>
						<div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
							<div className="grid lg:grid-cols-2 gap-0">
								<div className="p-12 flex flex-col justify-center">
									<h1 className="text-4xl font-bold text-slate-800 mb-4">
										Welcome to{" "}
										<span className="bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
											Goods Management
										</span>
									</h1>
									<p className="text-lg text-slate-600 mb-8 leading-relaxed">
										Streamline your inventory management
										with our powerful and intuitive
										platform. Track, manage, and optimize
										your goods with ease.
									</p>
									<Link
										to={"auth"}
										className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
									>
										<span>Get Started</span>
										<svg
											className="ml-2 w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 7l5 5m0 0l-5 5m5-5H6"
											/>
										</svg>
									</Link>
								</div>
								<div className="relative">
									<img
										src={loginLogo || "/placeholder.svg"}
										alt="Goods Management Illustration"
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-teal-600/20 to-transparent"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default DashBoardLayout;
