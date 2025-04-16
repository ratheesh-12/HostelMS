
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { DataProvider } from "@/contexts/data-context";

// Pages
import LandingPage from "./pages/landing";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ComplaintsPage from "./pages/dashboard/complaints";
import UsersPage from "./pages/dashboard/users";
import RoomsPage from "./pages/dashboard/rooms";
import HostelsPage from "./pages/dashboard/hostels";
import ProfilePage from "./pages/dashboard/profile";
import DocumentsPage from "./pages/dashboard/documents";
import MyRoomPage from "./pages/dashboard/my-room";
import ReportsPage from "./pages/dashboard/reports";
import BookingsPage from "./pages/dashboard/bookings";
import StudentsPage from "./pages/dashboard/students";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/complaints" element={<ComplaintsPage />} />
                <Route path="/dashboard/users" element={<UsersPage />} />
                <Route path="/dashboard/rooms" element={<RoomsPage />} />
                <Route path="/dashboard/hostels" element={<HostelsPage />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
                <Route path="/dashboard/documents" element={<DocumentsPage />} />
                <Route path="/dashboard/my-room" element={<MyRoomPage />} />
                <Route path="/dashboard/reports" element={<ReportsPage />} />
                <Route path="/dashboard/bookings" element={<BookingsPage />} />
                <Route path="/dashboard/students" element={<StudentsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
