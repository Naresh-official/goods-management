function ShowSuccessMesasge({ children }) {
	return (
		<div className="h-full flex items-center w-full justify-center py-12">
			<div className="max-w-md w-full mx-4">
				<div className="bg-teal-50 border border-teal-200 rounded-xl p-6 text-center shadow-sm">
					<div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-6 h-6 text-teal-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-teal-800 mb-2">
						Success!
					</h3>
					<div className="text-teal-700 font-medium">{children}</div>
				</div>
			</div>
		</div>
	);
}

export default ShowSuccessMesasge;
