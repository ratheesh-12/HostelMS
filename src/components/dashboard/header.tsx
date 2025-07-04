
import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader() {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead } = useData();
  const [userNotifications, setUserNotifications] = useState(notifications);

  useEffect(() => {
    if (user) {
      const filtered = notifications.filter(n => n.userId === user.id);
      setUserNotifications(filtered);
    }
  }, [notifications, user]);

  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <header className="h-14 border-b px-4 flex items-center justify-between bg-background">
      <div className="md:hidden">
        <Link to="/" className="font-semibold text-lg">
          HostelMS
        </Link>
      </div>
      
      <div className="flex-1 md:flex md:justify-center">
        <div className="relative max-w-md w-full hidden md:block">
          <h1 className="text-xl font-semibold text-center">
            {user?.role === "admin" && "Admin Dashboard"}
            {user?.role === "staff" && "Staff Dashboard"}
            {user?.role === "student" && "Student Dashboard"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <BellIcon size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-hostel-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userNotifications.length === 0 ? (
              <div className="py-2 px-4 text-sm text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              userNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-3 cursor-pointer ${!notification.read ? 'bg-accent/10 font-medium' : ''}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${
                        notification.type === 'success' ? 'text-green-600 dark:text-green-400' : 
                        notification.type === 'warning' ? 'text-amber-600 dark:text-amber-400' : 
                        notification.type === 'error' ? 'text-red-600 dark:text-red-400' : 
                        'text-blue-600 dark:text-blue-400'
                      }`}>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
      </div>
    </header>
  );
}
