import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import { AudioLines, BotMessageSquare, CalendarCheck2, CircleGauge, Images, Send, ShieldOff, } from "lucide-react"
import Image from "next/image"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: CircleGauge,
    },
    {
        title: "Submissions",
        url: "/submissions",
        icon: Send,
    },
    {
        title: "Social Media Management",
        url: "/social-media-management",
        icon: Images,
    },
    {
        title: "Task Management",
        url: "/task-management",
        icon: CalendarCheck2,
    },
    {
        title: "Quality Assurance",
        url: "/quality-assurance",
        icon: AudioLines,
    },
    {
        title: "Live Chat",
        url: "/live-chat",
        icon: BotMessageSquare,
    },
    {
        title: "Website Broken Check",
        url: "/website-broken-check",
        icon: ShieldOff,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Image src="/favlogo.svg" alt="logo" width={16} height={16} quality={100} />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">EvolveTech</span>
                                    <span className="">Innovations</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
