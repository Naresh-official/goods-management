"use client";

import { useState, useEffect, useRef } from "react";
import { Pie, Bar } from "react-chartjs-2";
import axios from "axios";

import "chart.js/auto";
import { SERVER_URL } from "../../../router";

export const AnalyticsComponent = () => {
	const [loading, setLoading] = useState(true);
	const [analyticsData, setAnalyticsData] = useState(null);
	const ref1 = useRef(null);
	const ref2 = useRef(null);
	const ref3 = useRef(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${SERVER_URL}/api/v1/analytics/`
				);
				setAnalyticsData(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setLoading(false);
			}
		};

		fetchData();

		return () => {
			ref1.current = null;
			ref2.current = null;
			ref3.current = null;
		};
	}, []);

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					padding: 20,
					usePointStyle: true,
					font: {
						size: 12,
						family: "Inter, system-ui, sans-serif",
					},
				},
			},
		},
	};

	const barChartOptions = {
		...chartOptions,
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: "#f1f5f9",
				},
				ticks: {
					font: {
						size: 11,
						family: "Inter, system-ui, sans-serif",
					},
				},
			},
			x: {
				grid: {
					display: false,
				},
				ticks: {
					font: {
						size: 11,
						family: "Inter, system-ui, sans-serif",
					},
				},
			},
		},
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
			{loading ? (
				<div className="col-span-full flex justify-center items-center py-12">
					<div className="text-center">
						<div className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-slate-500 font-medium">
							Loading analytics...
						</p>
					</div>
				</div>
			) : (
				<>
					<div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
						<div className="mb-4">
							<h3 className="text-lg font-semibold text-slate-800 mb-1">
								{analyticsData.useby.title}
							</h3>
							<p className="text-sm text-slate-500">
								Current usage distribution
							</p>
						</div>
						<div className="h-64">
							<Pie
								data={{
									labels: analyticsData.useby.labels,
									datasets: [
										{
											data: analyticsData.useby.data,
											backgroundColor: [
												"#0d9488",
												"#06b6d4",
												"#8b5cf6",
												"#f59e0b",
												"#ef4444",
											],
											borderWidth: 0,
											hoverBorderWidth: 2,
											hoverBorderColor: "#ffffff",
										},
									],
								}}
								options={chartOptions}
							/>
						</div>
					</div>

					<div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
						<div className="mb-4">
							<h3 className="text-lg font-semibold text-slate-800 mb-1">
								{analyticsData.expiry.title}
							</h3>
							<p className="text-sm text-slate-500">
								Warranty expiration timeline
							</p>
						</div>
						<div className="h-64">
							<Bar
								data={{
									labels: analyticsData.expiry.labels,
									datasets: [
										{
											label: analyticsData.expiry.title,
											data: analyticsData.expiry.data,
											backgroundColor: "#0d9488",
											borderRadius: 6,
											borderSkipped: false,
										},
									],
								}}
								options={barChartOptions}
							/>
						</div>
					</div>

					<div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
						<div className="mb-4">
							<h3 className="text-lg font-semibold text-slate-800 mb-1">
								{analyticsData.status.title}
							</h3>
							<p className="text-sm text-slate-500">
								Product status overview
							</p>
						</div>
						<div className="h-64">
							<Bar
								data={{
									labels: analyticsData.status.labels,
									datasets: [
										{
											label: analyticsData.status.title,
											data: analyticsData.status.data,
											backgroundColor: [
												"#ef4444",
												"#f59e0b",
												"#0d9488",
											],
											borderRadius: 6,
											borderSkipped: false,
										},
									],
								}}
								options={barChartOptions}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default AnalyticsComponent;
