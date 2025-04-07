"use client";

import {
	AudioWaveform,
	Calculator,
	Command,
	GalleryVerticalEnd,
	SquareTerminal,
  WavesIcon,
} from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
	user: {
		name: "Bruno Resende",
		email: "bruno@cbmgo.org",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Cálculo de Dimensionamento",
			logo: Calculator,
			plan: "CBMGO",
		},
	],
	navMain: [
		{
			title: "Hidrantes",
			url: "#",
			icon: WavesIcon,
			isActive: true,
			items: [
				{
					title: "Mais desfavorável",
					url: "#",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
