import { useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../router";

function LogoutButton() {
	const [isLoading, setLoading] = useState(false);
	const navigator = useNavigate();

	const handleLogout = async () => {
		try {
			setLoading(true);
			const { data, status } = await axios.get(
				`${SERVER_URL}/api/v1/users/logout`,
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (status === 200) {
				navigator("/", { replace: true });
				window.location.reload();
			}
		} catch (error) {
			console.error("Something went wrong:", error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<button
			onClick={handleLogout}
			className={`${
				isLoading && "animate-pulse"
			} w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 font-medium text-red-700 hover:text-red-800 rounded-lg transition-all duration-200 group`}
		>
			<span className="flex items-center">
				<IoIosLogOut className="mr-2 text-lg" />
				Log out
			</span>
			{isLoading && (
				<div className="w-4 h-4">
					<div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
				</div>
			)}
		</button>
	);
}

export default LogoutButton;
