import { NavLink } from "react-router-dom";

import { FaBlog } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";

import { LuShoppingBag } from "react-icons/lu";
import { SiBrandfolder } from "react-icons/si";
import { BiLocationPlus, BiUser } from "react-icons/bi";
import LogoutButton from "./LogoutButton";

function SideNavbar() {
	const quickLinks = {
		title: "QUICK ACTIONS",
		links: [
			{ link: "", name: "Dashboard", icon: <IoMdHome />, end: true },
			{
				link: "/products/new",
				name: "New Product",
				icon: <AiFillProduct />,
				end: true,
			},
			{
				link: "/brands/new",
				name: "New Brand",
				icon: <FaBlog />,
				end: true,
			},
			{
				link: "/locations/new",
				name: "New Location",
				icon: <BiLocationPlus />,
				end: true,
			},
		],
	};
	const catalogLinks = {
		title: "MANAGEMENT",
		links: [
			{
				link: "/products",
				name: "Products",
				icon: <LuShoppingBag />,
				end: false,
			},
			{
				link: "/brands",
				name: "Brands",
				icon: <SiBrandfolder />,
				end: false,
			},
			{
				link: "/locations",
				name: "Locations",
				icon: <BiLocationPlus />,
				end: false,
			},
			{
				link: "/users",
				name: "User Management",
				icon: <BiUser />,
				end: false,
			},
		],
	};

	const links = [quickLinks, catalogLinks];
	return (
		<div className="h-[calc(100vh-105px)] w-64 flex flex-col bg-slate-50 border-r border-slate-200 overflow-y-hidden scrollbar">
			<div className="flex-1 py-4">
				{links.map((link, index) => (
					<div key={index} className="mb-8">
						<h3 className="px-6 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
							{link.title}
						</h3>
						<div className="space-y-1 px-3">
							{link.links.map((_link, idx) => (
								<NavLink
									end={_link.end}
									key={idx}
									to={_link.link}
									className={(prop) =>
										`${
											prop.isActive
												? "text-teal-700 bg-teal-50 border-r-4 border-teal-600 shadow-sm"
												: "text-slate-600 hover:text-teal-700 hover:bg-slate-100"
										} group flex items-center px-3 py-3 text-sm font-medium rounded-l-lg transition-all duration-200`
									}
								>
									<span className="mr-3 text-lg">
										{_link.icon}
									</span>
									<span className="truncate">
										{_link.name}
									</span>
								</NavLink>
							))}
						</div>
					</div>
				))}
			</div>

			<div className="border-t border-slate-200 p-3">
				<LogoutButton />
			</div>
		</div>
	);
}

export default SideNavbar;
