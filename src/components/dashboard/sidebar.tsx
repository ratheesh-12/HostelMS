
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BedDouble, 
  CalendarClock, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  BookOpen,
  ChartBar,
  Verified
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
}

const NavItem = ({ icon, label, href, active, collapsed }: NavItemProps) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        active ? "bg-hostel-primary text-white" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Define navigation based on user role
  const getNavItems = () => {
    const baseItems = [
      { 
        icon: <LayoutDashboard size={20} />, 
        label: "Dashboard", 
        href: "/dashboard" 
      }
    ];

    const adminItems = [
      { 
        icon: <Users size={20} />, 
        label: "Users", 
        href: "/dashboard/users" 
      },
      { 
        icon: <Building2 size={20} />, 
        label: "Hostels", 
        href: "/dashboard/hostels" 
      },
      { 
        icon: <BedDouble size={20} />, 
        label: "Rooms", 
        href: "/dashboard/rooms" 
      },
      { 
        icon: <CalendarClock size={20} />, 
        label: "Bookings", 
        href: "/dashboard/bookings" 
      },
      { 
        icon: <MessageSquare size={20} />, 
        label: "Complaints", 
        href: "/dashboard/complaints" 
      },
      { 
        icon: <ChartBar size={20} />, 
        label: "Reports", 
        href: "/dashboard/reports" 
      }
    ];

    const staffItems = [
      { 
        icon: <Users size={20} />, 
        label: "Students", 
        href: "/dashboard/students" 
      },
      { 
        icon: <BedDouble size={20} />, 
        label: "Rooms", 
        href: "/dashboard/rooms" 
      },
      { 
        icon: <CalendarClock size={20} />, 
        label: "Bookings", 
        href: "/dashboard/bookings" 
      },
      { 
        icon: <MessageSquare size={20} />, 
        label: "Complaints", 
        href: "/dashboard/complaints" 
      },
      { 
        icon: <Verified size={20} />, 
        label: "Verification", 
        href: "/dashboard/documents" 
      }
    ];

    const studentItems = [
      { 
        icon: <BedDouble size={20} />, 
        label: "My Room", 
        href: "/dashboard/my-room" 
      },
      { 
        icon: <MessageSquare size={20} />, 
        label: "Complaints", 
        href: "/dashboard/complaints" 
      },
      { 
        icon: <FileText size={20} />, 
        label: "Documents", 
        href: "/dashboard/documents" 
      }
    ];

    const commonItems = [
      {
        icon: <UserCircle size={20} />,
        label: "Profile",
        href: "/dashboard/profile"
      }
    ];

    if (user?.role === "admin") return [...baseItems, ...adminItems, ...commonItems];
    if (user?.role === "staff") return [...baseItems, ...staffItems, ...commonItems];
    return [...baseItems, ...studentItems, ...commonItems];
  };

  const navItems = getNavItems();

  return (
    <div className={cn(
      "h-screen flex flex-col border-r bg-sidebar fixed transition-all",
      collapsed ? "w-[70px]" : "w-[250px]"
    )}>
      <div className="flex items-center justify-between h-14 px-3 border-b">
        {!collapsed && (
          <Link to="/" className="font-semibold text-lg">
            HostelMS
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>

      <div className="p-3 border-t">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
            </div>
          )}
          <div className="flex gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="rounded-full"
            >
              <LogOut size={18} />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
