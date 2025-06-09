function LoadingIndicator() {
	return (
		<div className="h-full flex items-center w-full justify-center py-12">
			<div className="flex flex-col items-center space-y-4">
				<div className="relative">
					<div className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
					<div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-teal-400 rounded-full animate-spin animation-delay-150"></div>
				</div>
				<p className="text-sm text-slate-500 font-medium">Loading...</p>
			</div>
		</div>
	);
}

export default LoadingIndicator;
