
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "staff" | "student" | string;
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, requiredRole, user]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 ml-[250px]">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
