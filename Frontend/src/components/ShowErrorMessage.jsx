function ShowErrorMessage({ children }) {
	return (
		<div className="h-full flex items-center w-full justify-center py-12">
			<div className="max-w-md w-full mx-4">
				<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center shadow-sm">
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
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-red-800 mb-2">
						Oops! Something went wrong
					</h3>
					<p className="text-red-600 mb-4">
						We encountered an error while loading the data.
					</p>
					<div className="text-red-700 font-medium">{children}</div>
				</div>
			</div>
		</div>
	);
}

export default ShowErrorMessage;
