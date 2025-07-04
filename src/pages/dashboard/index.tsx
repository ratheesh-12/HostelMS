
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityLogList } from "@/components/dashboard/activity-log";
import {
  Building2,
  BedDouble,
  Users,
  CalendarClock,
  MessageSquare,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();
  const { hostels, rooms, bookings, complaints, activityLogs } = useData();

  // Calculate available and occupied rooms
  const availableRooms = rooms.filter((room) => room.status === "available").length;
  const occupiedRooms = rooms.filter((room) => room.status === "occupied").length;
  const pendingComplaints = complaints.filter((complaint) => complaint.status === "pending").length;

  // Role-specific dashboard content
  const renderAdminDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Hostels"
          value={hostels.length}
          icon={<Building2 size={24} />}
          description="Across all locations"
        />
        <StatsCard
          title="Total Rooms"
          value={rooms.length}
          icon={<BedDouble size={24} />}
          description={`${availableRooms} available, ${occupiedRooms} occupied`}
        />
        <StatsCard
          title="Active Bookings"
          value={bookings.length}
          icon={<CalendarClock size={24} />}
          description="Current semester"
        />
        <StatsCard
          title="Open Complaints"
          value={pendingComplaints}
          icon={<MessageSquare size={24} />}
          description="Awaiting response"
          trend={pendingComplaints > 5 ? "up" : "down"}
          trendValue={pendingComplaints > 5 ? "Above average" : "Below average"}
        />
        <StatsCard
          title="Reports Generated"
          value="12"
          icon={<FileText size={24} />}
          description="Last 30 days"
        />
        <StatsCard
          title="Total Users"
          value={(15 + 8 + 120).toString()}
          icon={<Users size={24} />}
          description="15 staff, 8 admins, 120 students"
        />
      </div>

      <div className="mt-6">
        <ActivityLogList logs={activityLogs} />
      </div>
    </>
  );

  const renderStaffDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Student Accounts"
          value="120"
          icon={<Users size={24} />}
          description="Active students"
        />
        <StatsCard
          title="Available Rooms"
          value={availableRooms}
          icon={<BedDouble size={24} />}
          description="Ready for assignment"
        />
        <StatsCard
          title="Open Complaints"
          value={pendingComplaints}
          icon={<MessageSquare size={24} />}
          description="Requiring attention"
          trend={pendingComplaints > 5 ? "up" : "down"}
          trendValue={pendingComplaints > 5 ? "Increased" : "Decreased"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            {complaints.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No complaints available</p>
            ) : (
              <div className="space-y-4">
                {complaints.slice(0, 5).map((complaint) => (
                  <div key={complaint.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <p className="font-medium">{complaint.studentName}</p>
                      <span className={`text-xs rounded-full px-2 py-1 ${
                        complaint.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500" : 
                        complaint.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500" : 
                        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                      }`}>
                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{complaint.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(complaint.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No bookings available</p>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{booking.studentName}</p>
                      <p className="text-sm">{booking.hostelName} - Room {booking.roomNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs rounded-full px-2 py-1 ${
                      booking.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500" : 
                      booking.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500" : 
                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderStudentDashboard = () => {
    // Find booking for the current student
    const studentBooking = bookings.find(
      (booking) => booking.studentId === user?.id
    );

    return (
      <>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Room</CardTitle>
            </CardHeader>
            <CardContent>
              {studentBooking ? (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden h-48 bg-muted">
                    <img
                      src="https://images.unsplash.com/photo-1578898887932-dce23a595ad4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                      alt="Room"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {studentBooking.hostelName} - Room {studentBooking.roomNumber}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Booking Date</p>
                        <p>{new Date(studentBooking.bookingDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="capitalize">{studentBooking.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Room Type</p>
                        <p className="capitalize">
                          {rooms.find(r => r.id === studentBooking.roomId)?.type || "Standard"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Yearly Fee</p>
                        <p>
                          ₹{rooms.find(r => r.id === studentBooking.roomId)?.price || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BedDouble className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Room Assigned</h3>
                  <p className="text-muted-foreground">
                    You haven't been assigned a room yet. Please contact the hostel staff.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              {complaints.filter(c => c.studentId === user?.id).length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Complaints</h3>
                  <p className="text-muted-foreground">
                    You haven't filed any complaints yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints
                    .filter(c => c.studentId === user?.id)
                    .map((complaint) => (
                      <div key={complaint.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <p className="font-medium">Complaint #{complaint.id.substring(1)}</p>
                          <span className={`text-xs rounded-full px-2 py-1 ${
                            complaint.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500" : 
                            complaint.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500" : 
                            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                          }`}>
                            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{complaint.message}</p>
                        {complaint.response && (
                          <div className="mt-2 pl-3 border-l-2 border-muted">
                            <p className="text-sm italic">{complaint.response}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Response from: {complaint.staffName}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Filed on: {new Date(complaint.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your {user?.role} account today.
        </p>
      </div>

      {user?.role === "admin" && renderAdminDashboard()}
      {user?.role === "staff" && renderStaffDashboard()}
      {user?.role === "student" && renderStudentDashboard()}
    </DashboardLayout>
  );
}
